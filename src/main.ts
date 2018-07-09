import PORT from './config';
import { createServer } from './server';

const app = createServer();

app.listen(PORT, () => {
  console.log(`server ready on port ${PORT}`);
});
