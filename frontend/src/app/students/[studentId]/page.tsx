import { useRouter } from "next/router";

export default function UserPage({ 
    params 
}: {
    params: { studentId: string }
}) {
    return <p>Hello Student: { params.studentId } 👋</p>
}