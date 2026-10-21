import React, { useEffect, useRef } from 'react';

const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY || '0x4AAAAAAFfZtB5e6sSY68H_';

/**
 * Cloudflare Turnstile Verification Widget
 * Renders an invisible or managed smart challenge with zero friction for real users.
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

  useEffect(() => {
    let intervalId = null;
    let isCancelled = false;

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
            sitekey: TURNSTILE_SITE_KEY,
            theme,
            size,
            callback: (token) => {
              if (onVerify) onVerify(token);
            },
            'expired-callback': () => {
              if (onExpire) onExpire();
              else if (onVerify) onVerify('');
            },
            'error-callback': (code) => {
              console.warn('[Turnstile] Widget error callback:', code);
              if (onError) onError(code);
            }
          });
        } catch (err) {
          console.warn('[Turnstile] Error rendering widget:', err);
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
    }

    return () => {
      isCancelled = true;
      if (intervalId) clearInterval(intervalId);
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

  return (
    <div
      ref={containerRef}
      className={`cf-turnstile-wrapper my-2 flex justify-start ${className}`}
    />
  );
}
