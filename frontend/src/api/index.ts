import Committee from '@/models/Committee';
import axios from 'axios';
import { useCookies } from 'next-client-cookies';
import { cache } from 'react'

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
});

export const GetCommittees = cache(async (committee: string, language_code: string) => {
    const response = await api.get(`/public/committees/${committee}?language_code=${language_code}`);

    if (response.status === 200) {
        return response.data as Committee
    }

    return null
})