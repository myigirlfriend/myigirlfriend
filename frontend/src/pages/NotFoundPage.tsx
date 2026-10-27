import { Link } from 'react-router-dom'
import ButtonLink from '@components/common/ButtonLink'
import Logo from '@components/common/Logo'
import { usePageTitle } from '@hooks/usePageTitle'

export default function NotFoundPage() {
  usePageTitle('Page not found')

  return (
    <div className="page flex flex-col">
      <div className="frame flex h-20 items-center">
        <Link to="/" className="rounded-full" aria-label="myigirlfriend home"><Logo /></Link>
      </div>
      <main className="frame flex flex-1 flex-col justify-center pb-24">
        <p className="display text-[clamp(120px,26vw,320px)] text-brand-plum-3" aria-hidden="true">404</p>
        <h1 className="heading mt-6 text-4xl md:text-6xl">This page is not here.</h1>
        <p className="mt-4 max-w-[40ch] text-lg text-brand-muted">
          The link may be old or mistyped. Your chats are safe.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <ButtonLink to="/" size="lg">Go to the home page</ButtonLink>
          <Link to="/chat" className="link text-lg">Open my chats</Link>
        </div>
      </main>
    </div>
  )
}
