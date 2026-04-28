import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Tripverse',
  description: 'Privacy Policy for Tripverse.',
}

export default function PrivacyPage() {
  return (
    <main className="trips-page">
      <section className="trip-detail-stripe">
        <div className="trip-detail-landing-inner">
          <div className="trip-detail-shell">
            <article className="trip-detail-card legal-content mx-auto w-full max-w-4xl border border-[#E5E5EA] bg-white px-6 py-7 md:px-10 md:py-9">
              <h1 className="trip-detail-title">Privacy Policy for Tripverse</h1>
              <p className="trip-detail-route-line">Last Updated: April 28, 2026</p>

              <p className="rationale-summary">
                At Tripverse (&quot;we,&quot; &quot;us,&quot; &quot;the App,&quot; or &quot;the Service&quot;), we respect your
                privacy and are committed to protecting your personal data. This Privacy Policy
                explains how we collect, use, share, and protect your information when you use our
                mobile application and website (tripverse.app).
              </p>
              <p className="rationale-summary">
                By using Tripverse, you agree to the practices described in this policy.
              </p>

              <h2 className="trip-detail-section-heading">1. Data Controller</h2>
              <p className="rationale-summary">
                The data controller responsible for your personal information is the independent
                developer of the application, operating from Spain. For any inquiries regarding
                privacy and data protection, you can contact us via email at:{' '}
                <a href="mailto:support@tripverse.app">support@tripverse.app</a>.
              </p>

              <h2 className="trip-detail-section-heading">2. Information We Collect</h2>
              <p className="rationale-summary">
                To provide you with the best route optimization experience, we collect the following
                categories of data:
              </p>
              <ul className="trip-detail-bullet-list">
                <li>
                  <strong>Account and Registration Data:</strong> When you create an account, we
                  collect your email address and basic profile information through our secure
                  authentication provider.
                </li>
                <li>
                  <strong>Trip Data:</strong> We collect the destinations, dates, preferences, and
                  the order of locations you input into the app to calculate and optimize your
                  itineraries.
                </li>
                <li>
                  <strong>Usage and Device Data:</strong> We collect information about how you
                  interact with our website and app (screens visited, clicks, loading times) to
                  improve product performance.
                </li>
                <li>
                  <strong>Payment Data:</strong> We do not directly store or process your credit card
                  information. Subscriptions and payments are managed entirely and securely by Apple
                  (App Store) via your Apple ID.
                </li>
              </ul>

              <h2 className="trip-detail-section-heading">3. How We Use Your Information</h2>
              <p className="rationale-summary">
                We use the collected information for the following purposes:
              </p>
              <ul className="trip-detail-bullet-list">
                <li>
                  To provide and maintain the core service of Tripverse (route calculation and
                  itinerary management).
                </li>
                <li>
                  To personalize the user experience and optimize results using Artificial
                  Intelligence.
                </li>
                <li>To analyze usage metrics to identify bugs and improve the user interface.</li>
                <li>
                  To communicate with you regarding technical support or important notices about your
                  account.
                </li>
              </ul>

              <h2 className="trip-detail-section-heading">4. Third-Party Services</h2>
              <p className="rationale-summary">
                Tripverse uses highly trusted third-party service providers to function optimally.
                These providers have their own privacy policies and adhere to high security standards:
              </p>
              <ul className="trip-detail-bullet-list">
                <li>
                  <strong>Supabase:</strong> We use this service to host our cloud database and
                  manage user authentication with end-to-end encryption.
                </li>
                <li>
                  <strong>Artificial Intelligence (AI) Services:</strong> Your destination and route
                  data are processed through advanced language models (such as Gemini) to generate
                  content and logical routing. We do not share your Personally Identifiable
                  Information (PII), such as your name or email, with these AI engines.
                </li>
                <li>
                  <strong>Microsoft Clarity:</strong> We use this analytics tool to understand how
                  users interact with our web platform to improve design and usability.
                </li>
                <li>
                  <strong>Cloudflare:</strong> Provides infrastructure, hosting, and security for our
                  web platform.
                </li>
              </ul>

              <h2 className="trip-detail-section-heading">5. Your Rights (GDPR)</h2>
              <p className="rationale-summary">
                In accordance with the General Data Protection Regulation (GDPR) of the European
                Union, you have the right to:
              </p>
              <ul className="trip-detail-bullet-list">
                <li>
                  <strong>Access:</strong> Request a copy of the personal data we hold about you.
                </li>
                <li>
                  <strong>Rectification:</strong> Request the correction of any inaccurate or
                  incomplete data.
                </li>
                <li>
                  <strong>Erasure (Right to be Forgotten):</strong> Request the complete deletion of
                  your account and data. You can delete your account directly from the settings menu
                  within the iOS app at any time.
                </li>
                <li>
                  <strong>Object and Restrict:</strong> Object to or request the restriction of the
                  processing of your data for certain purposes.
                </li>
              </ul>

              <h2 className="trip-detail-section-heading">6. Data Retention and Security</h2>
              <p className="rationale-summary">
                Your data will be retained for as long as your account is active or as needed to
                provide you with the services. We implement technical security measures (such as
                secure HTTPS connections and password encryption) and organizational measures to
                protect your data against unauthorized access, loss, or alteration.
              </p>

              <h2 className="trip-detail-section-heading">7. Changes to This Policy</h2>
              <p className="rationale-summary">
                We may update our Privacy Policy from time to time to reflect changes in our
                practices or for legal reasons. We will notify you of any significant changes through
                the app or via email.
              </p>

              <h2 className="trip-detail-section-heading">8. Contact Us</h2>
              <p className="rationale-summary">
                If you have any questions, concerns, or wish to exercise your data protection rights,
                please contact us at: <a href="mailto:support@tripverse.app">support@tripverse.app</a>.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}
