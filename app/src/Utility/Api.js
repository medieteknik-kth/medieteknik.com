export const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://api.medieteknik.com/' : 'http://localhost:5000/';

export function GetApiObject(resource) {
  return {
    GetAllWithFullObject() {
      return fetch(API_BASE_URL + resource, {
        credentials: 'include'
      }).then((response) => response.json());
    },
    GetAll() {
      return fetch(API_BASE_URL + resource, {
        credentials: 'include'
      }).then((response) => response.json().then((data) => Promise.resolve(data.data)));
    },
    GetById(id) {
      return fetch(`${API_BASE_URL}${resource}/${id}`, {
        credentials: 'include'
      }).then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
      });
    },
    GetWithParameters(parameters) {
      return fetch(`${API_BASE_URL}${resource}?${Object.entries(parameters).map(([key, val]) => `${key}=${val}`).join('&')}`, {
        credentials: 'include'
      }).then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
      });
    },
    Update(id, data, asJson = true) {
      return asJson ? fetch(`${API_BASE_URL}${resource}/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
      }) : fetch(`${API_BASE_URL}${resource}/${id}`, {
        method: "PUT",
        credentials: 'include',
        body: data
      });
    },
    Create(data) {
      return fetch(API_BASE_URL + resource, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      }).then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
      });
    },
    PostForm(data) {
      return fetch(API_BASE_URL + resource, {
        method: "POST",
        credentials: 'include',
        body: data,
      });
    },
    Delete(id) {
      return fetch(`${API_BASE_URL}${resource}/${id}`, {
        method: "DELETE",
        credentials: 'include',
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
