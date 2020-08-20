import { AxiosStatic } from 'axios';

const BASE_URI = 'https://search.maven.org';

class NotFoundErrror extends Error {
  response = { status: 404 };
  constructor () {
    super('not found');
  }
}

export const getLastArtifactVersion = async (axios: AxiosStatic, groupId: string, artifact: string, useGav: boolean = false) => {
  const url = `${BASE_URI}/solrsearch/select?q=g:${groupId}+AND+a:${artifact}&start=0&rows=1${useGav ? '&core=gav' : ''}`
  const { data } = await axios.get(url);
  const { response } = data;
  if (response.numFound > 0) {
    return response.docs[0].latestVersion;
  }
  throw new NotFoundErrror();
};

export const getDefinedArtifactVersion = async (axios: AxiosStatic, groupId: string, artifact: string, version: string) => {
  const { data } = await axios.get(`${BASE_URI}/solrsearch/select?q=g:${groupId}+AND+a:${artifact}+AND+v:${version}&start&rows=1`);
  const { response } = data;
  if (response.numFound > 0) {
    return response.docs[0].v;
  }
  throw new NotFoundErrror();
};

export const getArtifactDetailsUrl = (groupId: string, artifact: string, version: string) =>
  `${BASE_URI}/artifact/${groupId}/${artifact}/${version}/jar`; // it would be ideal to pass in a extension here, as you could have situations like war, etc...

export const getSearchByGaUrl = (groupId: string, artifact: string) =>
  `${BASE_URI}/search?g:${groupId}+AND+a:${artifact}&core=gav`;
