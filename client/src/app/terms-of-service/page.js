import PageTracker from '@/components/PageTracker';

export const metadata = {
  title: 'Terms of Service | Unique Air Conditioning',
  description: 'Terms of service for Unique Air Conditioning & Refrigeration.'
};

export default function TermsOfServicePage() {
  return (
    <>
      <PageTracker />
      <section className="bg-gradient-to-r from-primary-700 to-accent-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-blue-100 mt-2">Last updated: January 2024</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 prose prose-lg max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using the services of Unique Air Conditioning & Refrigeration ("Company"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

            <h2>2. Services Description</h2>
            <p>Unique Air Conditioning & Refrigeration provides air conditioning installation, repair, maintenance, gas refilling, and commercial refrigeration services. Service availability may vary based on location and technician availability.</p>

            <h2>3. Service Booking and Appointments</h2>
            <p>Service appointments are subject to technician availability. We will make every effort to honor scheduled appointments. In case of unavoidable delays or rescheduling, we will notify you as soon as possible. A service fee may apply for cancelled appointments with less than 2 hours notice.</p>

            <h2>4. Pricing and Payment</h2>
            <p>Service prices are provided as estimates and may vary based on the actual work required. Final pricing will be communicated before any work begins. Payment is due upon completion of service unless otherwise agreed. We accept cash, bank transfer, and major digital payment methods.</p>

            <h2>5. Warranty on Services</h2>
            <p>We provide a 30-day warranty on all repair services. This warranty covers the specific repair performed but does not cover damage resulting from misuse, power surges, or pre-existing conditions unrelated to the repair. Gas refilling services carry a 90-day warranty against leaks at repaired points.</p>

            <h2>6. Annual Maintenance Contract (AMC)</h2>
            <p>AMC agreements are for a period of 12 months from the date of signing. AMC covers scheduled maintenance visits and specified repairs as outlined in the contract. Emergency callouts outside business hours may be subject to additional charges. AMC agreements are non-refundable after the first scheduled maintenance visit.</p>

            <h2>7. Customer Responsibilities</h2>
            <p>Customers are responsible for ensuring safe and reasonable access to AC units and refrigeration equipment. Customers must inform our technicians of any known hazards or special conditions. Customers are responsible for clearing the area around units before technician arrival.</p>

            <h2>8. Limitation of Liability</h2>
            <p>Our liability for any service-related damage is limited to the cost of the service provided. We are not liable for indirect, incidental, or consequential damages. We carry appropriate insurance for our services and operations.</p>

            <h2>9. Dispute Resolution</h2>
            <p>Any disputes arising from our services should first be reported to our customer service team. We commit to resolving disputes fairly and promptly. Unresolved disputes will be subject to mediation before legal proceedings.</p>

            <h2>10. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Changes will be effective upon posting to our website. Continued use of our services constitutes acceptance of the modified terms.</p>

            <h2>11. Contact Information</h2>
            <p>For questions about these terms, contact us at:<br />Unique Air Conditioning & Refrigeration<br />123 Main Street, Your City, State 400001<br />Email: legal@uniqueaircon.com<br />Phone: +91 12345 67890</p>
          </div>
        </div>
      </section>
    </>
  );
}
