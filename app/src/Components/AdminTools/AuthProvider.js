import {API_BASE_URL} from "../../Utility/Api";

export default {
  // authentication
  login: async () => {
    const response = await fetch(`${API_BASE_URL}auth`, { credentials: 'include' });

    if (!response.ok) {
      // eslint-disable-next-line no-restricted-globals
      location.replace(`${API_BASE_URL}login?redirect=${encodeURI(window.location)}`);
    }
  },
  checkError: (error) => {
    if (error.status === 403) {
      throw new Error('Not logged in');
    }
  },
  checkAuth: async (params) => {
    const response = await fetch(`${API_BASE_URL}auth`, { credentials: 'include' });
    if (response.status === 403) {
      throw new Error('Not logged in');
    }
  },
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}logout`);

    if (!response.ok) {
      throw new Error('Could not log out');
    }
  },
  getIdentity: async () => {
    const response = await fetch(`${API_BASE_URL}auth`, { credentials: 'include' });

    if (response.status === 403) {
      throw new Error('Not logged in');
    }

    const data = await response.json();

    return {
      id: 0,
      fullName: `${data.firstName} ${data.lastName}`,
      avatar: data.profilePicture,
    };
  },
  // authorization
  getPermissions: (params) => Promise.resolve(),
};
