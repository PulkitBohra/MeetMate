
'use client'

import { useSearchParams } from 'next/navigation'

export default function NotFoundContent() {
  const searchParams = useSearchParams()
  const query = searchParams.toString()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      {query && (
        <p className="text-lg">No match for: {query}</p>
      )}
    </div>
  )
}
