// app/privacy/page.jsx
import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <p className="mb-4">
          We collect information you provide directly when you register, create events, 
          or communicate with us. This may include your name, email address, and meeting preferences.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">
          Your information is used to provide and improve our services, communicate with you, 
          and personalize your experience.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
        <p className="mb-4">
          We implement appropriate security measures to protect your personal information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this policy occasionally. We'll notify you of significant changes.
        </p>
      </section>

      <p className="mt-8">
        For any questions, please contact us at bohrapulkit@gmail.com
      </p>
    </div>
  )
}
