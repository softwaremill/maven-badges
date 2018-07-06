import * as supertest from 'supertest';
import { app, PATH_PREFIX } from '../main';

describe('GET badge with format', () => {
  let server: any;
  let request: any;

  before(done => {
    server = app.listen(done);
    request = supertest.agent(server);
  });

  after(done => {
    server.close(done);
  });

  it('should return 200 when groupId, artifact and badge format is correct', done => {
    request
      .get(`/${PATH_PREFIX}/com.typesafe.akka/akka/badge.png`)
      .timeout({ response: 15000 })
      .expect('Content-Type', 'image/png')
      .expect(200, done);
  });

  it('should return 200 when groupId, artifact and badge format is correct and characters case does not matter', done => {
    request
      .get(`/${PATH_PREFIX}/com.typesafe.akka/akka/badge.SVG`)
      .timeout({ response: 15000 })
      .expect('Content-Type', 'image/svg+xml')
      .expect(200, done);
  });

  it('should return 415 when badge format is incorrect', done => {
    request
      .get(`/${PATH_PREFIX}/com.typesafe.akka/akka/badge.mov`)
      .timeout({ response: 15000 })
      .expect(415, done);
  });
});
