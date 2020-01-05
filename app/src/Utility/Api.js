function GetApiObject(resource) {
  const API_BASE_URL = 'http://localhost:5000/';
  return {
    GetAll() { return fetch(API_BASE_URL + resource).then((response) => response.json()); },
  };
}

export default {
  Committees: GetApiObject('committees'),
};
