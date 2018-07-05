import * as supertest from 'supertest';
import { app } from '../main';

describe('GET badge with format', () => {
  let server: any;
  let request: any;

  before((done) => {
    server = app.listen(done);
    request = supertest.agent(server);
  });

  after((done) => {
    server.close(done);
  });

  it('should return 200 when badge format is correct', (done) => {
    request
      .get('/maven-central/group/artifact/badge.png')
      .expect(200, done);
  });

  it('should return 200 when badge format is correct and characters case does not matter', (done) => {
    request
      .get('/maven-central/group/artifact/badge.SVG')
      .expect(200, done);
  });

  it('should return 415 when badge format is incorrect', (done) => {
    request
      .get('/maven-central/group/artifact/badge.mov')
      .expect(415, done);
  });
});
