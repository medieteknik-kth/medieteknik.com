function GetApiObject(resource) {
  const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://dev.medieteknik.com/' : 'http://localhost:5000/';
  return {
    GetAll() { return fetch(API_BASE_URL + resource).then((response) => response.json()); },
    GetById(id) { return fetch(API_BASE_URL + resource + "/" + id).then(response => resource.json()); }
  };
}

export default {
  Committees: GetApiObject('committees'),
};
