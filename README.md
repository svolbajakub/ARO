# ARO Komunikátor — nasazení na GitHub Pages

## Soubory v repozitáři
```
aro-komunikator.html   ← hlavní aplikace
manifest.json          ← PWA manifest
sw.js                  ← service worker (offline + persistentní storage)
icon.png               ← ikona aplikace (MUSÍTE DODAT, min. 512×512px)
```

## Nastavení GitHub Pages
1. Repo → **Settings → Pages → Source: main branch / root**
2. Stránka bude dostupná na `https://<váš-účet>.github.io/<repo>/aro-komunikator.html`

## Instalace na iPad jako PWA (ne Web Clip!)
1. Otevřete URL v **Safari** (ne Chrome, ne Firefox)
2. Klepněte na ikonu **Sdílet** (čtverec se šipkou nahoru)
3. Vyberte **„Přidat na plochu"**
4. Potvrďte název → **Přidat**

> ⚠️ Musí to být Safari. Pouze Safari na iOS umí nainstalovat PWA.
> Chrome/Firefox na iOS tuto funkci nemají.

## Jak poznat že jde o PWA (ne Web Clip)
- Při otevření z plochy se aplikace spustí **bez adresního řádku Safari**
- Funguje **offline** (i bez internetu)
- Data (pokyny, kategorie) přežijí force-quit i restart iPadu

## Aktualizace aplikace
Po nahrání nové verze na GitHub stačí na iPadu:
1. Otevřít aplikaci
2. Aplikace automaticky zjistí nový service worker a aktualizuje cache
3. Po dalším otevření běží nová verze

Pokud chcete vynutit okamžitou aktualizaci, v `sw.js` změňte číslo verze:
```js
const CACHE = 'aro-v2';  // bylo v1
```

## Záloha dat
Data se ukládají do `localStorage` v prohlížeči. Pro zálohu použijte
Export/Import v admin panelu (tlačítko v záhlaví adminu).
