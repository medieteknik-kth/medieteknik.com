/**
 * Klass för att hämta data från API:t
 * Förhoppningsvis är funktionerna ganska obvious
 */

const BASE_URL = "/api/"

export default {
    /**
     * getItems: hämta data från API
     * @param endpoint: Api-endpoint att hämta från, t.ex. "documents" OBS: behövs inga snedstreck!
     * exempel på använding: API.getItems(documents).then(items => this.setState({loaded: items}))
     */
    getItems: (endpoint) => {
        return fetch(BASE_URL + endpoint)
          .then(res => res.json());
      }

}