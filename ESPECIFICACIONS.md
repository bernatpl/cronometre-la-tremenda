# Especificacions del Cronometre de La Tremenda

**Versió**: 2.0  
**Data última actualització**: Maig 2026  
**Estat**: Production Ready

---

## 📋 Visió General

Aplicació local de desktop per a projectar el cronòmetre de **La Tremenda**, una cursa urbana d'1 km amb 12 voltes progressivament més ràpides. L'app funciona sense connexió a internet, sense instal·lacions, i és totalment controlable tant remotament (panell lateral ocult) com des de la pantalla projectada (clicks i keyboard).

---

## 🏃 Mecànica de la Cursa

### Format bàsic
- **Recorregut**: Urbà, 1 km per volta
- **Total voltes**: 12
- **Modalitats**: 
  - **Tremenda**: Totes les 12 voltes
  - **Popular**: Primeres 5 voltes (no competitiu, tots corren junts)
- **Marcat**: Un rellotge compartit (els populars pleguen a volta 5)

### Timing per volta

| Volta | Temps | Velocitat |
|-------|-------|-----------|
| 1 | 15m 00s | 4 km/h |
| 2 | 12m 00s | 5 km/h |
| 3 | 9m 00s | 6,6 km/h |
| 4 | 6m 00s | 10 km/h |
| 5 | 5m 00s | 12 km/h |
| 6 | 4m 30s | 13,3 km/h |
| 7 | 4m 00s | 15 km/h |
| 8 | 3m 45s | 16 km/h |
| 9 | 3m 30s | 17,1 km/h |
| 10 | 3m 15s | 18,4 km/h |
| 11 | 3m 00s | 20 km/h |
| 12 | 2m 45s | 21,8 km/h |

### Descans
- **Entre voltes**: 3 minuts de descans per reposar
- **Compte enrere pre-volta**: 10 segons antes de cada volta per avisar dels corredors

### Eliminació
- Si no arribes dins del temps límit, **ets eliminat**
- L'eliminador és el **rellotge de meta** (app), no el Tremendu
- Si ningú completa la volta 12, guanya qui arribi primer a la volta d'eliminació

---

## 🎯 Requisits Funcionals

### Fases de funcionament

#### 1. **READY** (Inicialització)
- État inicial, espera que l'usuari cliqui "Comença"
- Mostra: Volta 1, temps 0:00, "PREPARAT"

#### 2. **COUNTDOWN** (Compte enrere 10s)
- Ocorre **antes de cada volta** (inclosa la 1a)
- Mostra: "COMPTE ENRERE", compte enrere digital 10→0
- Animació: Pulsacions d'escala al rellotge
- Soroll: Beeps escalats (700Hz→1200Hz), més alts que lap
- Text addicional: "SORTIDA IMMINENT!"
- **Transició automàtica** a VOLTA quan arriba a 0

#### 3. **VOLTA** (Lap)
- Temps que decreix per a la volta actual
- Mostra: "VOLTA EN MARXA", temps restant, "/ 12"
- Colors: Gradient vermell-blanc a la barra de progrés
- Si temps arriba a 0: Suena beep final, passem a ELIMINAT

#### 4. **DESCANS** (Rest)
- 3 minuts de descans após cada volta completada
- Mostra: "DESCANS", comptador 3:00 → 0:00
- Colors: Gradient cel-blanc a barra de progrés
- Text: Proxima volta número i temps
- **Auto-transició** a COUNTDOWN quan arriba a 0

#### 5. **ELIMINAT** (Lap Missed)
- Apareix si corregut escap del temps límit
- Mostra: "ELIMINAT", volta actual, "Temps esgotat"
- Só: Beep baix i llarg (300Hz)
- **NO auto-transicions**: L'usuari ha de clicar "Reinicia" o saltar a volta

#### 6. **ACABAT** (Finished)
- Après de completar volta 12 + descans final
- Mostra: "CURSA ACABADA", "Enhorabona!", volta "12 / 12"

### Controls principais

