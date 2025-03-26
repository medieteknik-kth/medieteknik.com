import { redirect } from 'next/navigation'

/**
 * @name DiscordPage
 * @description Redirects to the Discord server, if the invite ever expires, please create a new one.
 */
export default function DiscordPage() {
  redirect('https://discord.gg/j7XZmuaA')
}
