# idisko-web

Site public d'iDisko (www.idisko.com), servi par GitHub Pages. **Pousser sur `main` publie le site.**

## Page d'accueil

La page d'accueil est statique : le HTML est déjà prêt, sans bibliothèque à charger.
Elle existe en cinq langues, une adresse par langue :

| Langue | Adresse | Fichier |
|---|---|---|
| Espagnol | `/` | `index.html` |
| Anglais | `/en/` | `en/index.html` |
| Français | `/fr/` | `fr/index.html` |
| Italien | `/it/` | `it/index.html` |
| Portugais | `/pt/` | `pt/index.html` |

La racine est en espagnol. Un navigateur dans une autre langue est envoyé vers sa page
(sauf les robots), et un choix fait à la main est mémorisé (`localStorage.idisko_lang`).

**Ne pas modifier ces `index.html` à la main.** Ils sont générés :

```bash
python3 tools/landing/build.py
```

- `tools/landing/strings.json` : tous les textes, par langue.
- `tools/landing/template.html` : la structure, le style et le peu de JavaScript.
- `assets/app/` : captures de l'app et photos (WebP), une série par langue.
- `assets/og-<langue>.jpg` : image d'aperçu des liens partagés.

Règles de rédaction : pas de tiret cadratin (le script refuse de générer la page s'il en trouve un),
et rien qui ne soit vrai dans l'app aujourd'hui.

## Bouton principal

Sur téléphone, le bouton principal mène à la boutique de l'appareil (App Store ou Google Play).
Sur ordinateur, il ouvre la web app (`app.idisko.com`). Les paramètres de campagne (`utm_*`)
suivent vers la web app et, pour Google Play, dans le `referrer` d'installation.

## Cookies et mesure

Le bandeau (Klaro) et les outils de mesure sont chargés après l'affichage de la page.
Rien n'est mesuré sans accord. Fichiers : `assets/klaro-config.js` (textes et services),
`assets/klaro-trackers.js` (PostHog, Meta, Clarity), fin de `assets/klaro.min.css` (apparence).

## Autres pages

`faq/`, `cgu/`, `politique-de-confidentialite/`, `mentions-legales/`, `cookies/`,
`eliminar-cuenta/`, `seguridad-infantil/` et `office/` sont des fichiers HTML écrits à la main,
avec leurs langues dans le même fichier.
