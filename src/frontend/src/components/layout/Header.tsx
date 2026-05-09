import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Button, LinkButton } from '@/components/common/Button'
import { LanguageSelector } from '@/components/layout/LanguageSelector'
import { useAuth } from '@/hooks/useAuth'
import { useI18n } from '@/hooks/useI18n'

function navClass(active: boolean) {
  return active
    ? 'text-cyan-300'
    : 'text-slate-300 transition hover:text-white'
}

export function Header() {
  const navigate = useNavigate()
  const { isAuthenticated, logout, user } = useAuth()
  const { t } = useI18n()

  const profileLink =
    user?.role === 'OWNER'
      ? `/owners/${user.id}`
      : user
        ? `/flippers/${user.id}`
        : '/login'

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="page-shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-5">
          <Link className="text-lg font-semibold tracking-wide text-white" to="/">
            {t('nav.brand')}
          </Link>
          <nav className="hidden items-center gap-5 md:flex">
            <NavLink className={({ isActive }) => navClass(isActive)} to="/properties/search">
              {t('nav.browse')}
            </NavLink>
            {user?.role === 'OWNER' ? (
              <NavLink className={({ isActive }) => navClass(isActive)} to="/dashboard">
                {t('nav.dashboard')}
              </NavLink>
            ) : null}
            {user?.role === 'OWNER' ? (
              <NavLink className={({ isActive }) => navClass(isActive)} to={`/owners/${user.id}/listings`}>
                {t('nav.ownerListings')}
              </NavLink>
            ) : null}
            {user?.role === 'OWNER' ? (
              <NavLink className={({ isActive }) => navClass(isActive)} to="/properties/new">
                {t('nav.listProperty')}
              </NavLink>
            ) : null}
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LanguageSelector />
          {isAuthenticated && user ? (
            <>
              <LinkButton className="hidden sm:inline-flex" to={profileLink} variant="secondary">
                {user.name}
              </LinkButton>
              <Button
                className="sm:inline-flex"
                variant="ghost"
                onClick={() => {
                  logout()
                  void navigate('/')
                }}
              >
                {t('nav.logout')}
              </Button>
            </>
          ) : (
            <>
              <LinkButton to="/login" variant="ghost">
                {t('nav.login')}
              </LinkButton>
              <LinkButton to="/register">{t('nav.register')}</LinkButton>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
