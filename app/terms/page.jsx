// app/terms/page.jsx
import Link from 'next/link'

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By using MeetMate, you agree to these Terms of Service and our Privacy Policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. User Responsibilities</h2>
        <p className="mb-4">
          You are responsible for maintaining the confidentiality of your account and for all activities under your account.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Prohibited Conduct</h2>
        <p className="mb-4">
          You agree not to use the service for any unlawful purpose or in any way that could damage the service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Limitation of Liability</h2>
        <p className="mb-4">
          MeetMate shall not be liable for any indirect, incidental, or consequential damages.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right to modify these terms at any time. Continued use constitutes acceptance.
        </p>
      </section>

      <p className="mt-8">
        Contact us at bohrapulkit@gmail.com with any questions.
      </p>
    </div>
  )
}
