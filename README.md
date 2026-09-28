# Sage 200 · Treball de Sistemes de Gestió Empresarial
Noel Modebadze i Guillem Palahi · DAM 2026-27

Web de 10 pàgines enllaçades, feta amb HTML5, CSS3 i JavaScript sense llibreries.
No carrega res d'Internet: funciona a qualsevol PC fent doble clic a `index.html`.
(Els únics enllaços externs són les fonts de la bibliografia.)

## Funcionalitats
- Cercador intern (tecla `/`), amb índex a `js/cerca-index.js`
- Mode fosc (es recorda entre pàgines)
- Mode presentació per a l'exposició oral (`Esc` per sortir)
- Navegació amb les fletxes ← → del teclat
- Calculadora de cost de llicències (pàgina Comparativa)
- Filtre d'ofertes de feina (tècniques / d'usuari)
- Botó "Copia" als exemples de codi
- Barra de progrés de lectura i botó per tornar a dalt
- Disseny responsive (mòbil, tauleta, ordinador) i estils d'impressió

## Estructura
```
index.html  informacio.html  llicencies.html  bases-dades.html  installacio.html
moduls.html  competidors.html  feina.html  avantatges.html  bibliografia.html
css/style.css   js/main.js   js/cerca-index.js   img/
```

## Publicar (GitHub Pages)
Repositori públic → puja els fitxers (index.html a l'arrel) →
Settings → Pages → branca `main`, carpeta `/ (root)`.
