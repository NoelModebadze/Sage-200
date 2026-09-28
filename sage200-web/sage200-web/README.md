# Treball Sage 200 (HTML5 + CSS)

Web de diverses pàgines enllaçades entre si. No carrega cap recurs extern
(ni fonts de Google, ni CDN, ni imatges d'Internet): funciona sense connexió
a qualsevol PC. Només cal fer doble clic a `index.html`.

```
sage200-web/
├── index.html          Portada + 1. Introducció + mapa de continguts
├── informacio.html     2. Informació general
├── llicencies.html     3. Llicències i preus
├── bases-dades.html    4. Base de dades
├── installacio.html    5. Instal·lació i accés
├── moduls.html         6. Mòduls i desenvolupament
├── competidors.html    7. Comparativa
├── feina.html          8. Ofertes de feina
├── avantatges.html     9. Avantatges i inconvenients
├── bibliografia.html   10. Bibliografia
├── css/style.css
├── js/main.js          (menú mòbil)
└── img/                favicon + les vostres captures
```

Els únics enllaços a Internet són els de la bibliografia (són les fonts
consultades i s'obren en una pestanya nova).

## Obrir a Visual Studio Code
File → Open Folder → `sage200-web`. Opcional: extensió Live Server.

## Publicar (GitHub Pages)
Repositori públic → puja els fitxers (index.html a l'arrel) →
Settings → Pages → branca `main`, carpeta `/ (root)`.
