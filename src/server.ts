import * as express from 'express';
import { lowerCaseFormatMiddleware, validateFormatMiddleware } from './middleware';
import { getLastArtifactVersion, getArtifactDetailsUrl, getSearchByGaUrl, getDefinedArtifactVersion } from './services/mavenCentral';
import { getBadgeImage } from './services/shields';
import RedisClientWrapper from './services/redisClientWrapper';
import { AxiosStatic } from 'axios';
import { Logger } from 'heroku-logger';

export const PATH_PREFIX = 'maven-central';

const DEFAULT_COLOR = 'brightgreen';
const NOT_FOUND_COLOR = 'lightgray';
const DEFAULT_SUBJECT = 'maven central';

export function createServer (axios: AxiosStatic, redisClient: RedisClientWrapper) {
  const app = express();
  const logger = new Logger({ prefix: 'server: ' });

  app.get(`/${PATH_PREFIX}/:group/:artifact/badge.:format`, lowerCaseFormatMiddleware, validateFormatMiddleware, async (req, res) => {
    const { group, artifact, format } = req.params;
    const { subject, color, style, version, gav } = req.query;
    const useGav = (gav || 'false') == 'true';
    const lastVersion = version
      ? await getDefinedArtifactVersion(axios, group, artifact, version as string).catch(() => 'unknown')
      : await getLastArtifactVersion(axios, group, artifact, useGav).catch(() => 'unknown');

    logger.info(`Latest version of ${group}:${artifact} is ${lastVersion}`)

    try {
      const badge = await getBadgeImage(axios, redisClient, subject as string || DEFAULT_SUBJECT, lastVersion, color as string || DEFAULT_COLOR, format, style as string);
      res.set('Cache-Control', 'public, max-age=43200'); // 12 hours
      res.contentType(format).send(badge);
    } catch {
      res.status(500).end();
    }
  });

  app.get(`/${PATH_PREFIX}/:group/:artifact/last_version`, async (req, res) => {
    const { group, artifact } = req.params;
    try {
      const lastVersion = await getLastArtifactVersion(axios, group, artifact, true);
      res.send(lastVersion);
    } catch (error) {
      res.status(error.response.status).end();
    }
  });

  app.get(`/${PATH_PREFIX}/:group/:artifact/?`, async (req, res) => {
    const { group, artifact } = req.params;
    const { gav } = req.query;
    const useGav = (gav || 'false') == 'true';
    try {
      logger.info(`Resolving the latest version of ${group} and ${artifact} with using gav ${useGav}`)
      const lastVersion = await getLastArtifactVersion(axios, group, artifact, useGav);
      res.redirect(getArtifactDetailsUrl(group, artifact, lastVersion));
    } catch {
      res.redirect(getSearchByGaUrl(group, artifact));
    }
  });

  return app;
}
