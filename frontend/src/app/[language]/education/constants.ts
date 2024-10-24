/**
 * Constants for the education page
 * NOTE: They are in a very strict order, and should be changed alongside each language file!
 */

interface Links {
  [key: string]: string[]
}

interface HP {
  [key: string]: number[]
}

const HP: HP = {
  math: [7.5, 7.5, 7.5, 9.0, 6.0],
  physics: [6.0],
  programming: [9.0],
  computer_science: [7.5, 7.5, 7.5, 6.0, 6.0],
  media_technology: [4.0, 7.5, 7.5, 6.0, 7.5, 7.5, 6.0, 7.5, 6.0, 6.0],
  broadening_skill: [7.5, 7.5, 7.5, 7.0],
  electives: [],
  degree_project: [30.0],
}

const LINKS: Links = {
  math: [
    'https://www.kth.se/student/kurser/kurs/SF1624',
    'https://www.kth.se/student/kurser/kurs/SF1625',
    'https://www.kth.se/student/kurser/kurs/SF1626',
    'https://www.kth.se/student/kurser/kurs/DD1318',
    'https://www.kth.se/student/kurser/kurs/SF1901',
  ],
  physics: ['https://www.kth.se/student/kurser/kurs/SK1120'],
  programming: ['https://www.kth.se/student/kurser/kurs/DD1318'],
  computer_science: [
    'https://www.kth.se/student/kurser/kurs/DH2642',
    'https://www.kth.se/student/kurser/kurs/DM1590',
    'https://www.kth.se/student/kurser/kurs/DH1622',
    'https://www.kth.se/student/kurser/kurs/DM1588',
    'https://www.kth.se/student/kurser/kurs/DD1320',
  ],
  media_technology: [
    'https://www.kth.se/student/kurser/kurs/SK1140',
    'https://www.kth.se/student/kurser/kurs/DM2573',
    'https://www.kth.se/student/kurser/kurs/ME1039',
    'https://www.kth.se/student/kurser/kurs/DM1581',
    'https://www.kth.se/student/kurser/kurs/DT1175',
    'https://www.kth.se/student/kurser/kurs/DM1590',
    'https://www.kth.se/student/kurser/kurs/DM1579',
    'https://www.kth.se/student/kurser/kurs/DM1595',
    'https://www.kth.se/student/kurser/kurs/DM1588',
    'https://www.kth.se/student/kurser/kurs/DM1580',
  ],
  broadening_skill: [
    'https://www.kth.se/student/kurser/kurs/DM2573',
    'https://www.kth.se/student/kurser/kurs/ME1039',
    'https://www.kth.se/student/kurser/kurs/DH1609',
    'https://www.kth.se/student/kurser/kurs/DM1578',
  ],
  electives: [],
  degree_project: [
    'https://www.kth.se/samverkan/exjobb/exjobb-i-kth-exjobbportal-1.292786',
  ],
}

const CATEGORY_COLORS = {
  math: '#1954A6',
  physics: '#008AE6',
  programming: '#DD6EA6',
  computer_science: '#BA2C73',
  media_technology: '#912259',
  broadening_skill: '#FF8000',
  electives: '#96969C',
  degree_project: '#62626A',
}

const CATEGORY_PERCENTAGES = {
  math: 22,
  physics: 3,
  programming: 5,
  computer_science: 14,
  media_technology: 28,
  broadening_skill: 13,
  electives: 7,
  degree_project: 8,
}

/**
 * Gets the link to a course
 * @param category The category that the course belongs to
 * @param index The index of the course
 * @param swedish Whether the link should be in swedish or not
 * @returns The link to the course
 */
export function getLink(
  category: string,
  index: number,
  swedish: boolean = true
): string {
  return LINKS[category][index] + (swedish ? '' : '?l=en')
}

/**
 * Gets the HP of a course
 * @param category The category that the course belongs to
 * @param index The index of the course
 * @returns The HP of the course
 */
export function getHP(category: string, index: number): number {
  return HP[category][index]
}

/**
 * Gets the color of a category
 * @param category The category to get the color for
 * @returns The color of the category
 */
export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]
}

/**
 * Gets the percentage of a category
 * @param category The category to get the percentage for
 * @returns The percentage of the category
 */
export function getCategoryPercentage(category: string): number {
  return CATEGORY_PERCENTAGES[category as keyof typeof CATEGORY_PERCENTAGES]
}
