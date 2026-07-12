import { FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col space-y-8 pb-16 w-full max-w-5xl mx-auto">

      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-[#666] hover:text-white text-xs uppercase tracking-widest transition mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        <div className="flex items-center space-x-3 mb-2">
          <FileText className="w-5 h-5 text-white" />
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide text-white">Terms of Service</h1>
        </div>
        <p className="text-[11px] uppercase tracking-widest text-[#666]">
          Last updated: July 2026
        </p>
      </div>

      <div className="space-y-8 text-sm text-[#AAA] leading-7">

        <section className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-white font-semibold text-base">1. Acceptance</h2>
          <p>
            By accessing or using TraffixAI, you agree to be bound by these Terms of Service.
            If you do not agree, please discontinue use immediately. These terms apply to all
            visitors, users, and contributors.
          </p>
        </section>

        <section className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-white font-semibold text-base">2. Description of Service</h2>
          <p>
            TraffixAI is a real-time traffic analytics and route optimization platform. It aggregates
            live traffic data from third-party APIs (TomTom, OpenStreetMap) and presents it through
            an interactive dashboard. The platform is provided as-is, primarily as an engineering
            demonstration and open-source project.
          </p>
        </section>

        <section className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-white font-semibold text-base">3. User Accounts</h2>
          <p>
            To access personalised features, you must sign in using a valid Google account.
            You are responsible for maintaining the security of your account. You must not
            use another person's account or share your session credentials.
          </p>
          <p>
            We reserve the right to suspend or terminate accounts that are found to be misusing
            the platform, including automated scraping, API abuse, or any activity that degrades
            service for other users.
          </p>
        </section>

        <section className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-white font-semibold text-base">4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc list-inside space-y-2 text-[#888] pl-2">
            <li>Use the platform for any unlawful purpose</li>
            <li>Attempt to reverse-engineer, scrape, or exploit the API</li>
            <li>Circumvent rate limiting or authentication mechanisms</li>
            <li>Upload or transmit malicious code or content</li>
            <li>Use the service to harass, harm, or impersonate others</li>
          </ul>
        </section>

        <section className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-white font-semibold text-base">5. Data Accuracy</h2>
          <p>
            Traffic data displayed on TraffixAI is sourced from third-party APIs and is provided
            for informational purposes only. We do not guarantee the accuracy, completeness, or
            timeliness of traffic conditions, route estimates, or incident information.
          </p>
          <p>
            Do not rely solely on TraffixAI for safety-critical routing decisions.
          </p>
        </section>

        <section className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-white font-semibold text-base">6. Intellectual Property</h2>
          <p>
            TraffixAI is released under the MIT License. You are free to use, fork, modify, and
            distribute the source code with attribution. The TraffixAI name, logo, and branding
            remain the property of the original author.
          </p>
        </section>

        <section className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-white font-semibold text-base">7. Disclaimer of Warranties</h2>
          <p>
            TraffixAI is provided "as is" without warranty of any kind, express or implied.
            We do not warrant that the service will be uninterrupted, error-free, or free of
            harmful components. Use of the platform is at your own risk.
          </p>
        </section>

        <section className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-white font-semibold text-base">8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, the author shall not be liable for any
            indirect, incidental, special, or consequential damages arising out of or in
            connection with your use of TraffixAI.
          </p>
        </section>

        <section className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-white font-semibold text-base">9. Changes to These Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Continued use
            of the platform after changes are posted constitutes your acceptance of the revised terms.
          </p>
        </section>

        <section className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-white font-semibold text-base">10. Contact</h2>
          <p>Questions about these terms can be directed to:</p>
          <div className="bg-[#050505] border border-[#1A1A1A] rounded-xl p-4 space-y-1">
            <p className="text-white font-medium">Naren SJ</p>
            <p className="text-[#888]">narensonu1520@gmail.com</p>
          </div>
        </section>

      </div>
    </div>
  );
}

export default TermsOfService;
