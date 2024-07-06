import { cache } from 'react';
import api from './index';
import { Event } from '@/models/Items';

export const GetEvents = cache(async (date: Date) => {
  const converted = date.toISOString().substring(0, 7)
  const response = await api.get('/public/calendar/events?date=' + converted);

  if (response.status === 200) {
      return response.data as Event[]
  }

  return null
})