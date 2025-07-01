import { AxiosStatic } from 'axios';
import { Logger } from 'heroku-logger';

const logger = new Logger({ prefix: 'solr-search: ' });

export enum Repository {
  MAVEN_CENTRAL = 'https://search.maven.org',
  SONATYPE_CENTRAL = 'https://central.sonatype.com'
}

class NotFoundError extends Error {
  response = { status: 404 };
  constructor () {
    super('not found');
  }
}

export const getLastArtifactVersion = async (axios: AxiosStatic, groupId: string, artifact: string, useGav: boolean = false, repository: Repository = Repository.MAVEN_CENTRAL) => {
  const url = `${repository}/solrsearch/select?q=g:${groupId}+AND+a:${artifact}&start=0${useGav ? '&core=gav' : ''}`
  logger.info(`Requesting url ${url}`);

  const { data } = await axios.get<any>(url);
  const { response } = data;
  if (response.numFound > 1) {
    logger.info(`Found last version of ${groupId}: ${response.numFound}`);
    const sorted = response.docs.sort((v1: { timestamp: number }, v2: { timestamp: number }) => {
      return v2.timestamp - v1.timestamp
    })
    return sorted[0].v;
  }
  if (response.numFound == 1) {
    logger.info(`Found last version of ${groupId}: ${response.numFound}`);
    return response.docs[0].v;
  }
  logger.info(`Not found ${groupId}: ${response.numFound}`);
  throw new NotFoundError();
};

export const getDefinedArtifactVersion = async (axios: AxiosStatic, groupId: string, artifact: string, version: string, repository: Repository = Repository.MAVEN_CENTRAL) => {
  const { data } = await axios.get<any>(`${repository}/solrsearch/select?q=g:${groupId}+AND+a:${artifact}+AND+v:${version}&start=0&rows=1`);
  const { response } = data;
  if (response.numFound > 0) {
    return response.docs[0].v;
  }
  throw new NotFoundError();
};

// NOTE: the eh= at the end of the URL may be a short-term solution to the changes made at maven central
export const getArtifactDetailsUrl = (groupId: string, artifact: string, version: string, repository: Repository = Repository.MAVEN_CENTRAL) =>
  `${repository}/artifact/${groupId}/${artifact}/${version}/jar?eh=`; // it would be ideal to pass in a extension here, as you could have situations like war, etc...

export const getSearchByGaUrl = (groupId: string, artifact: string, repository: Repository = Repository.MAVEN_CENTRAL) =>
  `${repository}/search?q=g:${groupId}+AND+a:${artifact}`;
