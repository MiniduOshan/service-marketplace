import React, { useEffect, useRef, useState } from 'react';
import { apiRequest, storeSession } from '../../lib/api';

let googleScriptPromise;

function loadGoogleScript() {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[data-google-identity="true"]');

      if (existingScript) {
        existingScript.addEventListener('load', resolve, { once: true });
        existingScript.addEventListener('error', () => reject(new Error('Unable to load Google sign-in.')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.dataset.googleIdentity = 'true';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Unable to load Google sign-in.'));
      document.head.appendChild(script);
    });
  }

  return googleScriptPromise;
}

export default function GoogleSignInButton({
  flow = 'signin',
  role = 'customer',
  onSuccess,
  className = '',
}) {
  const containerRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setError('Google sign-in is not configured.');
      return undefined;
    }

    setError('');

    loadGoogleScript()
      .then(() => {
        if (!active || !containerRef.current) return;

        containerRef.current.innerHTML = '';

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async ({ credential }) => {
            try {
              const response = await apiRequest('/auth/google', {
                method: 'POST',
                body: JSON.stringify({
                  credential,
                  flow,
                  role,
                }),
              });

              storeSession(response.data.token, response.data.user);
              onSuccess?.(response.data.user);
            } catch (requestError) {
              setError(requestError.message || 'Unable to continue with Google.');
            }
          },
        });

        window.google.accounts.id.renderButton(containerRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
          width: containerRef.current.offsetWidth || 320,
        });
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message || 'Unable to continue with Google.');
        }
      });

    return () => {
      active = false;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [flow, role, onSuccess]);

  return (
    <div className={className}>
      <div ref={containerRef} className="w-full" />
      {error ? <p className="mt-2 text-[12px] text-red-600">{error}</p> : null}
    </div>
  );
}