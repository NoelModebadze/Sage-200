// Menú mòbil de l'índex lateral (funciona sense connexió)
document.addEventListener("DOMContentLoaded", function () {
  var index = document.querySelector(".index");
  var boto = document.querySelector(".boto-menu");
  if (!index || !boto) return;

  boto.addEventListener("click", function () {
    var obert = index.classList.toggle("obert");
    boto.setAttribute("aria-expanded", obert);
    boto.textContent = obert ? "Tanca" : "Índex";
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && index.classList.contains("obert")) boto.click();
  });
});
