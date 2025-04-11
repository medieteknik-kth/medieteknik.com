import type { ExpenseStatus } from '@/models/General'
import type Student from '@/models/Student'

export type MessageType = 'STUDENT' | 'SYSTEM'

export interface Thread {
  thread_id: string
  messages?: Message[]
  unread_messages?: Message[]
}

export interface Message {
  message_id: string
  content: string
  created_at: string
  read_at?: string
  message_type: MessageType
  sender?: Student
  previous_status?: ExpenseStatus
  new_status?: ExpenseStatus
}
