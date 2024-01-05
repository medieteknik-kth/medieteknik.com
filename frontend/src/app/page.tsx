import Image from 'next/image'
import Header from './components/header/header'
import Footer from './components/footer/footer'
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <Header />
      <Link href='/students/1'>Student 1</Link>
      <Footer />
    </main>
  )
}