#### Keyboard
| Tecla | Acció |
|-------|-------|
| **Spacebar** | Play / Pause |
| **N** | Siguiente fase (avança en debug mode) |
| **R** | Reinicia des de 0 |
| **F** | Fullscreen |

#### Mouse / Touch
| Element | Acció |
|---------|-------|
| **Click rellotge** | Play / Pause |
| **Click lap dots** | Salta a aquella volta |
| **Click schedule items** | Salta a aquella volta |
| **Click barra de progrés** | Ajusta temps dins la fase actual |

#### Panell lateral (apareix amb mouse a dreta)
- Botons: "Comença", "Pausa", "Següent", "Reinicia", "Pantalla completa"
- Inputs: "-10s", "+10s", "Salta a ronda"

### Visibilitat de controls

**Per defecte**: Controls ocults (pantalla projectada neta)
- Apareixen quan ratolí es mou al **lateral dret** (últims píxels)
- Desapareixen quan ratolí se'n va
- Sempre visibles si un botó té focus de teclat

---

## 🎨 Branding i Disseny Visual

### Colors (fidels a web oficial)
- **Sky Blue**: `#3fa9f5` (fons base)
- **Red**: `#d31821` (accents, highlight)
- **Dark Ink**: `#060909` (text fosc)
- **Warm Paper**: `#fff7ef` (fons alt, text clar)
- **Orange Accent**: `#f0a040` (accents addicionals)

### Tipografia
- **Títol "La Tremenda"**: Impact, 900 weight, inclinada
- **Números rellotge**: Arial Black, 900 weight, monospace-like
- **Labels**: Arial Black, 700 weight
- **Body**: Arial, regular

### Estil cartell
- Border del panell: 4px solid negre, sense border-radius (angulós)
- Shadows: Dramàtiques (20px offset, 15% opacity)
- Animacions: Subtils (pulse 1.01-1.04 escala)

### Assets visuals
- **Logo**: Grup Excursionista Ter-Guilleries (Google Sites CDN)
- **Dragon**: Tremenda amb rellotge (Google Sites CDN)
- **Títol**: Retallat del cartell oficial de la cursa

### Responsivitat
L'app s'adapta a:
- **16:9** (1280x720) - Projectores estàndard ✅
- **16:10** (1440x900) - Pantalles modernes ✅
- **4:3** (1024x768) - Pantalles més quadrades ✅
- **Panoramiques** (1600x700) - Pantalles ultra-wide ✅
- **Mobile** (máx 720px) - Operadors en telèfon ✅

Mides usades: `clamp()` amb `vw`, `vh`, `vmin` per flexibilitat.

---

## 🔧 Especificacions Tècniques

### Arquitectura

**Fitxers principals**:
- `index.html` - Estructura, HTML
- `styles.css` - Estil, animacions, responsivitat
- `app.js` - Lògica de fases, timing, interactivitat
- `server.js` - Servidor local HTTP (dev/test)
- `Obrir cronometre La Tremenda.cmd` - Launcher Windows

**Assets**:
- `assets/` - Imatges de Google Sites (logo, dragon)

### Lògica de timing

```javascript
// Cada fase té:
- state.phase: "ready" | "countdown" | "lap" | "rest" | "missed" | "finished"
- state.lapIndex: 0-11 (volta actual)
- state.durationMs: temps total de la fase en ms
- state.remainingMs: temps que falta per acabar la fase
- state.endAt: timestamp quan acaba la fase
- state.running: boolean si s'està executant
```

### Fases transitions

```
READY → COUNTDOWN → VOLTA → DESCANS → COUNTDOWN → ... → VOLTA(12) → DESCANS → ACABAT
  ↓ (si es perd)
  ELIMINAT ← (si no s'entra dins de temps)
```

### Rendering
- Actualitzacions cada **120ms** via `setInterval(tick, 120)`
- Render al DOM sense virtual DOM (vanilla JS)
- Animacions CSS handled per navegador (hardware accelerated)

### Beeps sonors

