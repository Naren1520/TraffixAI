import React from 'react';
import { BookOpen, LayoutDashboard, Navigation, AlertTriangle, Smartphone, Mail, ShieldCheck } from 'lucide-react';

const Help = () => {
  return (
    <div className="flex flex-col space-y-10 pb-10">
      <section className="bg-[#0A0A0A] border border-[#222] rounded-3xl p-8 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#888] mb-4">Help Center</p>
            <h1 className="text-4xl lg:text-5xl font-light text-white tracking-tight leading-tight">
              Welcome to TraffixAI
            </h1>
            <p className="mt-6 text-sm md:text-base text-[#AAA] leading-7 max-w-2xl">
              A complete user guide for every feature in the app, with support details and visual workflow guidance so you can use TraffixAI like a pro.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="bg-[#111] border border-[#222] rounded-3xl p-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#666] mb-3">Quick access</p>
              <p className="text-2xl font-semibold text-white">Dashboard</p>
              <p className="text-sm text-[#888] mt-2">Live metrics, charts, and city traffic health.</p>
            </div>
            <div className="bg-[#111] border border-[#222] rounded-3xl p-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#666] mb-3">Support</p>
              <p className="text-2xl font-semibold text-white">Contact</p>
              <p className="text-sm text-[#888] mt-2">Phone, email, and support recommendations in one place.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8">
        <div className="space-y-8">
          <div className="bg-[#0A0A0A] border border-[#222] rounded-3xl p-8">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-white">How to Use TraffixAI</h2>
                <p className="text-sm text-[#888] mt-2">Follow these recommended steps for the best experience.</p>
              </div>
              <BookOpen className="w-10 h-10 text-[#00E676]" />
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
                <div className="w-10 h-10 rounded-2xl bg-[#111] border border-[#222] flex items-center justify-center text-[#00E676]">1</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Open the Dashboard</h3>
                  <p className="text-sm text-[#AAA] mt-2">Start with the Dashboard to view live traffic metrics, peak hour analysis, active alerts, and the current city performance summary.</p>
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
                <div className="w-10 h-10 rounded-2xl bg-[#111] border border-[#222] flex items-center justify-center text-[#00E676]">2</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Search a City</h3>
                  <p className="text-sm text-[#AAA] mt-2">Use the search box at the top of Dashboard to enter a city or region. The selected city will automatically sync across the app.</p>
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
                <div className="w-10 h-10 rounded-2xl bg-[#111] border border-[#222] flex items-center justify-center text-[#00E676]">3</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Use Route Analyzer</h3>
                  <p className="text-sm text-[#AAA] mt-2">Switch to Route Analyzer, enter your origin and destination, and calculate the smartest route using TomTom-powered analysis.</p>
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
                <div className="w-10 h-10 rounded-2xl bg-[#111] border border-[#222] flex items-center justify-center text-[#00E676]">4</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Review Incident Center</h3>
                  <p className="text-sm text-[#AAA] mt-2">Visit Incident Center for real-time live incident feeds, TomTom incident overlays, and actionable route intelligence.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#222] rounded-3xl p-8">
            <h3 className="text-xl font-semibold text-white mb-5">Feature Guide</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-[#111] border border-[#222] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <LayoutDashboard className="w-5 h-5 text-[#00E676]" />
                  <span className="text-xs uppercase tracking-[0.25em] text-[#666]">Dashboard</span>
                </div>
                <p className="text-sm text-[#AAA]">Live analytics, traffic trends, and road performance metrics in a single view.</p>
              </div>
              <div className="bg-[#111] border border-[#222] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <Navigation className="w-5 h-5 text-[#00E676]" />
                  <span className="text-xs uppercase tracking-[0.25em] text-[#666]">Route Analyzer</span>
                </div>
                <p className="text-sm text-[#AAA]">Analyze origin/destination routing with AI-backed path recommendations and delay estimates.</p>
              </div>
              <div className="bg-[#111] border border-[#222] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <AlertTriangle className="w-5 h-5 text-[#00E676]" />
                  <span className="text-xs uppercase tracking-[0.25em] text-[#666]">Incident Center</span>
                </div>
                <p className="text-sm text-[#AAA]">Live incident feed, severity levels, and city-specific incident visualization integrated with TomTom data.</p>
              </div>
              <div className="bg-[#111] border border-[#222] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <ShieldCheck className="w-5 h-5 text-[#00E676]" />
                  <span className="text-xs uppercase tracking-[0.25em] text-[#666]">Reliability</span>
                </div>
                <p className="text-sm text-[#AAA]">Modern architecture with React, Spring Boot, WebSockets, and real-time updates for production-like monitoring.</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-[#0A0A0A] border border-[#222] rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#888]">Support</p>
                <h3 className="text-2xl font-semibold text-white">Need help?</h3>
              </div>
              <Smartphone className="w-10 h-10 text-[#00E676]" />
            </div>
            <div className="space-y-4">
              <div className="bg-[#111] border border-[#222] rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#666] mb-2">Phone</p>
                <p className="text-sm text-white font-medium">8296833381</p>
              </div>
              <div className="bg-[#111] border border-[#222] rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#666] mb-2">Email</p>
                <p className="text-sm text-white font-medium">narensonu1520@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#222] rounded-3xl p-8">
            <h3 className="text-xl font-semibold text-white mb-4">Visual Workflow</h3>
            <div className="space-y-4">
              <div className="bg-[#111] border border-[#222] rounded-3xl p-4 space-y-3">
                <div className="text-xs uppercase tracking-[0.3em] text-[#666]">Step 1</div>
                <div className="text-white font-semibold">Select City</div>
                <div className="text-sm text-[#AAA]">Search for the city or region you want to monitor on the Dashboard.</div>
              </div>
              <div className="bg-[#111] border border-[#222] rounded-3xl p-4 space-y-3">
                <div className="text-xs uppercase tracking-[0.3em] text-[#666]">Step 2</div>
                <div className="text-white font-semibold">Analyze Routes</div>
                <div className="text-sm text-[#AAA]">Use Route Analyzer to compute optimal routes and see live recommendations.</div>
              </div>
              <div className="bg-[#111] border border-[#222] rounded-3xl p-4 space-y-3">
                <div className="text-xs uppercase tracking-[0.3em] text-[#666]">Step 3</div>
                <div className="text-white font-semibold">Inspect Incidents</div>
                <div className="text-sm text-[#AAA]">Open Incident Center for live incident details and severity-driven guidance.</div>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-[#222] rounded-3xl p-6 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-[#666] mb-4">Contact</p>
            <p className="text-white font-semibold">Support available 24/7</p>
            <p className="text-[#888] text-sm mt-3">For any product questions, configuration support, or feedback — call or email anytime.</p>
          </div>
        </aside>
      </section>

      <section className="bg-[#050505] border border-[#222] rounded-3xl p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#888] mb-2">Need a complete walkthrough?</p>
            <h3 className="text-3xl font-semibold text-white">Use this page as your official TraffixAI knowledge base.</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto">
            <div className="bg-[#111] border border-[#222] rounded-2xl p-5 text-center">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#666]">Pro Tip</p>
              <p className="text-sm text-[#EEE] mt-3">Keep city search precise for best route and incident accuracy.</p>
            </div>
            <div className="bg-[#111] border border-[#222] rounded-2xl p-5 text-center">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#666]">Note</p>
              <p className="text-sm text-[#EEE] mt-3">If APIs are slow, refresh the page and try again after a few seconds.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;
