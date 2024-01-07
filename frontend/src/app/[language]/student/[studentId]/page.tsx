export default function UserPage( 
  { params }: 
  { params: { studentId: string }}
) {
  return <p>Hello Student: { params.studentId } 👋</p>
}