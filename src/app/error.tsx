'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <h2 className="text-2xl font-bold">Er is iets misgegaan</h2>
      <p className="text-gray-600">
        Er is een fout opgetreden bij het laden van deze pagina.
      </p>
      <Button
        onClick={reset}
        variant="outline"
      >
        Probeer opnieuw
      </Button>
    </div>
  )
} 