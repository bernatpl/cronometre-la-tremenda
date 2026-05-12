# Cronometre La Tremenda

App local per projectar el cronometre de **La Tremenda**, una carrera urbana de 12 voltes d'1 km amb temps decreixent.

## Com obrir-la

**Opció 1 (Recomanada):** Fes doble clic a `Obrir cronometre La Tremenda.cmd`

**Opció 2:** Obre `index.html` directament amb el navegador

## ⚡ Controls ràpids

| Acció | Control |
|-------|---------|
| Play/Pause | **Spacebar** o clic al rellotge |
| Salta a ronda | Clic al número de ronda |
| Ajusta temps | Clic a la barra de progrés |
| Pantalla completa | Tecla **F** |
| Reinicia | Tecla **R** |

## 🎯 Visió general

- ✨ Rellotge GRAN visible a distància
- 🎨 Branded amb colors de la web oficial
- 🔔 Beeps distinctius (countdown, volta, descans)
- 📊 Volta actual indicada clarament
- 🎬 Animacions subtils

## 📚 Documentació completa

Per a **especificacions detallades**, **timing de les voltes**, **requisits funcionals**, **disseny tècnic**, i **historial de problemes resolts**, veure **[ESPECIFICACIONS.md](ESPECIFICACIONS.md)**.

## 📁 Fitxers principals

- `index.html` - Estructura
- `styles.css` - Estil i animacions
- `app.js` - Lògica de joc
- `server.js` - Servidor local (dev)
- `ESPECIFICACIONS.md` - Documentació completa

| 5⭐ | 5:00 | 12 km/h |
| 6 | 4:30 | 13,3 km/h |
| 7 | 4:00 | 15 km/h |
| 8 | 3:45 | 16 km/h |
| 9 | 3:30 | 17,1 km/h |
| 10 | 3:15 | 18,4 km/h |
| 11 | 3:00 | 20 km/h |
| 12 | 2:45 | 21,8 km/h |

⭐ Els participants **Popular** completen fins a la volta 5

## ⌨️ Teclat (per a operadors)

- **Espai**: Comença/Pausa
- **N**: Següent fase
- **R**: Reinicia
- **F**: Pantalla completa

## 🎨 Disseny i branding

L'app manté fidelitat visual amb la pàgina oficial de La Tremenda:

- Colors: Blau cel (#8ec7d5), vermell contrast (#d31821), negre tinta (#06090b)
- Logo: Grup Excursionista Ter-Guilleries prominent
- Tipografia: Impactant, gran contrast, font-weight 900
- Decoració: Imatge del Tremenda dragon subtle al fons

## 💾 Fitxers principals

- `index.html` - Estructura HTML
- `styles.css` - Disseny responsive i animacions
- `app.js` - Lògica del cronometre
- `server.js` - Servidor local (per desenvolupament)

## 🚀 Per a usar en projecció

1. **Obrir l'app** → Click a doble click al .cmd
2. **Preparar pantalla** → Click "Pantalla completa"
3. **Posicionar** → Que sigui visible des de la meta
4. **Controlar** → Pass el ratolí per la dreta per mostrar botons
5. **Comença cursa** → Click "Comença" a les 21:00

## ℹ️ Notes tècniques

- **Offline**: Funciona sense internet (les imatges es carreguen del navegador)
- **Responsive**: S'adapta a 16:9, 16:10, 4:3 i altres pantalles
- **HTML5 Audio**: Beeps generats amb Web Audio API
- **No plugins**: Funciona amb navegador estàndard
