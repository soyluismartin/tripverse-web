import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Support — Tripverse',
  description: 'Support page for Tripverse.',
}

export default function SupportPage() {
  return (
    <main className="trips-page">
      <section className="trip-detail-stripe">
        <div className="trip-detail-landing-inner">
          <div className="trip-detail-shell">
            <article className="trip-detail-card legal-content mx-auto w-full max-w-4xl border border-[#E5E5EA] bg-white px-6 py-7 md:px-10 md:py-9">
              <h1 className="trip-detail-title">Tripverse Support</h1>
              <p className="trip-detail-route-line">How can we help you?</p>

              <p className="rationale-summary">
                Welcome to the Tripverse support page. Whether you have a question about how our AI
                calculates your routes, need help with your account, or want to report a bug, we are
                here to assist you.
              </p>

              <h2 className="trip-detail-section-heading">1. Contact Us Directly</h2>
              <p className="rationale-summary">
                The fastest way to get help is to send us an email. Our support team will get back
                to you as soon as possible (usually within 24-48 hours).
              </p>
              <p className="rationale-summary">
                Email:{' '}
                <a href="mailto:support@tripverse.app">support@tripverse.app</a>
              </p>
              <p className="rationale-summary">
                When emailing us about a technical issue, please include your device model (e.g.,
                iPhone 15 Pro) and the iOS version you are currently using.
              </p>

              <h2 className="trip-detail-section-heading">2. Frequently Asked Questions (FAQ)</h2>

              <h3 className="trip-detail-subheading">How does Tripverse optimize my route?</h3>
              <p className="rationale-summary">
                Tripverse uses advanced Artificial Intelligence to analyze your selected destinations.
                It calculates the most logical and cost-effective order to visit them, saving you
                time and money compared to planning it manually.
              </p>

              <h3 className="trip-detail-subheading">How do I cancel my Premium subscription?</h3>
              <p className="rationale-summary">
                Since all payments are processed securely through Apple, we cannot cancel your
                subscription from our end. To cancel:
              </p>
              <ol className="trip-detail-numbered-list">
                <li>Open the Settings app on your iPhone.</li>
                <li>Tap your name at the top (Apple ID).</li>
                <li>Tap Subscriptions.</li>
                <li>Select Tripverse and tap Cancel Subscription.</li>
              </ol>

              <h3 className="trip-detail-subheading">How do I request a refund?</h3>
              <p className="rationale-summary">
                All billing is handled by the App Store. If you need a refund, you must request it
                directly from Apple by visiting{' '}
                <a href="https://reportaproblem.apple.com" target="_blank" rel="noreferrer">
                  reportaproblem.apple.com
                </a>{' '}
                and logging in with your Apple ID.
              </p>

              <h3 className="trip-detail-subheading">How can I delete my account and data?</h3>
              <p className="rationale-summary">
                You have full control over your data. You can permanently delete your account
                directly within the Tripverse app:
              </p>
              <ol className="trip-detail-numbered-list">
                <li>Open Tripverse and go to your Profile / Settings.</li>
                <li>Scroll to the bottom and tap Delete Account.</li>
                <li>
                  Confirm your choice. This action is irreversible and will erase all your saved
                  trips and data from our servers.
                </li>
              </ol>

              <h3 className="trip-detail-subheading">
                I found a bug or the app crashed. What should I do?
              </h3>
              <p className="rationale-summary">
                We apologize for the inconvenience! Please send an email to{' '}
                <a href="mailto:support@tripverse.app">support@tripverse.app</a>{' '}
                with a brief description of what you were doing when the app crashed. Screenshots or
                screen recordings are highly appreciated and help us fix the issue faster in the next
                update.
              </p>

              <h2 className="trip-detail-section-heading">3. Additional Resources</h2>
              <p className="rationale-summary">
                Review our <a href="/privacy">Privacy Policy</a> to understand how we handle your
                data.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}
