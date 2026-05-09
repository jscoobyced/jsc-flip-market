import { usePageTitle } from '@/hooks/usePageTitle'

const sections = [
  {
    title: 'Information we collect',
    body: 'Account details, property listings, enquiry messages, language preference, and authentication tokens are used to operate the marketplace experience.',
  },
  {
    title: 'How information is used',
    body: 'Your data powers role-aware navigation, listing management, buyer enquiries, and future backend integrations such as notifications and analytics.',
  },
  {
    title: 'Data retention',
    body: 'In this MVP, browser storage may be used to simulate backend persistence until production APIs are available. Production retention policies should be defined by the backend team.',
  },
  {
    title: 'Your choices',
    body: 'Users can update their profile information, change language preferences, and request listing changes through their marketplace account.',
  },
]

export function PrivacyPolicyPage() {
  usePageTitle('Privacy policy')

  return (
    <article className="glass-panel mx-auto max-w-4xl rounded-[2rem] p-6 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Legal</p>
      <h1 className="mt-3 text-4xl font-semibold text-white">Privacy Policy</h1>
      <p className="mt-4 text-slate-300">This policy describes how the frontend handles marketplace data while the project is in MVP mode.</p>
      <div className="mt-8 space-y-6">
        {sections.map((section) => (
          <section key={section.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold text-white">{section.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{section.body}</p>
          </section>
        ))}
      </div>
    </article>
  )
}
