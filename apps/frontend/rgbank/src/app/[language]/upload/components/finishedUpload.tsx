import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function FinishedUpload() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      className='flex flex-col items-center justify-center gap-4 bg-white py-10 w-fit px-24 h-fit'
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.5 }}
        className='flex items-center justify-center w-16 h-16 rounded-full bg-green-100'
      >
        <CheckCircleIcon className='w-16 h-16 text-green-500' />
      </motion.div>
      <h1 className='text-2xl font-bold'>Upload Complete</h1>
      <p className='text-muted-foreground'>
        Your files have been successfully uploaded.
      </p>
    </motion.div>
  )
}
