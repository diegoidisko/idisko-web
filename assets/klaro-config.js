/* iDisko — Klaro consent manager configuration
 * https://klaro.org
 *
 * Loaded BEFORE klaro.no-css.js. Defines the consent banner content,
 * services to track (PostHog, Meta Pixel, Microsoft Clarity), and
 * translations in 5 languages (ES, EN, FR, IT, PT-BR).
 *
 * The actual tracker scripts are loaded by assets/klaro-trackers.js,
 * which listens for klaro's `consents-updated` event.
 *
 * IMPORTANT — fill in the IDs marked TODO before deploying:
 *   - META_PIXEL_ID  (Meta Events Manager → Pixels → ID)
 *   - POSTHOG_KEY    (PostHog → Project Settings → Project API Key, "phc_...")
 *   - CLARITY_ID     (clarity.microsoft.com → Settings → Setup → Project ID)
 */
(function () {
  // Detect language from <html lang> or localStorage. Defaults to FR (binding version).
  var saved = null;
  try { saved = localStorage.getItem('idisko_lang'); } catch (e) {}
  var detected = saved || (document.documentElement.lang || (navigator.language || 'fr').slice(0, 2));
  var supported = ['es', 'en', 'fr', 'it', 'pt'];
  var lang = supported.indexOf(detected) >= 0 ? detected : 'fr';

  window.klaroConfig = {
    version: 1,
    elementID: 'klaro',
    styling: { theme: ['dark', 'top', 'wide'] },
    noAutoLoad: false,
    htmlTexts: true,
    embedded: false,
    groupByPurpose: true,
    storageMethod: 'cookie',
    cookieName: 'klaro',
    cookieExpiresAfterDays: 365,
    default: false,         // services off by default until consent
    mustConsent: false,     // banner is dismissable; user can ignore
    acceptAll: true,        // shows "Accept all" button
    hideDeclineAll: false,  // shows "Decline all" — REQUIRED by CNIL
    hideLearnMore: false,
    noticeAsModal: false,
    lang: lang,
    privacyPolicy: {
      default: 'cookies.html',
      es: 'cookies.html',
      en: 'cookies.html',
      fr: 'cookies.html',
      it: 'cookies.html',
      pt: 'cookies.html'
    },
    purposes: ['analytics', 'advertising', 'session'],
    services: [
      {
        name: 'posthog',
        title: 'PostHog',
        purposes: ['analytics'],
        cookies: [
          [/^ph_/, '/', '.idisko.com'],
          [/^ph_/, '/']
        ],
        required: false,
        default: false,
        optOut: false,
        onlyOnce: true
      },
      {
        name: 'meta-pixel',
        title: 'Meta Pixel (Facebook/Instagram)',
        purposes: ['advertising'],
        cookies: [
          ['_fbp', '/'],
          ['_fbc', '/']
        ],
        required: false,
        default: false,
        optOut: false,
        onlyOnce: true
      },
      {
        name: 'clarity',
        title: 'Microsoft Clarity',
        purposes: ['session'],
        cookies: [
          ['_clck', '/'],
          ['_clsk', '/'],
          ['MUID', '/'],
          ['ANONCHK', '/'],
          ['MR', '/'],
          ['SM', '/']
        ],
        required: false,
        default: false,
        optOut: false,
        onlyOnce: true
      }
    ],

    translations: {
      // ─── Fallback ──────────────────────────────────────────────
      zz: {
        privacyPolicyUrl: '/cookies.html',
        consentModal: {
          title: 'Privacy preferences',
          description: 'We use cookies and similar technologies. Some are strictly necessary; others (analytics, advertising) require your consent.'
        },
        consentNotice: {
          changeDescription: 'There were changes since your last visit, please renew your consent.',
          description: 'Hi! Could we please use cookies and similar technologies for analytics and advertising? You can withdraw your consent at any time. {purposes}.',
          learnMore: 'Let me choose'
        },
        purposes: {
          analytics: { title: 'Analytics', description: 'Helps us understand how the site is used.' },
          advertising: { title: 'Advertising', description: 'Measures the effectiveness of our advertising campaigns.' },
          session: { title: 'Experience improvement', description: 'Anonymous heatmaps and session recordings.' }
        },
        ok: 'Accept all',
        save: 'Save my choices',
        decline: 'Decline all',
        close: 'Close',
        acceptAll: 'Accept all',
        acceptSelected: 'Save my choices'
      },

      // ─── ESPAÑOL ───────────────────────────────────────────────
      es: {
        privacyPolicyUrl: '/cookies.html',
        consentModal: {
          title: 'Preferencias de privacidad',
          description: 'Usamos cookies y tecnologías similares para hacer funcionar el sitio, medir su rendimiento y, con tu consentimiento, mostrarte publicidad relevante. Puedes elegir qué activar. Más detalles en nuestra <a href="cookies.html">Política de Cookies</a>.'
        },
        consentNotice: {
          changeDescription: 'Hubo cambios desde tu última visita. Por favor renueva tu consentimiento.',
          description: 'Usamos cookies para analizar el tráfico y medir nuestras campañas. Puedes <button class="cm-link cn-learn-more">elegir</button> qué activar o aceptar todo.',
          learnMore: 'Personalizar'
        },
        purposes: {
          analytics: { title: 'Analítica', description: 'Nos ayuda a entender cómo se usa el sitio (PostHog).' },
          advertising: { title: 'Publicidad', description: 'Medimos la eficacia de nuestras campañas en redes sociales (Meta Pixel).' },
          session: { title: 'Mejora de experiencia', description: 'Mapas de calor y grabaciones anónimas de sesión (Microsoft Clarity).' }
        },
        ok: 'Aceptar todo',
        save: 'Guardar mis elecciones',
        decline: 'Rechazar todo',
        close: 'Cerrar',
        acceptAll: 'Aceptar todo',
        acceptSelected: 'Guardar mis elecciones',
        consentNoticeTitle: 'Tu privacidad, tu elección',
        service: {
          disableAll: { title: 'Activar o desactivar todo', description: 'Usa este interruptor maestro para activar/desactivar todos los servicios opcionales a la vez.' },
          optOut: { title: '(opt-out)', description: 'Este servicio está activo por defecto.' },
          required: { title: '(siempre activo)', description: 'Este servicio es necesario para el funcionamiento del sitio.' },
          purposes: 'Finalidades',
          purpose: 'Finalidad'
        }
      },

      // ─── ENGLISH ───────────────────────────────────────────────
      en: {
        privacyPolicyUrl: '/cookies.html',
        consentModal: {
          title: 'Privacy preferences',
          description: 'We use cookies and similar technologies to operate the site, measure performance and, with your consent, show you relevant advertising. You decide what to enable. More details in our <a href="cookies.html">Cookie Policy</a>.'
        },
        consentNotice: {
          changeDescription: 'There were changes since your last visit. Please renew your consent.',
          description: 'We use cookies to analyze traffic and measure our campaigns. You can <button class="cm-link cn-learn-more">choose</button> what to enable or accept all.',
          learnMore: 'Customize'
        },
        purposes: {
          analytics: { title: 'Analytics', description: 'Helps us understand how the site is used (PostHog).' },
          advertising: { title: 'Advertising', description: 'Measures the effectiveness of our social-media campaigns (Meta Pixel).' },
          session: { title: 'Experience improvement', description: 'Anonymous heatmaps and session recordings (Microsoft Clarity).' }
        },
        ok: 'Accept all',
        save: 'Save my choices',
        decline: 'Decline all',
        close: 'Close',
        acceptAll: 'Accept all',
        acceptSelected: 'Save my choices',
        consentNoticeTitle: 'Your privacy, your choice',
        service: {
          disableAll: { title: 'Enable or disable all', description: 'Use this master switch to enable/disable all optional services at once.' },
          optOut: { title: '(opt-out)', description: 'This service is enabled by default.' },
          required: { title: '(always on)', description: 'This service is required for the site to function.' },
          purposes: 'Purposes',
          purpose: 'Purpose'
        }
      },

      // ─── FRANÇAIS (binding) ────────────────────────────────────
      fr: {
        privacyPolicyUrl: '/cookies.html',
        consentModal: {
          title: 'Préférences de confidentialité',
          description: 'Nous utilisons des cookies et technologies similaires pour faire fonctionner le site, mesurer ses performances et, avec votre consentement, afficher des publicités pertinentes. Vous choisissez ce que vous activez. Plus de détails dans notre <a href="cookies.html">Politique de Cookies</a>.'
        },
        consentNotice: {
          changeDescription: 'Des modifications ont été apportées depuis votre dernière visite. Veuillez renouveler votre consentement.',
          description: 'Nous utilisons des cookies pour analyser le trafic et mesurer nos campagnes. Vous pouvez <button class="cm-link cn-learn-more">choisir</button> ce que vous activez ou tout accepter.',
          learnMore: 'Personnaliser'
        },
        purposes: {
          analytics: { title: 'Mesure d\'audience', description: 'Nous aide à comprendre comment le site est utilisé (PostHog).' },
          advertising: { title: 'Publicité', description: 'Mesure l\'efficacité de nos campagnes sur les réseaux sociaux (Meta Pixel).' },
          session: { title: 'Amélioration de l\'expérience', description: 'Heatmaps et enregistrements anonymes de session (Microsoft Clarity).' }
        },
        ok: 'Tout accepter',
        save: 'Enregistrer mes choix',
        decline: 'Tout refuser',
        close: 'Fermer',
        acceptAll: 'Tout accepter',
        acceptSelected: 'Enregistrer mes choix',
        consentNoticeTitle: 'Votre vie privée, votre choix',
        service: {
          disableAll: { title: 'Tout activer ou désactiver', description: 'Utilisez cet interrupteur principal pour activer/désactiver tous les services optionnels à la fois.' },
          optOut: { title: '(opt-out)', description: 'Ce service est activé par défaut.' },
          required: { title: '(toujours actif)', description: 'Ce service est nécessaire au fonctionnement du site.' },
          purposes: 'Finalités',
          purpose: 'Finalité'
        }
      },

      // ─── ITALIANO ──────────────────────────────────────────────
      it: {
        privacyPolicyUrl: '/cookies.html',
        consentModal: {
          title: 'Preferenze di privacy',
          description: 'Utilizziamo cookie e tecnologie simili per far funzionare il sito, misurarne le prestazioni e, con il tuo consenso, mostrarti pubblicità pertinenti. Decidi tu cosa abilitare. Maggiori dettagli nella nostra <a href="cookies.html">Cookie Policy</a>.'
        },
        consentNotice: {
          changeDescription: 'Ci sono stati cambiamenti dalla tua ultima visita. Rinnova il consenso.',
          description: 'Usiamo cookie per analizzare il traffico e misurare le nostre campagne. Puoi <button class="cm-link cn-learn-more">scegliere</button> cosa abilitare o accettare tutto.',
          learnMore: 'Personalizza'
        },
        purposes: {
          analytics: { title: 'Analitica', description: 'Ci aiuta a capire come viene utilizzato il sito (PostHog).' },
          advertising: { title: 'Pubblicità', description: 'Misura l\'efficacia delle nostre campagne sui social network (Meta Pixel).' },
          session: { title: 'Miglioramento dell\'esperienza', description: 'Heatmap e registrazioni anonime di sessione (Microsoft Clarity).' }
        },
        ok: 'Accetta tutto',
        save: 'Salva le mie scelte',
        decline: 'Rifiuta tutto',
        close: 'Chiudi',
        acceptAll: 'Accetta tutto',
        acceptSelected: 'Salva le mie scelte',
        consentNoticeTitle: 'La tua privacy, la tua scelta',
        service: {
          disableAll: { title: 'Attiva o disattiva tutto', description: 'Usa questo interruttore principale per attivare/disattivare tutti i servizi opzionali in una volta.' },
          optOut: { title: '(opt-out)', description: 'Questo servizio è attivo per impostazione predefinita.' },
          required: { title: '(sempre attivo)', description: 'Questo servizio è necessario al funzionamento del sito.' },
          purposes: 'Finalità',
          purpose: 'Finalità'
        }
      },

      // ─── PORTUGUÊS (BR) ────────────────────────────────────────
      pt: {
        privacyPolicyUrl: '/cookies.html',
        consentModal: {
          title: 'Preferências de privacidade',
          description: 'Usamos cookies e tecnologias similares para o site funcionar, medir o desempenho e, com seu consentimento, mostrar anúncios relevantes. Você decide o que ativar. Mais detalhes na nossa <a href="cookies.html">Política de Cookies</a>.'
        },
        consentNotice: {
          changeDescription: 'Houve alterações desde sua última visita. Por favor, renove o consentimento.',
          description: 'Usamos cookies para analisar o tráfego e medir nossas campanhas. Você pode <button class="cm-link cn-learn-more">escolher</button> o que ativar ou aceitar tudo.',
          learnMore: 'Personalizar'
        },
        purposes: {
          analytics: { title: 'Análise', description: 'Nos ajuda a entender como o site é usado (PostHog).' },
          advertising: { title: 'Publicidade', description: 'Mede a eficácia das nossas campanhas em redes sociais (Meta Pixel).' },
          session: { title: 'Melhoria da experiência', description: 'Mapas de calor e gravações anônimas de sessão (Microsoft Clarity).' }
        },
        ok: 'Aceitar tudo',
        save: 'Salvar minhas escolhas',
        decline: 'Recusar tudo',
        close: 'Fechar',
        acceptAll: 'Aceitar tudo',
        acceptSelected: 'Salvar minhas escolhas',
        consentNoticeTitle: 'Sua privacidade, sua escolha',
        service: {
          disableAll: { title: 'Ativar ou desativar tudo', description: 'Use este interruptor mestre para ativar/desativar todos os serviços opcionais de uma vez.' },
          optOut: { title: '(opt-out)', description: 'Este serviço está ativo por padrão.' },
          required: { title: '(sempre ativo)', description: 'Este serviço é necessário para o funcionamento do site.' },
          purposes: 'Finalidades',
          purpose: 'Finalidade'
        }
      }
    }
  };
})();
