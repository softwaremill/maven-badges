import { AxiosStatic } from 'axios';

const BASE_URI = 'http://search.maven.org';

class NotFoundErrror extends Error {
  response = { status: 404 };
  constructor () {
    super('not found');
  }
}

export const getLastArtifactVersion = async (axios: AxiosStatic, groupId: string, artifact: string) => {
  const { data } = await axios.get(`${BASE_URI}/solrsearch/select?q=g:"${groupId}"a:"${artifact}"&rows=1&wt=json`);
  const { response } = data;
  if (response.numFound > 0) {
    return response.docs[0].latestVersion;
  }
  throw new NotFoundErrror();
};

export const getDefinedArtifactVersion = async (axios: AxiosStatic, groupId: string, artifact: string, version: string) => {
  const { data } = await axios.get(`${BASE_URI}/solrsearch/select?q=g:"${groupId}"a:"${artifact}"v:"${version}"&rows=1&wt=json`);
  const { response } = data;
  if (response.numFound > 0) {
    return response.docs[0].v;
  }
  throw new NotFoundErrror();
};

export const getArtifactDetailsUrl = (groupId: string, artifact: string, version: string) =>
  `${BASE_URI}/#artifactdetails%7C${groupId}%7C${artifact}%7C${version}%7C`;

export const getSearchByGaUrl = (groupId: string, artifact: string) =>
  `${BASE_URI}/#search%7Cga%7C1%7Cg:"${groupId}"a:"${artifact}"`;
