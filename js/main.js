/* =========================================================
   Sage 200 · Treball SGE (Noel Modebadze i Guillem Palahi)
   Funcionalitats interactives. Tot funciona sense connexió.
   ========================================================= */
(function () {
  "use strict";

  // Guardar preferències: localStorage pot fallar en alguns navegadors amb file://
  var memoria = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  // Aplicar el tema com més aviat millor per evitar parpelleigs
  var temaDesat = memoria.get("sage200-tema");
  if (temaDesat) document.documentElement.setAttribute("data-theme", temaDesat);

  document.addEventListener("DOMContentLoaded", function () {
    var html = document.documentElement;
    var body = document.body;

    /* ---------- 1. Menú mòbil ---------- */
    var index = document.querySelector(".index");
    var botoMenu = document.querySelector(".boto-menu");
    if (index && botoMenu) {
      botoMenu.addEventListener("click", function () {
        var obert = index.classList.toggle("obert");
        botoMenu.setAttribute("aria-expanded", obert);
        botoMenu.textContent = obert ? "Tanca" : "Índex";
      });
    }

    /* ---------- 2. Mode fosc ---------- */
    var botoTema = document.getElementById("boto-tema");
    function esFosc() {
      var t = html.getAttribute("data-theme");
      if (t) return t === "dark";
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    function actualitzaBotoTema() {
      if (!botoTema) return;
      var fosc = esFosc();
      botoTema.setAttribute("aria-pressed", fosc);
      botoTema.querySelector(".txt").textContent = fosc ? "Mode clar" : "Mode fosc";
    }
    if (botoTema) {
      botoTema.addEventListener("click", function () {
        var nou = esFosc() ? "light" : "dark";
        html.setAttribute("data-theme", nou);
        memoria.set("sage200-tema", nou);
        actualitzaBotoTema();
      });
      actualitzaBotoTema();
    }

    /* ---------- 3. Mode presentació (per a l'exposició oral) ---------- */
    var botoPres = document.getElementById("boto-presentacio");
    function posaPresentacio(actiu) {
      body.classList.toggle("mode-presentacio", actiu);
      if (botoPres) botoPres.setAttribute("aria-pressed", actiu);
      memoria.set("sage200-presentacio", actiu ? "1" : "0");
    }
    if (botoPres) {
      botoPres.addEventListener("click", function () {
        posaPresentacio(!body.classList.contains("mode-presentacio"));
      });
    }
    if (memoria.get("sage200-presentacio") === "1") posaPresentacio(true);

    /* ---------- 4. Barra de progrés de lectura + botó "amunt" ---------- */
    var progres = document.querySelector(".progres span");
    var amunt = document.querySelector(".amunt");
    function onScroll() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      if (progres) progres.style.width = pct + "%";
      if (amunt) amunt.classList.toggle("visible", window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (amunt) amunt.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

    /* ---------- 5. Navegació amb teclat ←  → ---------- */
    document.addEventListener("keydown", function (e) {
      var t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowRight" && body.dataset.seguent) location.href = body.dataset.seguent;
      if (e.key === "ArrowLeft" && body.dataset.anterior) location.href = body.dataset.anterior;
      if (e.key === "Escape") {
        if (index && index.classList.contains("obert")) botoMenu.click();
        if (body.classList.contains("mode-presentacio")) posaPresentacio(false);
      }
      if (e.key === "/" ) {
        var c = document.getElementById("cerca");
        if (c) { e.preventDefault(); if (index && !index.classList.contains("obert") && window.innerWidth <= 900) botoMenu.click(); c.focus(); }
      }
    });

    /* ---------- 6. Cercador intern ---------- */
    var cerca = document.getElementById("cerca");
    var resultats = document.getElementById("resultats");
    function normalitza(s) {
      return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    function escapa(s) {
      return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
    }
    if (cerca && resultats && window.INDEX_CERCA) {
      var dades = window.INDEX_CERCA.map(function (p) {
        return { url: p.url, titol: p.titol, text: p.text, norm: normalitza(p.titol + " " + p.text) };
      });
      cerca.addEventListener("input", function () {
        var q = normalitza(cerca.value.trim());
        resultats.innerHTML = "";
        if (q.length < 2) { resultats.hidden = true; return; }
        var trobats = [];
        dades.forEach(function (p) {
          var pos = p.norm.indexOf(q);
          if (pos === -1) return;
          var n = p.norm.split(q).length - 1;
          var ini = Math.max(0, pos - 40);
          var espai = p.text.lastIndexOf(" ", ini);
          if (ini > 0 && espai > -1) ini = espai + 1;
          var frag = p.text.substr(ini, 90);
          var fi = frag.lastIndexOf(" ");
          if (fi > 60) frag = frag.substr(0, fi);
          trobats.push({ p: p, n: n, frag: (ini > 0 ? "…" : "") + frag + "…" });
        });
        trobats.sort(function (a, b) { return b.n - a.n; });
        if (!trobats.length) {
          resultats.innerHTML = '<li class="buit">Cap resultat per a "' + escapa(cerca.value) + '"</li>';
        } else {
          trobats.slice(0, 6).forEach(function (r) {
            var li = document.createElement("li");
            li.innerHTML = '<a href="' + r.p.url + '"><strong>' + escapa(r.p.titol) + '</strong><span>' +
              escapa(r.frag) + '</span><em>' + r.n + (r.n === 1 ? " coincidència" : " coincidències") + "</em></a>";
            resultats.appendChild(li);
          });
        }
        resultats.hidden = false;
      });
      cerca.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          var primer = resultats.querySelector("a");
          if (primer) location.href = primer.getAttribute("href");
        }
        if (e.key === "Escape") { cerca.value = ""; resultats.hidden = true; }
      });
    }

    /* ---------- 7. Botó "Copia" als blocs de codi ---------- */
    document.querySelectorAll("pre").forEach(function (pre) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "copia";
      b.textContent = "Copia";
      b.addEventListener("click", function () {
        var text = pre.querySelector("code") ? pre.querySelector("code").innerText : pre.innerText;
        var fet = function () { b.textContent = "Copiat ✓"; setTimeout(function () { b.textContent = "Copia"; }, 1600); };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(fet, function () { copiaAntic(text); fet(); });
        } else { copiaAntic(text); fet(); }
      });
      pre.appendChild(b);
    });
    function copiaAntic(text) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
    }

    /* ---------- 8. Filtre d'ofertes de feina ---------- */
    var filtre = document.querySelector(".filtre");
    if (filtre) {
      filtre.addEventListener("click", function (e) {
        var b = e.target.closest("button");
        if (!b) return;
        filtre.querySelectorAll("button").forEach(function (x) {
          x.classList.toggle("actiu", x === b);
          x.setAttribute("aria-pressed", x === b);
        });
        var tipus = b.dataset.filtre;
        document.querySelectorAll(".oferta").forEach(function (o) {
          o.hidden = !(tipus === "totes" || o.dataset.tipus === tipus);
        });
      });
    }

    /* ---------- 9. Calculadora de llicències ---------- */
    var calc = document.getElementById("calculadora");
    if (calc) {
      // Preus per usuari i mes (sense IVA), consultats el setembre de 2026
      var PREUS = {
        anual:   { odoo: 19.90, bc: 69.30, sage: 136 },
        mensual: { odoo: 24.90, bc: 69.30, sage: 136 }
      };
      var rang = document.getElementById("calc-usuaris");
      var num = document.getElementById("calc-num");
      var nota = document.getElementById("calc-nota");
      var pagament = "anual";
      var eur = function (v) { return v.toLocaleString("ca-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €"; };

      function calcula() {
        var u = parseInt(rang.value, 10);
        num.textContent = u;
        var p = PREUS[pagament];
        var cost = { odoo: p.odoo * u, bc: p.bc * u, sage: p.sage };
        var max = Math.max(cost.odoo, cost.bc, cost.sage);
        Object.keys(cost).forEach(function (k) {
          calc.querySelector('[data-calc="' + k + '"]').style.width = (cost[k] / max * 100) + "%";
          calc.querySelector('[data-calc-text="' + k + '"]').textContent = eur(cost[k]) + "/mes";
        });
        var mesBarat = Object.keys(cost).reduce(function (a, b) { return cost[a] <= cost[b] ? a : b; });
        var noms = { odoo: "Odoo Standard", bc: "Business Central", sage: "Sage 200 Smart Business" };
        var frontera = Math.ceil(PREUS[pagament].sage / PREUS[pagament].odoo);
        nota.innerHTML = "Amb els preus d'entrada i <strong>" + u + (u === 1 ? " usuari" : " usuaris") + "</strong>, la llicència més econòmica és <strong>" +
          noms[mesBarat] + "</strong>. Sage 200 Smart Business surt més a compte que Odoo a partir de " + frontera +
          " usuaris. Preus \"des de\", sense IVA ni implantació." +
          (pagament === "mensual" ? " Microsoft i Sage només publiquen un preu, per això no canvien." : "");
      }
      rang.addEventListener("input", calcula);
      calc.querySelectorAll("[data-pagament]").forEach(function (b) {
        b.addEventListener("click", function () {
          pagament = b.dataset.pagament;
          calc.querySelectorAll("[data-pagament]").forEach(function (x) {
            x.classList.toggle("actiu", x === b);
            x.setAttribute("aria-pressed", x === b);
          });
          calcula();
        });
      });
      calcula();
    }
  });
})();
