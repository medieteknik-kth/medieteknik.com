import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { LanguageCode } from '@/models/Language'

interface Props {
  language: LanguageCode
}

export default function AccountPage({ language }: Props) {
  return (
    <section className='w-full max-w-[1100px] flex mb-8 2xl:mb-0'>
      <form className='w-full flex flex-col gap-4 max-h-[725px] overflow-y-auto'>
        <div className='-full mb-4 px-4 pt-4'>
          <h2 className='text-lg font-bold'>Account</h2>
          <p className='text-sm text-muted-foreground'>
            Accounts relevant to this app, you can manage the rest of your
            account in the{' '}
            <a
              href='#' // TODO: Add link to main app settings
              className='text-primary underline hover:text-primary/90'
            >
              main app settings
            </a>
            .
          </p>
          <Separator className='bg-yellow-400 mt-4' />
        </div>

        <div className='px-4'>
          <Label htmlFor='bank' className='text-sm font-semibold'>
            Bank Name
          </Label>
          <p className='text-xs text-muted-foreground'>
            Bank name is the name of the bank where your account is held.
          </p>

          <Input id='bank' />
        </div>

        <div className='px-4'>
          <Label htmlFor='clearing_number' className='text-sm font-semibold'>
            Clearing Number
          </Label>
          <p className='text-xs text-muted-foreground'>
            Clearing number is a unique identifier for your bank account. It is
            used to identify the bank associated with your account.
          </p>
          <Input id='clearing_number' />
        </div>

        <div className='px-4'>
          <Label htmlFor='account_number' className='text-sm font-semibold'>
            Account Number
          </Label>
          <p className='text-xs text-muted-foreground'>
            Account number is an identifier for your bank account. It is used to
            identify who owns the account and who should the money be sent to.
          </p>
          <Input id='account_number' />
        </div>

        <Button type='submit' className='mx-4'>
          Save Changes
        </Button>
      </form>
    </section>
  )
}
