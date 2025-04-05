import * as supertest from 'supertest';
import { config, Config } from '../config';
import { createServer, SONATYPE_CENTRAL_PREFIX } from "../server";
import axios from "axios";
import * as redis from 'redis-mock';
import { RedisClientType } from "redis";

describe('optionalRedirect middleware', () => {
  let server: any;
  let request: any;

  before((done) => {
    const mockRedisClient = redis.createClient({}) as unknown as RedisClientType;

    server = createServer(axios, mockRedisClient).listen(done);

    request = supertest.agent(server);
  });

  after(done => {
    server.close(done);
  });

  describe('if enabled should redirect', () => {
    it('should redirect to the default REDIRECT_URL with query parameters once REDIRECT is set to "true"', done => {
      config.redirect = 'true';

      request
        .get(`/${SONATYPE_CENTRAL_PREFIX}/com.typesafe.akka/akka-streams/badge.png?gav=true`)
        .expect('location', `https://maven-badges.sml.io/${SONATYPE_CENTRAL_PREFIX}/com.typesafe.akka/akka-streams/badge.png?gav=true`)
        .expect(301, done);
    });

    it('should redirect to the new REDIRECT_URL with query parameters', done => {
      config.redirect = 'true';
      config.redirectUrl = 'https://newhost.com';

      request
        .get(`/${SONATYPE_CENTRAL_PREFIX}/com.typesafe.akka/akka-streams/badge.png?gav=true`)
        .expect('location', `https://newhost.com/${SONATYPE_CENTRAL_PREFIX}/com.typesafe.akka/akka-streams/badge.png?gav=true`)
        .expect(301, done);
    });

    it('should not redirect if REDIRECT is false', done => {
      config.redirect = 'false';
      config.redirectUrl = 'https://newhost.com';

      request
        .get(`/${SONATYPE_CENTRAL_PREFIX}/com.typesafe.akka/akka/badge.png`)
        .expect(200, done);
    });

    it('should not redirect if REDIRECT_URL is empty', done => {
      config.redirect = 'true';
      config.redirectUrl = '';

      request
        .get(`/${SONATYPE_CENTRAL_PREFIX}/com.typesafe.akka/akka/badge.png`)
        .expect(200, done);
    });
  });
});
