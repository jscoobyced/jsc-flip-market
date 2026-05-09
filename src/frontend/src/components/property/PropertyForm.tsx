import { useMemo, useState } from 'react'
import { Button } from '@/components/common/Button'
import { FormField } from '@/components/common/FormField'
import { InlineNotice } from '@/components/feedback/InlineNotice'
import { propertyService } from '@/services/propertyService'
import type { PropertyFormValues } from '@/types/models'
import { filesToDataUrls } from '@/utils/file'
import { useI18n } from '@/hooks/useI18n'

interface PropertyFormProps {
  initialValues?: PropertyFormValues
  submitLabel: string
  onSubmit: (values: PropertyFormValues) => Promise<void>
}

const defaultValues: PropertyFormValues = {
  title: '',
  description: '',
  propertyType: 'single-family',
  address: '',
  city: '',
  state: '',
  zip: '',
  squareFootage: 0,
  yearBuilt: new Date().getFullYear(),
  condition: 'needs-work',
  askingPrice: 0,
  status: 'active',
  images: [],
}

export function PropertyForm({ initialValues, submitLabel, onSubmit }: PropertyFormProps) {
  const { t } = useI18n()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<PropertyFormValues>({ ...defaultValues, ...initialValues })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const propertyTypes = useMemo(() => propertyService.propertyTypes, [])
  const conditions = useMemo(() => propertyService.conditions, [])
  const statuses = useMemo(() => propertyService.statuses, [])

  const update = <K extends keyof PropertyFormValues>(key: K, value: PropertyFormValues[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const canContinue = Boolean(form.title && form.description && form.address && form.city && form.state && form.zip)

  async function handleImages(target: HTMLInputElement) {
    if (!target.files?.length) {
      return
    }
    const images = await filesToDataUrls(Array.from(target.files))
    setForm((current) => ({ ...current, images: [...current.images, ...images] }))
  }

  const steps = (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <span className={`rounded-full px-4 py-2 text-sm font-semibold ${step === 0 ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-slate-300'}`}>
        1. Basics
      </span>
      <span className={`rounded-full px-4 py-2 text-sm font-semibold ${step === 1 ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-slate-300'}`}>
        2. Media & review
      </span>
    </div>
  )

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8">
      {steps}
      {error ? <InlineNotice message={error} tone="error" /> : null}
      {step === 0 ? (
        <>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <FormField label="Listing title">
              <input className="form-control" onChange={(event) => update('title', event.target.value)} value={form.title} />
            </FormField>
          </div>
          <div className="md:col-span-2">
            <FormField label="Description">
              <textarea className="form-control min-h-32" onChange={(event) => update('description', event.target.value)} value={form.description} />
            </FormField>
          </div>
          <FormField label="Property type">
            <select className="form-control" onChange={(event) => update('propertyType', event.target.value as PropertyFormValues['propertyType'])} value={form.propertyType}>
              {propertyTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Condition">
            <select className="form-control" onChange={(event) => update('condition', event.target.value as PropertyFormValues['condition'])} value={form.condition}>
              {conditions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Address">
            <input className="form-control" onChange={(event) => update('address', event.target.value)} value={form.address} />
          </FormField>
          <FormField label="City">
            <input className="form-control" onChange={(event) => update('city', event.target.value)} value={form.city} />
          </FormField>
          <FormField label="State">
            <input className="form-control" onChange={(event) => update('state', event.target.value)} value={form.state} />
          </FormField>
          <FormField label="ZIP">
            <input className="form-control" onChange={(event) => update('zip', event.target.value)} value={form.zip} />
          </FormField>
          <FormField label="Square footage">
            <input className="form-control" min={0} onChange={(event) => update('squareFootage', Number(event.target.value))} type="number" value={form.squareFootage} />
          </FormField>
          <FormField label="Year built">
            <input className="form-control" min={1800} onChange={(event) => update('yearBuilt', Number(event.target.value))} type="number" value={form.yearBuilt} />
          </FormField>
          <FormField label="Asking price">
            <input className="form-control" min={0} onChange={(event) => update('askingPrice', Number(event.target.value))} type="number" value={form.askingPrice} />
          </FormField>
          <FormField label="Status">
            <select className="form-control" onChange={(event) => update('status', event.target.value as PropertyFormValues['status'])} value={form.status}>
              {statuses.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <div className="mt-8 flex flex-wrap justify-between gap-3">
          <span />
          <Button disabled={!canContinue} onClick={() => setStep(1)} type="button">
            {t('common.next')}
          </Button>
        </div>
        </>
      ) : (
        <form
          onSubmit={async (event) => {
            event.preventDefault()
            setLoading(true)
            setError(null)
            try {
              await onSubmit(form)
            } catch (reason) {
              setError(reason instanceof Error ? reason.message : 'Unable to save property')
            } finally {
              setLoading(false)
            }
          }}
        >
          <div className="space-y-6">
            <FormField label="Photos" hint="Upload multiple images to preview them instantly.">
              <input accept="image/*" className="form-control" multiple onChange={(event) => void handleImages(event.target)} type="file" />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {form.images.map((image, index) => (
                <div key={`${image.slice(0, 30)}-${index}`} className="overflow-hidden rounded-3xl border border-white/10">
                  <img alt={`Preview ${index + 1}`} className="h-44 w-full object-cover" src={image} />
                  <button
                    className="w-full border-t border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-rose-200 transition hover:bg-rose-400/20"
                    onClick={() => update('images', form.images.filter((_, current) => current !== index))}
                    type="button"
                  >
                    Remove image
                  </button>
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold text-white">Review</h3>
              <p className="mt-2 text-sm text-slate-300">{form.title || 'Give the property a strong title to help flippers understand the opportunity.'}</p>
              <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                <p><span className="text-slate-500">Location:</span> {form.address}, {form.city}, {form.state} {form.zip}</p>
                <p><span className="text-slate-500">Price:</span> ${form.askingPrice.toLocaleString()}</p>
                <p><span className="text-slate-500">Condition:</span> {form.condition}</p>
                <p><span className="text-slate-500">Media:</span> {form.images.length} images</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <Button onClick={() => setStep(0)} type="button" variant="secondary">
              {t('common.back')}
            </Button>
            <Button disabled={loading} type="submit">
              {loading ? t('common.saving') : submitLabel}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
