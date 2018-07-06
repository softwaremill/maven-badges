import * as express from 'express';
import PORT from './config';
import { lowerCaseFormatMiddleware, validateFormatMiddleware } from './middleware';
import { getLastArtifactVersion, getArtifactDetailsUrl, getSearchByGaUrl } from './services/mavenCentral';
import { getBadgeImage } from './services/shields';

export const PATH_PREFIX = 'maven-central';

const DEFAULT_COLOR = 'brightgreen';
const NOT_FOUND_COLOR = 'lightgray';
const DEFAULT_SUBJECT = 'maven central';

export const app = express();

app.get(`/${PATH_PREFIX}/:group/:artifact/badge.:format`, lowerCaseFormatMiddleware, validateFormatMiddleware, async (req, res) => {
  const { group, artifact, format } = req.params;
  const { subject, color, style } = req.query;
  try {
    const lastVersion = await getLastArtifactVersion(group, artifact);
    const badge = await getBadgeImage(subject || DEFAULT_SUBJECT, lastVersion, color || DEFAULT_COLOR, format, style);
    res.contentType(format).send(badge);
  } catch {
    const badge = await getBadgeImage(subject || DEFAULT_SUBJECT, 'unknown', NOT_FOUND_COLOR, format, style);
    res.contentType(format).send(badge);
  }
});

app.get(`/${PATH_PREFIX}/:group/:artifact/last_version`, async (req, res) => {
  const { group, artifact } = req.params;
  try {
    const lastVersion = await getLastArtifactVersion(group, artifact);
    res.send(lastVersion);
  } catch (error) {
    res.status(error.response.status).end();
  }
});

app.get(`/${PATH_PREFIX}/:group/:artifact/?`, async (req, res) => {
  const { group, artifact } = req.params;
  try {
    const lastVersion = await getLastArtifactVersion(group, artifact);
    res.redirect(getArtifactDetailsUrl(group, artifact, lastVersion));
  } catch {
    res.redirect(getSearchByGaUrl(group, artifact));
  }
});

app.listen(PORT, () => {
  console.log(`server ready on port ${PORT}`);
});
