import { Head } from '@/components/static/Static'
import Logo from 'public/images/logo.png'
import { API_BASE_URL } from '@/utility/Constants'
import Image from 'next/image'
import Link from 'next/link'
import Committee, { CommitteeCategory } from '@/models/Committee'

/**
 * Retrieves committee category data from the API based on the specified language.
 *
 * @param {string} language - The language code for which to retrieve the data.
 * @return {Promise<CommitteeCategoryProps[]>} A promise that resolves to an array of CommitteeCategoryProps objects representing the retrieved data.
 * @throws {Error} If the API request fails or the server is down.
 */
async function getCommitteeCategoryData(language: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/public/committee_categories?language_code=${language}`
    )

    if (response.ok) {
      const data = await response.json()
      return data as CommitteeCategory[]
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * Retrieves committee data from the API based on the specified language.
 *
 * @param {string} language_code - The language code for which to retrieve the data.
 * @return {Promise<CommitteeProps[]>} A promise that resolves to an array of CommitteeProps objects representing the retrieved data.
 * @throws {Error} If the API request fails or the server is down.
 */
async function getCommitteeData(language_code: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/public/committees?language_code=${language_code}`
    )

    if (response.ok) {
      const data = await response.json()
      return data as Committee[]
    }
  } catch (error) {
    console.error(error)
  }
}

export default async function Committees({
  params: { language },
}: {
  params: { language: string }
}) {
  const committeeCategoryData = await getCommitteeCategoryData(language)
  const committeeData = await getCommitteeData(language)

  if (!committeeCategoryData || !committeeData) {
    return <div>Not found</div>
  }

  return (
    <main className='w-screen'>
      <div className='h-24 bg-black' />
      <Head title='Committees' />

      <div className='w-full flex flex-col items-center py-20'>
        {committeeCategoryData.map((category, index) => (
          <section key={index} className='w-1/2 h-fit flex flex-col mb-20'>
            <h2 className='text-4xl uppercase tracking-wider border-b-2 border-yellow-400 pb-4'>
              {category.translation.title}
            </h2>
            <div className='w-full h-fit *:h-[200px] grid grid-cols-5 gap-8 my-4'>
              {committeeData
                .filter(
                  (committee) =>
                    committee.committee_category_id ===
                    category.committee_category_id
                )
                .sort((a, b) =>
                  a.translation.title.localeCompare(b.translation.title)
                )
                .map((item, index) => (
                  <Link
                    href={`./committees/${item.translation.title.toLowerCase()}`}
                    title={item.translation.title}
                    aria-label={item.translation.title}
                    key={index}
                    className='relative shadow-[0_0px_10px_1px] shadow-yellow-400/50 transition-transform hover:scale-110 hover:hover:font-bold'
                  >
                    <Image
                      src={item.logo_url || Logo.src}
                      alt={`${item.translation.title}icon`}
                      width={300}
                      height={300}
                      className='w-[120px] h-[120px] absolute -top-8 left-0 right-0 bottom-0 m-auto'
                    />
                    <h3 className='uppercase text-sm bg-[#232323] py-2 text-white absolute bottom-0 w-full text-center'>
                      {item.translation.title}
                    </h3>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