```javascript
// Countdown: escala segons temps restant
- 10-6s: 700Hz
- 5-1s: 900Hz
- 0s: 1100Hz (més alt)
- Final: 1200Hz 0.25s (culminació)

// Lap: constant (si es perd)
- 10-6s: 720Hz
- 5-1s: 920Hz

// Missed: llarg i baix
- 300Hz 0.5s (avís)
```

---

## 📊 Dades de l'App

### Arrays de referència

```javascript
const laps = [
  { number: 1, seconds: 900, speed: 4.0 },    // 15:00
  { number: 2, seconds: 720, speed: 5.0 },    // 12:00
  // ... (12 total)
];
```

### State global

```javascript
const state = {
  phase: "ready",           // Fase actual
  lapIndex: 0,              // Volta (0-11)
  running: false,           // Es corre o pausat
  remainingMs: 900000,      // Ms restants
  durationMs: 900000,       // Durada total de la fase
  endAt: null,              // Timestamp d'acabament
  tickId: null              // ID del setInterval
};
```

---

## 🚀 Funcionament (día de la cursa)

### Preparació
1. Iniciar app: Doble clic a `Obrir cronometre La Tremenda.cmd`
2. Posar a pantalla completa: Tecla **F**
3. Confirmar que es veu tota la informació sense talles

### Durant la cursa
1. Clics a "Comença" o **Spacebar** per iniciar
2. L'app auto-transita entre countdown → volta → descans → ...
3. Si cal pausar: **Spacebar** o clic al rellotge
4. Si cal ajustar temps: Usar panell lateral o clic a barra de progrés

### Controls d'emergència
- **Reinicia**: Tecla **R** (torna a READY)
- **Salta a volta**: Clic a numero o usar panell
- **Fullscreen**: Tecla **F** si es treu accidentalment

---

## ✅ Issues Resolts

### Sessió 1: Inicialització
- ✅ App local sense internet
- ✅ Branding fidel a web
- ✅ Cronòmetre gran i visible a 1280x720
- ✅ Controls ocults fins hover

### Sessió 1-2: Disseny
- ✅ Caràcters ajuntats (letter-spacing negatiu eliminat)
- ✅ Textos solapeats (gaps i padding augmentats)
- ✅ Logo desaparegut (flex-shrink: 0, mida aumentada)
- ✅ Animacions suaus (pulse 1.01-1.04 en lloc de 1.02-1.08)
- ✅ Títol "La Tremenda" nítid i llegible

### Sessió 2: Interactivitat
- ✅ Countdown de 10 segundos + animacions
- ✅ Auto-transició countdown → volta
- ✅ Rondes clicables (saltar)
- ✅ Click al rellotge per play/pause
- ✅ Click a barra de progrés per ajustar
- ✅ Múltiples ways de controlar sense panell
- ✅ Cursor pointer als elements interactius

---

## 📝 Notes per a futures sessions

### Millores possibles
1. Generar **PNG assets propis** (logo, dragon) independents de URLs
2. **Dark mode** opcional per a pantalles LED reflexives
3. **Sound control** per ajustar volum sense recarregar
4. **Export resultats** en CSV (top 3, temps totals)
5. **Undo/Redo** per accions
6. **Keyboard shortcuts guide** al startup
7. **Remote control** via URL parameters desde otra pantalla

### Manteniment
- Verificar que URLs de Google Sites CDN continuen vàlides
- Testar app cada any antes de la cursa
- Guardar backup d'assets si URLs expiren
- Actualitzar timing si regles de cursa canvien

---

## 📞 Context original

**Web oficial**: https://www.geterguilleries.cat/cursa-la-tremenda  
**Data prevista**: 6 de juny de 2026, La Cellera de Ter  
**Hora inici**: 21:00 h  
**Lloc**: Plaça de la Vila

**Organitzadors**: Grup Excursionista Ter-Guilleries  
**Inspiració**: Cursa del Tractor (Casserres, Berguedà)  
**Dedicatòria**: Al Tremendu, dimoni de la colla de diables de Puig d'Afrou (2008-2017)
