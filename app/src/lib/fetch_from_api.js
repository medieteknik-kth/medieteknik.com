/**
 * Funktion för att hämta data från API:t
 * Importera och anropa den här funktionen i ComponentDidMount(), här är ett exempel:
 *  const data = fetchData('documents')
 *  this.setState({documents: data})
 * @param endpoint: api-endpointen du vill hämta data från
 * @returns den hämrade datan i JSON-format
 */
export default fetchData = (endpoint) => {
    return fetch(`${BASE_URL}/${endpoint}`).then(res => res.json());
}

const BASE_URL = "/api"