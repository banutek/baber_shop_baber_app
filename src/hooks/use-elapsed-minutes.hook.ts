import { useEffect, useState } from 'react'

/**
 * Returns the number of whole minutes elapsed since the given date,
 * updated every 30 seconds.
 */
export const useElapsedMinutes = (since: Date | string | undefined): number | null => {
  const [elapsed, setElapsed] = useState<number | null>(null)

  useEffect(() => {
    if (!since) {
      setElapsed(null)
      return
    }

    const date = typeof since === 'string' ? new Date(since) : since

    const tick = () => {
      const diff = Date.now() - date.getTime()
      setElapsed(Math.floor(diff / 60_000))
    }

    tick() // initial
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [since])

  return elapsed
}
