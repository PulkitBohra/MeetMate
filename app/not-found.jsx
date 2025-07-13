
import { Suspense } from 'react'

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  )
}

function NotFoundContent() {
  // You can use useSearchParams here if needed
  return (
    <div>
      <h1>404 - Page Not Found</h1>
    </div>
  )
}
