import { useState, useEffect, useCallback } from 'react'
import { configApi } from '../api'
import type { Config } from '../types'

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfig = useCallback(async () => {
    setLoading(true)
    try {
      const res = await configApi.get()
      setConfig(res.data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  const updateConfig = async (data: Partial<Config>) => {
    await configApi.update(data)
    await fetchConfig()
  }

  return {
    config,
    loading,
    error,
    updateConfig,
    refresh: fetchConfig,
  }
}
