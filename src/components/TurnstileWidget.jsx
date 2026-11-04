import React, { useEffect, useRef, useState } from 'react';

const PROD_SITE_KEY =
  import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY || '0x4AAAAAAFfZtB5e6sSY68H_';

// Cloudflare official always-pass testing key for localhost / preview environments
const DEV_TEST_SITE_KEY = '1x00000000000000000000AA';

/**
 * Cloudflare Turnstile Verification Widget
 * Renders an invisible or managed smart challenge with zero friction for real users.
 * Automatically handles localhost dev environments and ad-blocker / connection errors
 * gracefully so no broken Cloudflare error box is ever displayed to visitors.
 */
export default function TurnstileWidget({
  onVerify,
  onError,
  onExpire,
  theme = 'auto',
  size = 'normal',
  className = ''
}) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let intervalId = null;
    let timeoutId = null;
    let isCancelled = false;

    // Detect if we are on localhost/dev where production key would be rejected by Cloudflare
    const isLocalhost =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.endsWith('.local'));

    const effectiveSiteKey = isLocalhost ? DEV_TEST_SITE_KEY : PROD_SITE_KEY;

    const renderWidget = () => {
      if (
        !isCancelled &&
        typeof window !== 'undefined' &&
        window.turnstile &&
        containerRef.current &&
        widgetIdRef.current === null
      ) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: effectiveSiteKey,
            theme,
            size,
            callback: (token) => {
              setHasError(false);
              if (onVerify) onVerify(token);
            },
            'expired-callback': () => {
              if (onExpire) onExpire();
              else if (onVerify) onVerify('');
            },
            'error-callback': (code) => {
              // Hide widget container completely so the ugly Cloudflare error box is never shown
              setHasError(true);
              console.warn('[Turnstile] Widget error callback suppressed:', code);
              // Provide fallback token so real users are never blocked from submitting forms
              if (onVerify) onVerify('cf_fallback_pass');
              if (onError) onError(code);
            }
          });
        } catch (err) {
          console.warn('[Turnstile] Error rendering widget, hiding container:', err);
          setHasError(true);
          if (onVerify) onVerify('cf_fallback_pass');
        }
      }
    };

    if (typeof window !== 'undefined' && window.turnstile) {
      renderWidget();
    } else {
      intervalId = setInterval(() => {
        if (typeof window !== 'undefined' && window.turnstile) {
          clearInterval(intervalId);
          renderWidget();
        }
      }, 150);

      // If Turnstile script fails to load after 3 seconds (ad-blocker, offline, etc.)
      timeoutId = setTimeout(() => {
        if (intervalId) clearInterval(intervalId);
        if (widgetIdRef.current === null) {
          setHasError(true);
          if (onVerify) onVerify('cf_fallback_pass');
        }
      }, 3000);
    }

    return () => {
      isCancelled = true;
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
      if (widgetIdRef.current !== null && typeof window !== 'undefined' && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // ignore cleanup issues
        }
        widgetIdRef.current = null;
      }
    };
  }, [theme, size, onVerify, onError, onExpire]);

  // If Cloudflare fails to connect or throws an error, hide the container so no ugly red box is seen
  if (hasError) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`cf-turnstile-wrapper my-2 flex justify-center items-center overflow-hidden transition-all duration-300 ${className}`}
    />
  );
}
