import { useCallback, useEffect, useRef, useState, type DependencyList } from 'react'

export function useAsyncData<T>(loader: () => Promise<T>, deps: DependencyList) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const loaderRef = useRef(loader)

  const refetch = useCallback(() => setReloadToken((current) => current + 1), [])

  useEffect(() => {
    loaderRef.current = loader
  }, [loader])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    loaderRef.current()
      .then((response) => {
        if (active) {
          setData(response)
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : 'Unexpected error')
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [...deps, reloadToken])

  return { data, loading, error, refetch }
}
