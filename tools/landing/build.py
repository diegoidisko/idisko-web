#!/usr/bin/env python3
"""Génère la page d'accueil statique d'idisko.com, une par langue.

    python3 tools/landing/build.py

Entrées : tools/landing/template.html + tools/landing/strings.json
Sorties : index.html (espagnol) · en/ · fr/ · it/ · pt/ (index.html chacune)

La page ne dépend d'aucune bibliothèque : le HTML est déjà prêt, le CSS et le
peu de JavaScript sont dans la page. Pour changer un texte, modifier
strings.json puis relancer ce script. Ne pas éditer les index.html à la main.
"""
import json
import pathlib
import re

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
LANGS = ["es", "en", "fr", "it", "pt"]
PATHS = {"es": "/", "en": "/en/", "fr": "/fr/", "it": "/it/", "pt": "/pt/"}
HREFLANG = {"es": "es", "en": "en", "fr": "fr", "it": "it", "pt": "pt-BR"}
NAMES = {"es": "Español", "en": "English", "fr": "Français", "it": "Italiano", "pt": "Português"}
SITE = "https://www.idisko.com"
APP_STORE = "https://apps.apple.com/app/idisko/id6749269410"
PLAY = "https://play.google.com/store/apps/details?id=com.idisko.app"

APPLE = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>'
PLAY_ICON = '<svg width="20" height="22" viewBox="0 0 512 512" aria-hidden="true"><path fill="#22FFBD" d="M48 59.4c0-16 8.7-30 21.8-37.5L322 256 69.8 490.2C56.7 482.7 48 468.6 48 452.6V59.4z"/><path fill="#DF07FF" d="M379.8 233.7l-57.8 22.3 57.8 22.3 66.9-38.3c14.7-8.4 14.7-30.2 0-38.6l-66.9-38.3v70.6z"/><path fill="#8737DC" d="M322 256L69.8 21.9c4.5-2.5 9.7-3.9 15.1-3.9 5.6 0 11 1.5 15.700 4.1L379.8 186.1 322 256z"/><path fill="#fff" d="M322 256l57.8 69.9L100.6 490c-4.7 2.6-10.1 4.100-15.700 4.100-5.4 0-10.6-1.4-15.100-3.9L322 256z"/></svg>'
CHECK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>'
ICONS = [  # 18+ · caméra · modération · signaler
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/></svg>',
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 13 5.2 3.5a.5.5 0 0 0 .8-.4V7.900a.5.5 0 0 0-.8-.4L16 10.500"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>',
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.500 7.500-7.660 8.950a1 1 0 0 1-.670-.010C7.500 20.500 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.500-1.200 6.240-2.720a1.170 1.170 0 0 1 1.520 0C14.510 3.810 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/></svg>',
]


def esc(s):
    return s.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;").replace(">", "&gt;")


def two_lines(h):
    """« ligne 1|ligne 2 » → ligne 1 + ligne 2 mise en valeur."""
    a, b = h.split("|")
    return f"{a} <em>{b}</em>"


def badges(S):
    return (
        f'<a class="badge" href="{APP_STORE}" data-event="app_store_click" data-meta="Lead" data-posthog="cta_click_appstore">{APPLE}'
        f'<span><small>{S["store"]["appCap"]}</small><b>{S["store"]["appLabel"]}</b></span></a>'
        f'<a class="badge" href="{PLAY}" data-play data-event="play_store_click" data-meta="Lead" data-posthog="cta_click_playstore">{PLAY_ICON}'
        f'<span><small>{S["store"]["playCap"]}</small><b>{S["store"]["playLabel"]}</b></span></a>'
    )


def jsonld(lang, S):
    plain = lambda a: re.sub(r"<[^>]+>", "", a)
    graph = [
        {"@type": "Organization", "@id": SITE + "/#org", "name": "iDisko", "legalName": "DS CONNECT", "url": SITE + "/",
         "logo": SITE + "/assets/logo.png", "email": "contact@idisko.com",
         "address": {"@type": "PostalAddress", "streetAddress": "Parc Eureka, Le Pôle Eureka, 418 Rue du Mas de Verchant",
                     "addressLocality": "Montpellier", "postalCode": "34000", "addressCountry": "FR"},
         "sameAs": ["https://www.instagram.com/appidisko/", "https://www.tiktok.com/@appidisko",
                    "https://www.youtube.com/@idiskoapp", "https://www.linkedin.com/company/104701617"]},
        {"@type": "WebSite", "@id": SITE + "/#website", "url": SITE + "/", "name": "iDisko", "description": S["meta"]["desc"],
         "publisher": {"@id": SITE + "/#org"}, "inLanguage": [HREFLANG[l] for l in LANGS]},
        {"@type": "MobileApplication", "@id": SITE + "/#app", "name": "iDisko", "operatingSystem": "iOS, ANDROID",
         "applicationCategory": "SocialNetworkingApplication", "url": SITE + PATHS[lang], "image": SITE + f"/assets/og-{lang}.jpg",
         "description": S["meta"]["desc"], "publisher": {"@id": SITE + "/#org"}, "downloadUrl": APP_STORE, "installUrl": APP_STORE,
         "sameAs": [APP_STORE, PLAY], "isAccessibleForFree": True,
         "audience": {"@type": "PeopleAudience", "suggestedMinAge": 18},
         "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR"}},
        {"@type": "FAQPage", "@id": SITE + PATHS[lang] + "#faq", "inLanguage": HREFLANG[lang],
         "mainEntity": [{"@type": "Question", "name": i["q"], "acceptedAnswer": {"@type": "Answer", "text": plain(i["a"])}}
                        for i in S["faq"]["items"]]},
    ]
    return json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")


