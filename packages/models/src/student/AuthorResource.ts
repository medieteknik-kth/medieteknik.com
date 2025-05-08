/**
 * @type AuthorResource
 * @description What resource(s) the author has access to
 *
 * @property {string} NEWS - News, can be used to create news articles
 * @property {string} EVENT - Event, can be used to create events
 * @property {string} DOCUMENT - Document, can be used to create documents
 * @property {string} ALBUM - Album, can be used to create albums
 */
export type AuthorResource = 'NEWS' | 'EVENT' | 'DOCUMENT' | 'ALBUM'
