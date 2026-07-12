import { Search, Play, ArrowRight, X } from 'lucide-react';

/**
 * OnboardingBanner
 * Shown on the dashboard when a new user has no traffic data yet.
 * Dismissed permanently once they search a city or start the feed.
 */
const OnboardingBanner = ({ onDismiss }) => (
  <div className="relative bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 overflow-hidden">
    {/* Subtle glow */}
    <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

    <button
      onClick={onDismiss}
      className="absolute top-4 right-4 text-[#555] hover:text-white transition p-1"
      aria-label="Dismiss"
    >
      <X className="w-4 h-4" />
    </button>

    <p className="text-[10px] uppercase tracking-[0.3em] text-[#555] font-semibold mb-4">
      Getting Started
    </p>

    <h2 className="text-xl sm:text-2xl font-light text-white mb-2 tracking-wide">
      Your dashboard is ready.
    </h2>
    <p className="text-sm text-[#666] mb-8 max-w-lg leading-relaxed">
      TraffixAI monitors live road conditions in real time. Follow the two steps below to start seeing traffic data for your city.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Step 1 */}
      <div className="bg-[#050505] border border-[#1A1A1A] rounded-xl p-5 flex items-start space-x-4">
        <div className="w-8 h-8 rounded-lg bg-[#111] border border-[#222] flex items-center justify-center flex-shrink-0">
          <Search className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold text-white uppercase tracking-widest mb-1">
            Step 1 — Search a City
          </p>
          <p className="text-xs text-[#666] leading-relaxed">
            Use the search box above to find your city. Type 2 letters to see suggestions, then click one to load it on the map.
          </p>
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-[#050505] border border-[#1A1A1A] rounded-xl p-5 flex items-start space-x-4">
        <div className="w-8 h-8 rounded-lg bg-[#111] border border-[#222] flex items-center justify-center flex-shrink-0">
          <Play className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold text-white uppercase tracking-widest mb-1">
            Step 2 — Start Feed
          </p>
          <p className="text-xs text-[#666] leading-relaxed">
            Click the "Start Feed" button to begin polling live TomTom traffic data every 15 seconds. Charts and alerts populate automatically.
          </p>
        </div>
      </div>
    </div>

    <div className="mt-6 flex items-center space-x-2 text-[#555] text-xs">
      <ArrowRight className="w-3.5 h-3.5" />
      <span>This guide disappears once you start your first session.</span>
    </div>
  </div>
);

export default OnboardingBanner;