def build(lang, S, tpl):
    path = PATHS[lang]
    frag = {}
    frag["hreflang"] = "\n".join(
        f'<link rel="alternate" hreflang="{HREFLANG[l]}" href="{SITE}{PATHS[l]}">' for l in LANGS
    ) + f'\n<link rel="alternate" hreflang="x-default" href="{SITE}/en/">'
    # La racine est en espagnol : les autres langues de navigateur partent vers leur page (sauf les robots).
    frag["rootredirect"] = (
        'try{var s=localStorage.getItem("idisko_lang"),L=["es","en","fr","it","pt"],b=(navigator.language||"es").slice(0,2).toLowerCase(),'
        'l=L.indexOf(s)>-1?s:(L.indexOf(b)>-1?b:"en");'
        'if(l!=="es"&&!/bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|preview|lighthouse|pagespeed/i.test(u))'
        'location.replace("/"+l+"/"+location.search+location.hash)}catch(e){}'
    ) if lang == "es" else ""
    frag["jsonld"] = jsonld(lang, S)
    cur = lambda l: ' aria-current="true"' if l == lang else ""
    frag["langmenu"] = "".join(
        f'<li><a href="{PATHS[l]}" data-lang="{l}" hreflang="{HREFLANG[l]}"{cur(l)}>{NAMES[l]}</a></li>' for l in LANGS
    )
    frag["footlangs"] = "".join(
        f'<a href="{PATHS[l]}" data-lang="{l}" hreflang="{HREFLANG[l]}"{cur(l)}>{NAMES[l]}</a>' for l in LANGS
    )
    frag["apple"], frag["play"], frag["badges"] = APPLE, PLAY_ICON, badges(S)
    frag["features"] = "\n".join(
        f'<div class="feat" id="{f["id"]}"><div class="tx"><span class="tag">{f["tag"]}</span><h3>{two_lines(f["h"])}</h3><p>{f["body"]}</p></div>'
        f'<div class="ph"><div class="phone"><img src="/assets/app/{f["id"]}-{lang}.webp" alt="{esc(f["alt"])}" width="600" height="1304" loading="lazy" decoding="async"></div></div></div>'
        for f in S["features"]
    )
    frag["safety_h"] = two_lines(S["safety"]["h"])
    frag["safety"] = "".join(
        f'<div class="card"><div class="ic">{ICONS[n]}</div><h3>{i["t"]}</h3><p>{i["d"]}</p></div>' for n, i in enumerate(S["safety"]["items"])
    )
    frag["plans_h"] = two_lines(S["plans"]["h"])
    frag["plans_free"] = "".join(f"<li>{CHECK}<span>{i}</span></li>" for i in S["plans"]["freeItems"])
    frag["plans_premium"] = "".join(f"<li>{CHECK}<span>{i}</span></li>" for i in S["plans"]["premiumItems"])
    frag["faq"] = "".join(f'<details><summary>{i["q"]}</summary><p>{i["a"]}</p></details>' for i in S["faq"]["items"])
    frag["final_h"] = two_lines(S["final"]["h"])
    frag["newsjs"] = json.dumps({k: S["news"][k] for k in ("sending", "successTitle", "successBody", "already", "invalid", "network")}, ensure_ascii=False)

    def sub(m):
        key = m.group(1)
        if key.startswith(">"):
            return frag[key[1:]]
        if key == "lang":
            return lang
        if key == "path":
            return path
        node = S
        for part in key.split("."):
            node = node[part]
        return node

    out = re.sub(r"\{\{(>?[A-Za-z0-9_.]+)\}\}", sub, tpl)
    # les chaînes de strings.json placées dans des attributs ne contiennent ni guillemets ni chevrons
    assert "{{" not in out, "marqueur non remplacé"
    assert "—" not in out, "tiret cadratin dans la page (Diego n'en veut pas)"
    dst = ROOT / ("index.html" if lang == "es" else f"{lang}/index.html")
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(out, encoding="utf-8")
    return dst, len(out.encode("utf-8"))


def main():
    strings = json.loads((HERE / "strings.json").read_text(encoding="utf-8"))
    tpl = (HERE / "template.html").read_text(encoding="utf-8")
    for lang in LANGS:
        dst, size = build(lang, strings[lang], tpl)
        print(f"{dst.relative_to(ROOT)}  {size / 1024:.1f} KB")


if __name__ == "__main__":
    main()
