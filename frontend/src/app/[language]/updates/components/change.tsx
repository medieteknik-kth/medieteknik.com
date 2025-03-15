import {
  ExperimentalBadge,
  NewBadge,
  RemovedBadge,
  UpdatedBadge,
} from '@/components/badges/Updates'
import type { LanguageCode } from '@/models/Language'
import {
  BeakerIcon,
  SparklesIcon,
  TrashIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'

type ChangeType = 'new' | 'update' | 'remove' | 'experimental'

export interface Changes {
  title: string
  explanation?: string
}

interface ChangeProps {
  language: LanguageCode
  type: ChangeType
  changes: Changes[]
}

interface UpdateProps {
  id?: string
  title: string
  language: LanguageCode
  updateList: {
    type: ChangeType
    changes: Changes[]
  }[]
}

function getCorrectIcon(type: ChangeType) {
  switch (type) {
    case 'new':
      return (
        <SparklesIcon className='absolute top-4 right-4 w-8 h-8 text-muted-foreground/50' />
      )
    case 'update':
      return (
        <WrenchScrewdriverIcon className='absolute top-4 right-4 w-8 h-8 text-muted-foreground/50' />
      )
    case 'remove':
      return (
        <TrashIcon className='absolute top-4 right-4 w-8 h-8 text-muted-foreground/50' />
      )
    case 'experimental':
      return (
        <BeakerIcon className='absolute top-4 right-4 w-8 h-8 text-muted-foreground/50' />
      )
  }
}

function getCorrectBadge(type: ChangeType, language: LanguageCode) {
  switch (type) {
    case 'new':
      return <NewBadge language={language} />
    case 'update':
      return <UpdatedBadge language={language} />
    case 'remove':
      return <RemovedBadge language={language} />
    case 'experimental':
      return <ExperimentalBadge language={language} />
  }
}

function getCorrectColor(type: ChangeType) {
  switch (type) {
    case 'new':
      return 'shadow-green-600/50 border-green-600'
    case 'update':
      return 'shadow-yellow-400/50 border-yellow-400'
    case 'remove':
      return 'shadow-red-600/50 border-red-600'
    case 'experimental':
      return 'shadow-cyan-600/50 border-cyan-600'
    default:
      return 'shadow-gray-600/50 border-gray-600'
  }
}

async function Change(props: ChangeProps) {
  const { language, type, changes } = props
  return (
    <div
      className={`w-full border-2 rounded-xl p-6 shadow-sm space-y-4 bg-muted/50 ${getCorrectColor(type)} relative`}
    >
      {getCorrectIcon(type)}
      <div>{getCorrectBadge(type, language)}</div>

      <ul className='list-disc pl-4 space-y-1'>
        {changes.map((change) => (
          <li key={change.title}>
            {change.title}
            {change.explanation && (
              <p className='text-sm text-muted-foreground'>
                {change.explanation}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default async function Update(props: UpdateProps) {
  const { id, title, language, updateList } = props
  return (
    <section id={id} className='space-y-4'>
      <h3 className='text-xl font-bold mb-2 tracking-tight'>{title}</h3>
      {updateList.map((update) => (
        <Change
          key={update.type}
          language={language}
          type={update.type}
          changes={update.changes}
        />
      ))}
    </section>
  )
}
