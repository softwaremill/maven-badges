import * as express from 'express';
import PORT from './config';
import { lowerCaseFormatMiddleware, validateFormatMiddleware } from './middleware';

const PATH_PREFIX = 'maven-central';

export const app = express();

app.get(`/${PATH_PREFIX}/:group/:artifact/badge.:format`,
  lowerCaseFormatMiddleware,
  validateFormatMiddleware,
  (req, res) => {
    const { group, artifact, format } = req.params;
    res.send(`${group} ${artifact} ${format}`);
});

app.listen(PORT, () => {
  console.log(`server ready on port ${PORT}`);
});
