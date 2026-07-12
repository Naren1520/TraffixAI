import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      setError('Missing VITE_GOOGLE_CLIENT_ID in frontend/.env');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (credentialResponse) => {
            if (!credentialResponse?.credential) {
              setError('Google sign-in did not return a credential.');
              return;
            }

            try {
              setError('');
              await signIn(credentialResponse.credential);
              navigate('/', { replace: true });
            } catch (err) {
              console.error(err);
              setError('Unable to complete sign in. Please try again.');
            }
          },
          ux_mode: 'popup',
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin'),
          {
            theme: 'outline',
            size: 'large',
            width: '280',
            shape: 'pill',
            text: 'signin_with',
          }
        );
      } else {
        setError('Google sign-in initialization failed.');
      }
    };

    script.onerror = () => setError('Unable to load Google sign-in script.');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [clientId, signIn]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-[#070707] border border-[#222] rounded-[32px] p-10 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-center mb-8">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-[#111] border border-[#333]">
            <img src="/logo1.png" alt="TraffixAI" className="w-full h-full object-cover" />
          </div>
        </div>

        <h1 className="text-3xl font-light text-white text-center tracking-[0.2em] mb-3">Sign in to TraffixAI</h1>
        <p className="text-sm text-[#AAA] text-center mb-8">
          Securely access route intelligence, incident monitoring, and analytics with your Google account.
        </p>

        <div id="google-signin" className="flex justify-center"></div>

        {error && (
          <p className="mt-6 text-center text-rose-400 text-sm">{error}</p>
        )}

        <div className="mt-9 border-t border-[#222] pt-6 text-center text-xs uppercase tracking-[0.3em] text-[#555]">
          Your Google account will be used to identify and store your TraffixAI profile securely.
        </div>
      </div>
    </div>
  );
}

export default Login;
