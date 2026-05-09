import { usePageTitle } from '@/hooks/usePageTitle'

const sections = [
  {
    title: 'Marketplace access',
    body: 'FlipMarket connects property owners and flippers. By using the service you confirm that profile, listing, and contact details are accurate and lawfully provided.',
  },
  {
    title: 'Listing responsibilities',
    body: 'Owners are responsible for the accuracy of pricing, condition notes, imagery, and any disclosures related to a property. Flippers remain responsible for their own diligence.',
  },
  {
    title: 'Enquiry conduct',
    body: 'Users agree to communicate professionally, avoid spam, and respect the confidentiality of contact information exchanged through the platform.',
  },
  {
    title: 'Future updates',
    body: 'These terms may evolve as the marketplace expands. Continued use of the platform constitutes acceptance of the latest published terms.',
  },
]

export function TermsOfUsePage() {
  usePageTitle('Terms of use')

  return (
    <article className="glass-panel mx-auto max-w-4xl rounded-[2rem] p-6 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Legal</p>
      <h1 className="mt-3 text-4xl font-semibold text-white">Terms of Use</h1>
      <p className="mt-4 text-slate-300">These terms govern access to the FlipMarket frontend experience and the information shared by marketplace users.</p>
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
