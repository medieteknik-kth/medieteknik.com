import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'

export default function UserPage( 
  { params: { studentId, language } }: 
  { params: { studentId: string, language: string }}
) {
  return (
  <div>
    <Header params={{ language }} />
    <p>Hello Student: { studentId } 👋</p>
    <Footer params={{ language }}/>
  </div>
  
  )
}