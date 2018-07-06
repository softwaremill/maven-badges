import * as supertest from 'supertest';
import { app, PATH_PREFIX } from '../main';

describe('http endpoints', () => {
  let server: any;
  let request: any;

  before(done => {
    server = app.listen(done);
    request = supertest.agent(server);
  });

  after(done => {
    server.close(done);
  });

  describe('GET badge with format', () => {
    it('should succeed when groupId, artifact and badge format is correct', done => {
      request
        .get(`/${PATH_PREFIX}/com.typesafe.akka/akka/badge.png`)
        .timeout({ response: 15000 })
        .expect('Content-Type', 'image/png')
        .expect(200, done);
    });
  
    it('should succeed when groupId, artifact and badge format is correct and characters case does not matter', done => {
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

  describe('GET last_version', () => {
    it('should return artifact\'s last version number in plain text', done => {
      request
        .get(`/${PATH_PREFIX}/com.typesafe.akka/akka/last_version`)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200, done);
    });

    it('should return 404 for non-existing group/artifact', done => {
      request
        .get(`/${PATH_PREFIX}/non.existing/artifact/last_version`)
        .expect(404, done);
    });
  });
});

