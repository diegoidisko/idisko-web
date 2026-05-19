/* iDisko — Tracker loaders gated by Klaro consent
 *
 * Listens for Klaro's `consents-updated` event and loads the tracker
 * SDKs only if the user has consented. Also exposes a small `idisko.track()`
 * helper that page-level code (e.g. newsletter form) can call to send
 * conversion events to all consented platforms.
 *
 * IMPORTANT — replace the placeholders below with real IDs:
 *   - META_PIXEL_ID
 *   - POSTHOG_KEY
 *   - CLARITY_ID
 */
(function () {
  'use strict';

  // ────────────────────────────────────────────────────────────
  //  IDs — REPLACE WITH PRODUCTION VALUES
  // ────────────────────────────────────────────────────────────
  var META_PIXEL_ID = window.IDISKO_META_PIXEL_ID || '1941055043153888';
  var POSTHOG_KEY   = window.IDISKO_POSTHOG_KEY   || 'phc_oVEhScOA5bOeDvdIVeaN9YnuZPgGxSSv6a5xGaSeGx5';
  var CLARITY_ID    = window.IDISKO_CLARITY_ID    || 'wizgce1drz';

  // Track which trackers have been loaded (avoid double-init on consent re-trigger)
  var loaded = { posthog: false, metaPixel: false, clarity: false };

  // ────────────────────────────────────────────────────────────
  //  PostHog loader (analytics)
  // ────────────────────────────────────────────────────────────
  function loadPostHog() {
    if (loaded.posthog || !POSTHOG_KEY || POSTHOG_KEY.indexOf('TODO_') === 0) return;
    loaded.posthog = true;

    !function (t, e) { var o, n, p, r; e.__SV || (window.posthog = e, e._i = [], e.init = function (i, s, a) { function g(t, e) { var o = e.split('.'); 2 == o.length && (t = t[o[0]], e = o[1]), t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } } (p = t.createElement('script')).type = 'text/javascript', p.async = !0, p.src = s.api_host + '/static/array.js', (r = t.getElementsByTagName('script')[0]).parentNode.insertBefore(p, r); var u = e; for (void 0 !== a ? u = e[a] = [] : a = 'posthog', u.people = u.people || [], u.toString = function (t) { var e = 'posthog'; return 'posthog' !== a && (e += '.' + a), t || (e += ' (stub)'), e }, u.people.toString = function () { return u.toString(1) + '.people (stub)' }, o = 'capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys'.split(' '), n = 0; n < o.length; n++)g(u, o[n]); e._i.push([i, s, a]) }, e.__SV = 1) }(document, window.posthog || []);
    posthog.init(POSTHOG_KEY, {
      api_host: 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      // Share distinct_id across www.idisko.com and app.idisko.com.
      cross_subdomain_cookie: true,
      persistence: 'localStorage+cookie',
      // utm_id is missing from posthog-js IAB whitelist — add it explicitly:
      custom_campaign_params: ['utm_id']
    });
  }

  function unloadPostHog() {
    if (window.posthog && typeof posthog.opt_out_capturing === 'function') {
      try { posthog.opt_out_capturing(); } catch (e) {}
    }
  }

  // ────────────────────────────────────────────────────────────
  //  Meta Pixel loader (advertising)
  // ────────────────────────────────────────────────────────────
  function loadMetaPixel() {
    if (loaded.metaPixel || !META_PIXEL_ID || META_PIXEL_ID.indexOf('TODO_') === 0) return;
    loaded.metaPixel = true;

    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');
  }

  function unloadMetaPixel() {
    if (window.fbq && typeof fbq === 'function') {
      try { fbq('consent', 'revoke'); } catch (e) {}
    }
  }

  // ────────────────────────────────────────────────────────────
  //  Microsoft Clarity loader (session recording)
  // ────────────────────────────────────────────────────────────
  function loadClarity() {
    if (loaded.clarity || !CLARITY_ID || CLARITY_ID.indexOf('TODO_') === 0) return;
    loaded.clarity = true;

    (function (c, l, a, r, i, t, y) { c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) }; t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i; y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y); })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  // ────────────────────────────────────────────────────────────
  //  Klaro consent-updated handler
  // ────────────────────────────────────────────────────────────
  function handleConsents(consents) {
    if (!consents) return;
    if (consents.posthog === true) loadPostHog(); else unloadPostHog();
    if (consents['meta-pixel'] === true) loadMetaPixel(); else unloadMetaPixel();
    if (consents.clarity === true) loadClarity();
  }

  function init() {
    var manager = window.klaro && window.klaro.getManager && window.klaro.getManager();
    if (!manager) {
      // Klaro not yet loaded — try again shortly
      setTimeout(init, 200);
      return;
    }

    // Initial state: apply existing consents (if user already chose previously)
    handleConsents(manager.consents);

    // React to consent changes
    manager.watch({
      update: function (manager, action, data) {
        if (action === 'consents') {
          handleConsents(data);
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ────────────────────────────────────────────────────────────
  //  Public helper: idisko.track(eventName, props)
  //  Use this in form-submit handlers, etc. to send to all
  //  consented trackers in one call.
  // ────────────────────────────────────────────────────────────
  window.idisko = window.idisko || {};
  window.idisko.track = function (event, props) {
    props = props || {};
    try { if (window.posthog && loaded.posthog) posthog.capture(event, props); } catch (e) {}
    try {
      if (window.fbq && loaded.metaPixel) {
        // Map common iDisko events to Meta standard events.
        // Precedence: explicit data-meta on the element > stdMap > trackCustom fallback.
        var stdMap = {
          'newsletter_signup': 'Lead',
          'newsletter_confirmed': 'CompleteRegistration',
          'app_store_click': 'InitiateCheckout',
          'play_store_click': 'InitiateCheckout'
        };
        // Meta's set of standard events — only these are 'track', everything else 'trackCustom'.
        var metaStandardEvents = {
          AddPaymentInfo:1, AddToCart:1, AddToWishlist:1, CompleteRegistration:1, Contact:1,
          CustomizeProduct:1, Donate:1, FindLocation:1, InitiateCheckout:1, Lead:1, Purchase:1,
          Schedule:1, Search:1, StartTrial:1, SubmitApplication:1, Subscribe:1, ViewContent:1
        };
        var explicit = props && props.meta_event;
        var resolved = explicit || stdMap[event];
        if (resolved && metaStandardEvents[resolved]) {
          fbq('track', resolved, props);
        } else if (resolved) {
          // Non-standard name supplied via data-meta → custom event under that name.
          fbq('trackCustom', resolved, props);
        } else {
          fbq('trackCustom', event, props);
        }
      }
    } catch (e) {}
    try { if (window.clarity && loaded.clarity) clarity('event', event); } catch (e) {}
  };

  // Identify helper for logged-in flows (post-signup, post-confirm, etc.)
  window.idisko.identify = function (userId, props) {
    try { if (window.posthog && loaded.posthog) posthog.identify(userId, props || {}); } catch (e) {}
    try { if (window.clarity && loaded.clarity) clarity('identify', userId); } catch (e) {}
  };
})();
