import { AxiosStatic } from 'axios';
import { Logger } from 'heroku-logger';

const logger = new Logger({ prefix: 'maven-central: ' });

const BASE_URI = 'https://search.maven.org';

class NotFoundErrror extends Error {
  response = { status: 404 };
  constructor () {
    super('not found');
  }
}

export const getLastArtifactVersion = async (axios: AxiosStatic, groupId: string, artifact: string, useGav: boolean = false) => {
  const url = `${BASE_URI}/solrsearch/select?q=g:${groupId}+AND+a:${artifact}&start=0&rows=1${useGav ? '&core=gav' : ''}`
  logger.info(`Requesting url ${url}`);

  const { data } = await axios.get<any>(url);
  const { response } = data;
  if (response.numFound > 0) {
    return response.docs[0].latestVersion || response.docs[0].v;
  }
  throw new NotFoundErrror();
};

export const getDefinedArtifactVersion = async (axios: AxiosStatic, groupId: string, artifact: string, version: string) => {
  const { data } = await axios.get<any>(`${BASE_URI}/solrsearch/select?q=g:${groupId}+AND+a:${artifact}+AND+v:${version}&start&rows=1`);
  const { response } = data;
  if (response.numFound > 0) {
    return response.docs[0].v;
  }
  throw new NotFoundErrror();
};

// NOTE: the eh= at the end of the URL may be a short-term solution to the changes made at maven central
export const getArtifactDetailsUrl = (groupId: string, artifact: string, version: string) =>
  `${BASE_URI}/artifact/${groupId}/${artifact}/${version}/jar?eh=`; // it would be ideal to pass in a extension here, as you could have situations like war, etc...

export const getSearchByGaUrl = (groupId: string, artifact: string) =>
  `${BASE_URI}/search?q=g:${groupId}+AND+a:${artifact}`;
