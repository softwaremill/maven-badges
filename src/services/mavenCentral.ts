import axios from 'axios';

const BASE_URI = 'http://search.maven.org';

class NotFoundErrror extends Error {
  response = { status: 404 };
  constructor () {
    super('not found');
  }
}

export const getLastArtifactVersion = async (groupId: string, artifact: string) => {
  const { data } = await axios.get(`${BASE_URI}/solrsearch/select?q=g:"${groupId}"a:"${artifact}"&rows=1&wt=json`);
  const { response } = data;
  if (response.numFound > 0) {
    return response.docs[0].latestVersion;
  }
  throw new NotFoundErrror();
}
