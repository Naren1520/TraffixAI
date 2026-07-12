import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/':                 'Overview',
  '/route-analyzer':   'Route Analyzer',
  '/incident-center':  'Incident Center',
  '/settings':         'Settings',
  '/help':             'Help',
  '/privacy-policy':   'Privacy Policy',
  '/terms-of-service': 'Terms of Service',
};

/**
 * MobileTopBar — visible only on mobile (md:hidden).
 * Sits at the top of the main content area and provides
 * a consistent header with the hamburger menu trigger and page title.
 */
const MobileTopBar = ({ onMenuOpen }) => {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || 'TraffixAI';

  return (
    <div className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#1A1A1A] px-4 py-3.5">
      <button
        onClick={onMenuOpen}
        className="text-[#888] hover:text-white transition p-1 -ml-1"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 rounded-full overflow-hidden border border-[#222] flex-shrink-0">
          <img src="/logo1.png" alt="TraffixAI" className="w-full h-full object-cover" />
        </div>
        <span className="text-sm font-semibold text-white tracking-wide">{title}</span>
      </div>

      {/* Spacer to keep title visually centred */}
      <div className="w-7" />
    </div>
  );
};

export default MobileTopBar;
