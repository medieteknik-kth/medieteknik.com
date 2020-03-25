function GetApiObject(resource) {
  const API_BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://api.medieteknik.com/"
      : "http://localhost:5000/";
  return {
    GetAll() {
      return fetch(API_BASE_URL + resource).then(response => response.json());
    },
    GetById(id) {
      return fetch(`${API_BASE_URL}${resource}/${id}`).then(response =>
        response.json()
      );
    },
    Update(id, data) {
      return fetch(`${API_BASE_URL}${resource}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
    },
    Create(data) {
      return fetch(API_BASE_URL + resource, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
    }
  };
}

export default {
  Committees: GetApiObject("committees"),
  Officials: GetApiObject("officials"),
  Pages: GetApiObject("pages")
};
