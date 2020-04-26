const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.medieteknik.com/' : 'http://localhost:5000/';

function GetApiObject(resource) {
  return {
    GetAll() {
      return fetch(API_BASE_URL + resource).then((response) => response.json());
    },
    GetById(id) {
      return fetch(`${API_BASE_URL}${resource}/${id}`).then((response) => response.json());
    },
    Update(id, data) {
      return fetch(`${API_BASE_URL}${resource}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    },
    Create(data) {
      return fetch(API_BASE_URL + resource, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    }
  };
}

function GetImage(path) {
  return API_BASE_URL + 'get_image?path=' + path;
}

export default {
  Committees: GetApiObject('committees'),
  Pages: GetApiObject('pages'),
  Users: GetApiObject('users'),
  Documents: GetApiObject('documents'),
  Posts: GetApiObject('posts'),
  Images: GetImage,
};
