import PageTracker from '@/components/PageTracker';

export const metadata = {
  title: 'Privacy Policy | Unique Air Conditioning',
  description: 'Privacy policy for Unique Air Conditioning & Refrigeration services.'
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageTracker />
      <section className="bg-gradient-to-r from-primary-700 to-accent-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-blue-100 mt-2">Last updated: January 2024</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 prose prose-lg max-w-none">
            <h2>1. Information We Collect</h2>
            <p>Unique Air Conditioning & Refrigeration ("Company", "we", "us", or "our") collects information you provide directly to us, such as when you submit an enquiry form, contact us by phone or email, or request our services. This information may include your name, phone number, email address, and details about your service requirements.</p>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services. Specifically, we use your information to:</p>
            <ul>
              <li>Respond to your enquiries and provide customer support</li>
              <li>Schedule and perform air conditioning and refrigeration services</li>
              <li>Send you service reminders and maintenance notifications</li>
              <li>Communicate with you about promotions and special offers (with your consent)</li>
              <li>Improve our services and customer experience</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or servicing you, as long as they agree to keep this information confidential.</p>

            <h2>4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>

            <h2>5. Cookies</h2>
            <p>Our website may use cookies to enhance your browsing experience. Cookies are small files stored on your device that help us analyze web traffic and improve our website. You can choose to disable cookies through your browser settings, but this may affect your ability to use certain features of our website.</p>

            <h2>6. Third-Party Links</h2>
            <p>Our website may contain links to third-party websites. We have no control over the content and privacy practices of these sites and are not responsible for their privacy policies.</p>

            <h2>7. Your Rights</h2>
            <p>You have the right to access, update, or delete the personal information we hold about you. To exercise these rights, please contact us at privacy@uniqueaircon.com.</p>

            <h2>8. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated date.</p>

            <h2>9. Contact Us</h2>
            <p>If you have any questions about this privacy policy, please contact us at:</p>
            <p>Unique Air Conditioning & Refrigeration<br />123 Main Street, Your City, State 400001<br />Email: privacy@uniqueaircon.com<br />Phone: +91 12345 67890</p>
          </div>
        </div>
      </section>
    </>
  );
}
