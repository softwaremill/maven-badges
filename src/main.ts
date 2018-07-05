import * as express from 'express';
import PORT from './config';

const app = express();

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
