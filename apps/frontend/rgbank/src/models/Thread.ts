import type Student from '@/models/Student'

export interface Thread {
  thread_id: string
  messages?: Message[]
  unread_messages: Message[]
}

export interface Message {
  message_id: string
  content: string
  created_at: string
  read_at?: string
  sender: Student
}
