export const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.medieteknik.com/' : 'http://127.0.0.1:5000/';

export function GetApiObject(resource) {
  return {
    GetAllWithFullObject(token = window.localStorage.getItem('authtoken')) {
      return fetch(API_BASE_URL + resource, {
        headers: {
          token,
        },
      }).then((response) => response.json());
    },
    GetAll(token = window.localStorage.getItem('authtoken')) {
      return fetch(API_BASE_URL + resource, {
        headers: {
          token,
        },
      }).then((response) => response.json().then((data) => Promise.resolve(data.data)));
    },
    GetById(id, token = window.localStorage.getItem('authtoken')) {
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
    GetWithParameters(parameters, token = window.localStorage.getItem('authtoken')) {
      return fetch(`${API_BASE_URL}${resource}?${Object.entries(parameters).map(([key, val]) => `${key}=${val}`).join('&')}`, {
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
    Update(id, data, token = window.localStorage.getItem('authtoken'), asJson = true) {
      return asJson ? fetch(`${API_BASE_URL}${resource}/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        body: JSON.stringify(data)
      }) : fetch(`${API_BASE_URL}${resource}/${id}`, {
        method: "PUT",
        headers: {
          token
        },
        body: data
      });
    },
    Create(data, token = window.localStorage.getItem('authtoken')) {
      return fetch(API_BASE_URL + resource, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        body: JSON.stringify(data),
      });
    },
    PostForm(data, token = window.localStorage.getItem('authtoken')) {
      return fetch(API_BASE_URL + resource, {
        method: "POST",
        headers: {
          token,
        },
        body: data,
      });
    },
    Delete(id, token = window.localStorage.getItem('authtoken')) {
      return fetch(`${API_BASE_URL}${resource}/${id}`, {
        method: "DELETE",
        headers: {
          token,
        },
      }).then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
      });
    }
  };
}

function GetImage(path) {
  return API_BASE_URL + 'get_image?path=' + path;
}

export default {
  Officials: GetApiObject('officials'),
  OperationalYears: GetApiObject('operational_years'),
  Committees: GetApiObject('committees'),
  Me: {
    Committees: GetApiObject('me/committees')
  },
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
  CommitteePosts: (id) => GetApiObject(`committees/${id}/posts`),
  Albums: GetApiObject('albums'),
  Videos: GetApiObject('video'),
  Playlists: GetApiObject('video_playlist'),
};
