import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PrivacyPolicy() {
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
          <Shield className="w-5 h-5 text-white" />
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide text-white">Privacy Policy</h1>
        </div>
        <p className="text-[11px] uppercase tracking-widest text-[#666]">
          Last updated: July 2026
        </p>
      </div>

      <div className="space-y-8 text-sm text-[#AAA] leading-7">

        <section className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-white font-semibold text-base">1. Overview</h2>
          <p>
            TraffixAI ("we", "our", "the platform") is an open-source real-time traffic analytics platform
            built and maintained by Naren SJ. This Privacy Policy explains what personal data we collect,
            how we use it, and the choices you have.
          </p>
          <p>
            By using TraffixAI, you agree to the practices described in this document. If you do not agree,
            please do not use the platform.
          </p>
        </section>

        <section className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-white font-semibold text-base">2. Data We Collect</h2>
          <p>When you sign in with Google, we receive and store the following from your Google account:</p>
          <ul className="list-disc list-inside space-y-1 text-[#888] pl-2">
            <li>Your name</li>
            <li>Your email address</li>
            <li>Your Google profile picture URL</li>
            <li>A unique Google account identifier (used only internally)</li>
          </ul>
          <p>After you begin using the platform, we also store:</p>
          <ul className="list-disc list-inside space-y-1 text-[#888] pl-2">
            <li>Your default city preference (city name, latitude, longitude)</li>
            <li>Your recent city search history (up to 10 entries)</li>
            <li>Timestamps of your account creation and last login</li>
          </ul>
          <p>
            We do not collect passwords, payment information, location tracking, device fingerprints,
            or any sensitive personal data.
          </p>
        </section>

        <section className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-white font-semibold text-base">3. How We Use Your Data</h2>
          <ul className="list-disc list-inside space-y-2 text-[#888] pl-2">
            <li>To authenticate your session using JSON Web Tokens (JWT)</li>
            <li>To personalise the dashboard with your default city on login</li>
            <li>To surface your recent searches as autocomplete suggestions</li>
            <li>To associate traffic data sessions with your account</li>
          </ul>
          <p>
            We do not sell, share, or transfer your data to any third party for advertising or marketing purposes.
          </p>
        </section>

        <section className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-white font-semibold text-base">4. Third-Party Services</h2>
          <p>TraffixAI uses the following third-party services which have their own privacy policies:</p>
          <ul className="list-disc list-inside space-y-2 text-[#888] pl-2">
            <li><span className="text-white">Google OAuth</span> — for authentication</li>
            <li><span className="text-white">TomTom APIs</span> — for traffic flow and incident data</li>
            <li><span className="text-white">OpenStreetMap Nominatim</span> — for geocoding city searches</li>
            <li><span className="text-white">Google Gemini</span> — for AI route synopsis generation</li>
            <li><span className="text-white">MongoDB Atlas</span> — for persistent data storage</li>
          </ul>
          <p>
            We do not send your personal account data to TomTom, Nominatim, or Gemini.
            Those services receive only anonymous query parameters (coordinates, city names).
          </p>
        </section>

        <section className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-white font-semibold text-base">5. Data Retention</h2>
          <p>
            Your account data is retained in MongoDB Atlas for as long as your account is active.
            Real-time traffic data collected during your monitoring sessions is automatically deleted
            after 24 hours via a MongoDB TTL index.
          </p>
          <p>
            You may request full account deletion by emailing narensonu1520@gmail.com. We will
            permanently delete your account and all associated data within 7 days.
          </p>
        </section>

        <section className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-white font-semibold text-base">6. Security</h2>
          <p>
            All API communication uses HTTPS. Authentication is handled via short-lived JWTs (24-hour
            expiry). We do not store Google access tokens. Rate limiting is enforced on all endpoints
            to prevent abuse.
          </p>
        </section>

        <section className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-white font-semibold text-base">7. Contact</h2>
          <p>
            For any questions about this Privacy Policy or requests regarding your data, contact:
          </p>
          <div className="bg-[#050505] border border-[#1A1A1A] rounded-xl p-4 space-y-1">
            <p className="text-white font-medium">Naren SJ</p>
            <p className="text-[#888]">narensonu1520@gmail.com</p>
          </div>
        </section>

      </div>
    </div>
  );
}

export default PrivacyPolicy;
