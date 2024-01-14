import axios from 'axios';
import { useCookies } from 'next-client-cookies';

const api = axios.create({
    baseURL: 'http://localhost:5000',
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

/**
 * Retrieves all supported languages from the backend
 * @returns  {Promise<string[]>} A promise that resolves to an array of strings
 */
export const getAllLanguages = async (): Promise<string[]> => {
    const response = await api.get('/language');
    return response.data;
}