import * as supertest from 'supertest';
import * as redis from 'redis-mock';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createServer, SONATYPE_CENTRAL_PREFIX } from '../server';
import { RedisClientType } from "redis";

describe('sonatype central http endpoints', () => {
  let server: any;
  let request: any;

  before(done => {
    const mockAxios = new MockAdapter(axios);
    mockAxios
      .onGet('https://central.sonatype.com/solrsearch/select?q=g:com.typesafe.akka+AND+a:akka&start=0&rows=1000')
      .reply(200, {response: {numFound: 3, docs: [{v: '2.2.0-RC2'}, {v: '2.2.0-RC1'}, {v: '2.3-B1'}]}});
    mockAxios
      .onGet('https://central.sonatype.com/solrsearch/select?q=g:com.typesafe.akka+AND+a:akka-streams&start=0&rows=1000&core=gav')
      .reply(200, {response: {numFound: 1, docs: [{v: '2.2.0-RC2'}]}});
    mockAxios
      .onGet('https://central.sonatype.com/solrsearch/select?q=g:com.typesafe.akka+AND+a:akka-streams+AND+v:2.1.0&start=0&rows=1')
      .reply(200, {response: {numFound: 1, docs: [{v: '2.1.0'}]}});
    mockAxios
      .onGet(/http:\/\/img.shields.io\/badge\/sonatype_central-2.2.0--RC2-brightgreen.(png|svg)\?style=default/)
      .reply(200, new Buffer([1, 2, 3]));
    mockAxios
      .onGet(/http:\/\/img.shields.io\/badge\/sonatype_central-2.1.0-brightgreen.(png|svg)\?style=default/)
      .reply(200, new Buffer([1, 2, 3]));

    const mockRedisClient = redis.createClient({}) as unknown as RedisClientType;
    server = createServer(axios, mockRedisClient).listen(done);
    request = supertest.agent(server);
  });

  after(done => {
    server.close(done);
  });

  describe('GET badge with format', () => {
    it('should succeed when groupId, artifact and badge format is correct', done => {
      request
        .get(`/${SONATYPE_CENTRAL_PREFIX}/com.typesafe.akka/akka/badge.png`)
        .expect('Content-Type', 'image/png')
        .expect(200, done);
    });

    it('should succeed when groupId, artifact and badge format is correct and characters case does not matter', done => {
      request
        .get(`/${SONATYPE_CENTRAL_PREFIX}/com.typesafe.akka/akka/badge.SVG`)
        .expect('Content-Type', 'image/svg+xml')
        .expect(200, done);
    });

    it('should return 415 when badge format is incorrect', done => {
      request
        .get(`/${SONATYPE_CENTRAL_PREFIX}/com.typesafe.akka/akka/badge.mov`)
        .expect(415, done);
    });

    it('should succeed when groupId, artifact and badge format is correct with gav set to true', done => {
      request
        .get(`/${SONATYPE_CENTRAL_PREFIX}/com.typesafe.akka/akka-streams/badge.png?gav=true`)
        .expect('Content-Type', 'image/png')
        .expect(200, done);
    });
  });

  describe('GET last_version', () => {
    it('should return artifact\'s last version number in plain text', done => {
      request
        .get(`/${SONATYPE_CENTRAL_PREFIX}/com.typesafe.akka/akka-streams/last_version`)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200, done);
    });

    it('should return 404 for non-existing group/artifact', done => {
      request
        .get(`/${SONATYPE_CENTRAL_PREFIX}/non.existing/artifact/last_version`)
        .expect(404, done);
    });
  });

  describe('GET fixed version', () => {
    it('should return artifact\'s fixed version number', done => {
      request
        .get(`/${SONATYPE_CENTRAL_PREFIX}/com.typesafe.akka/akka-streams/badge.png?version=2.1.0`)
        .expect('Content-Type', 'image/png')
        .expect(200, done);
    });
  });

  describe('GET info about group/artifact', () => {
    it('should redirect to maven artifact details page', done => {
      request
        .get(`/${SONATYPE_CENTRAL_PREFIX}/com.typesafe.akka/akka/?`)
        .expect('location', 'https://central.sonatype.com/artifact/com.typesafe.akka/akka/2.3-B1/jar?eh=')
        .expect(302, done);
    });

    it('should redirect to maven search page', done => {
      request
        .get(`/${SONATYPE_CENTRAL_PREFIX}/non.existing/artifact/?`)
        .expect('location', 'https://central.sonatype.com/search?q=g:non.existing+AND+a:artifact')
        .expect(302, done);
    });

    it('should redirect to maven search page without a backslash', done => {
      request
        .get(`/${SONATYPE_CENTRAL_PREFIX}/non.existing/artifact`)
        .expect('location', 'https://central.sonatype.com/search?q=g:non.existing+AND+a:artifact')
        .expect(302, done);
    });
  });
});

