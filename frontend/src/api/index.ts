import axios from 'axios';
import { useCookies } from 'next-client-cookies';

const api = axios.create({
    baseURL: 'http://localhost:8000',
});

/**
 * Retrieves a student from the backend
 * @param id The student's id
 * @returns  {Promise<Student>} A promise that resolves to a Student object
 */
export const getStudent = async (id: number): Promise<any> => {
    const cookies = useCookies();

    const studentData = cookies.get('student');
    if (studentData) {
        return studentData;
    }

    const response = await api.get(`/student/${id}`);

    cookies.set('student', response.data, { expires: 7 });
    return response.data;
}

export const getStudentPreferences = async (id: number): Promise<any> => {
    const cookies = useCookies();

    const studentData = cookies.get('student');
    if (studentData) {
        return studentData;
    }

    const response = await api.get(`/student/${id}/preferences`);

    cookies.set('student', cookies.get('student') + response.data, { expires: 7 });
    return response.data;
}