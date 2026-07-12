import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { Activity, X } from 'lucide-react';

const LoginModal = ({ onClose, onSuccess }) => {
  const { loginWithGoogle } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handleSuccess = async (credentialResponse) => {
    setBusy(true);
    setError(null);
    const result = await loginWithGoogle(credentialResponse.credential);
    setBusy(false);
    if (result.success) {
      if (onSuccess) onSuccess();
      else if (onClose) onClose();
    } else {
      setError(result.error || 'Sign-in failed. Please try again.');
    }
  };

  const handleError = () => {
    setError('Google Sign-In was cancelled or failed. Please try again.');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop — only clickable to close when it's the optional modal */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose || undefined}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm mx-4 bg-[#0A0A0A] border border-[#222] rounded-2xl p-8 shadow-2xl">

        {/* Close button — only shown when login is optional (sidebar trigger) */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#666] hover:text-white transition p-1"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Logo + title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-[#050505] border border-[#222] mb-4">
            <img src="/logo1.png" alt="TraffixAI" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">TraffixAI</h2>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#888] mt-1">Intelligence Platform</p>
        </div>

        <div className="mb-6 text-center">
          <p className="text-sm text-[#AAA] leading-relaxed">
            {onSuccess
              ? 'Sign in with Google to access your personalized traffic dashboard.'
              : 'Sign in to save your city searches and access your personalized traffic dashboard.'
            }
          </p>
        </div>

        {/* Google Sign-In button */}
        <div className="flex justify-center">
          {busy ? (
            <div className="flex items-center space-x-2 text-[#666] text-sm">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>Signing in...</span>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              theme="filled_black"
              shape="rectangular"
              size="large"
              text="signin_with"
              logo_alignment="left"
            />
          )}
        </div>

        {error && (
          <p className="text-center text-xs text-rose-400 mt-4">{error}</p>
        )}

        <p className="text-center text-[10px] text-[#555] mt-6 leading-relaxed">
          Your data is only used to save your search history within TraffixAI.
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
