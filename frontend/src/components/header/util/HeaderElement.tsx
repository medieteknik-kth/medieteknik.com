/**
 * @interface HeaderElement
 *
 * @description An element in the header, with the title and the link to the page from the translation files
 * @property {string} title - The title of the element
 * @property {string} link - The link to the element
 * @property {object[]} subNavs - The sub-navigation elements of the header
 * @property {string} subNavs.icon - The icon of the sub-navigation element (optional)
 * @property {string} subNavs.title - The title of the sub-navigation element
 * @property {string} subNavs.description - The description of the sub-navigation element (optional)
 * @property {string} subNavs.link - The link to the sub-navigation element
 */
export interface HeaderElement {
  title: string
  link: string
  subNavs?: {
    icon?: string
    title: string
    description?: string
    link: string
  }[]
}
