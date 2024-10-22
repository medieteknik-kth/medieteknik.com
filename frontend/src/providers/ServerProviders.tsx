interface Props {
  children: React.ReactNode
}

/**
 * A React component that provides all the server providers for the application.
 *
 * @returns {Promise<React.ReactNode>} The rendered component.
 */
export default async function ServerProviders({
  children,
}: Props): Promise<React.ReactNode> {
  return children
}
