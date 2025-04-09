import * as express from 'express';
import { lowerCaseFormatMiddleware, optionalRedirect, validateFormatMiddleware } from './middleware';
import {
  getArtifactDetailsUrl,
  getDefinedArtifactVersion,
  getLastArtifactVersion,
  getSearchByGaUrl,
  Repository
} from './services/solrsearch';
import { getBadgeImage } from './services/shields';
import { AxiosStatic } from 'axios';
import { Logger } from 'heroku-logger';
import { extractAxiosErrorStatus, isAxiosError } from './utils';
import { RedisClientType } from 'redis';

export const MAVEN_CENTRAL_PREFIX = 'maven-central';
export const SONATYPE_CENTRAL_PREFIX = 'sonatype-central'

const DEFAULT_COLOR = 'brightgreen';
const MAVEN_SUBJECT = 'maven central';
const SONATYPE_SUBJECT = 'sonatype central';

const allMiddlewares = [lowerCaseFormatMiddleware, validateFormatMiddleware];

export function createServer (axios: AxiosStatic, redisClient: RedisClientType) {
  const app = express();
  const logger = new Logger({ prefix: 'server: ' });

  function getSubject(subject: any, repository: Repository) {
    return (subject as string) || (repository === Repository.MAVEN_CENTRAL ? MAVEN_SUBJECT : SONATYPE_SUBJECT);
  }

  async function handleBadgeRequest(req: any, res: any, repository: Repository) {
    const {group, artifact, format} = req.params;
    const {subject, color, style, version, gav} = req.query;
    const useGav = (gav || 'false') == 'true';
    const lastVersion = version
      ? await getDefinedArtifactVersion(axios, group, artifact, version as string, repository).catch(() => 'unknown')
      : await getLastArtifactVersion(axios, group, artifact, useGav, repository).catch(() => 'unknown');

    logger.info(`Latest version of ${group}:${artifact} is ${lastVersion} using ${repository}`);

    try {
      const badge = await getBadgeImage(axios, redisClient, getSubject(subject, repository), lastVersion, color as string || DEFAULT_COLOR, format, style as string);
      res.set('Cache-Control', 'public, max-age=43200'); // 12 hours
      res.contentType(format).send(badge);
    } catch {
      res.status(500).end();
    }
  }

  app.use(optionalRedirect)

  app.get(`/${MAVEN_CENTRAL_PREFIX}/:group/:artifact/badge.:format`, [...allMiddlewares, async (req: any, res: any) => {
    await handleBadgeRequest(req, res, Repository.MAVEN_CENTRAL);
  }]);

  app.get(`/${SONATYPE_CENTRAL_PREFIX}/:group/:artifact/badge.:format`, [...allMiddlewares, async (req: any, res: any) => {
    await handleBadgeRequest(req, res, Repository.SONATYPE_CENTRAL);
  }]);

  async function handleLastVersionRequest(req: any, res: any, repository: Repository) {
    const {group, artifact} = req.params;
    try {
      const useGav = true;
      const lastVersion = await getLastArtifactVersion(axios, group, artifact, useGav, repository);
      res.send(lastVersion);
    } catch (error) {
      res.status(isAxiosError(error) ? extractAxiosErrorStatus(error) : 0).end();
    }
  }

  app.get(`/${MAVEN_CENTRAL_PREFIX}/:group/:artifact/last_version`, async (req, res) => {
    await handleLastVersionRequest(req, res, Repository.MAVEN_CENTRAL);
  });

  app.get(`/${SONATYPE_CENTRAL_PREFIX}/:group/:artifact/last_version`, async (req, res) => {
    await handleLastVersionRequest(req, res, Repository.SONATYPE_CENTRAL);
  });

  async function handleAnyVersionRequest(req: any, res: any, repository: Repository) {
    const {group, artifact} = req.params;
    const {gav} = req.query;
    const useGav = (gav || 'false') == 'true';
    try {
      logger.info(`Resolving the latest version of ${group} and ${artifact} with using gav ${useGav}`)
      const lastVersion = await getLastArtifactVersion(axios, group, artifact, useGav, repository);
      res.redirect(getArtifactDetailsUrl(group, artifact, lastVersion, repository));
    } catch {
      res.redirect(getSearchByGaUrl(group, artifact, repository));
    }
  }

  app.get(`/${MAVEN_CENTRAL_PREFIX}/:group/:artifact/{:any}`, async (req, res) => {
    await handleAnyVersionRequest(req, res, Repository.MAVEN_CENTRAL);
  });

  app.get(`/${MAVEN_CENTRAL_PREFIX}/:group/:artifact`, async (req, res) => {
    await handleAnyVersionRequest(req, res, Repository.MAVEN_CENTRAL);
  });

  app.get(`/${SONATYPE_CENTRAL_PREFIX}/:group/:artifact/{:any}`, async (req, res) => {
    await handleAnyVersionRequest(req, res, Repository.SONATYPE_CENTRAL);
  });

  app.get(`/${SONATYPE_CENTRAL_PREFIX}/:group/:artifact`, async (req, res) => {
    await handleAnyVersionRequest(req, res, Repository.SONATYPE_CENTRAL);
  });

  return app;
}
