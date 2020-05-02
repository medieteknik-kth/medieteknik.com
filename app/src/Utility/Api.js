export const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.medieteknik.com/' : 'http://localhost:5000/';

function GetApiObject(resource) {
  return {
    GetAll(token = null) {
      return fetch(API_BASE_URL + resource, {
        headers: {
          token,
        },
      }).then((response) => response.json());
    },
    GetById(id, token = null) {
      return fetch(`${API_BASE_URL}${resource}/${id}`, {
        headers: {
          token,
        },
      }).then((response) => response.json());
    },
    Update(id, data, token = null) {
      return fetch(`${API_BASE_URL}${resource}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        body: JSON.stringify(data),
      });
    },
    Create(data, token = null) {
      return fetch(API_BASE_URL + resource, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        body: JSON.stringify(data),
      });
    },
  };
}

export default {
  Committees: GetApiObject('committees'),
  Pages: GetApiObject('pages'),
  Documents: GetApiObject('documents'),
  Authenticate: (token) => fetch(`${API_BASE_URL}auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `token=${token}`,
  }).then((response) => response.json()),
  Users: GetApiObject('users'),
};
