export const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.medieteknik.com/' : 'http://127.0.0.1:5000/';

function GetApiObject(resource) {
  return {
    GetAll(token = window.localStorage.getItem('user_token')) {
      return fetch(API_BASE_URL + resource, {
        headers: {
          token,
        },
      }).then((response) => response.json());
    },
    GetById(id, token = window.localStorage.getItem('user_token')) {
      return fetch(`${API_BASE_URL}${resource}/${id}`, {
        headers: {
          token,
        },
      }).then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
      });
    },
    Update(id, data, token = window.localStorage.getItem('user_token')) {
      return fetch(`${API_BASE_URL}${resource}/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        body: JSON.stringify(data),
      });
    },
    Create(data, token = window.localStorage.getItem('user_token')) {
      return fetch(API_BASE_URL + resource, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        body: JSON.stringify(data),
      });
    },
  };
}

function GetImage(path) {
  return API_BASE_URL + 'get_image?path=' + path;
}

export default {
  Officials: GetApiObject('officials'),
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
  Posts: GetApiObject('posts'),
  Events: GetApiObject('events'),
  Images: GetImage,
};
