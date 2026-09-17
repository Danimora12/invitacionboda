/* Script — Invitación Diana & Pedro
   Sin librerías. Lo que se configura desde index.html:
   - Fecha del contador:  data-fecha="2026-11-01T16:00:00-06:00"  (en <div id="timer">)
   - Video de fondo:      data-video="ID_DE_YOUTUBE"               (en <section id="home">; bórralo para quitar el video)
   - Fin del evento:      data-fin="..."                           (en <div id="timer">, para el calendario)
   - Lugar:               textos y data-lat / data-lng             (en <section id="ubicacion-section">)
*/
(function () {
  "use strict";
  var d = document,
    w = window;
  var nav = d.getElementById("ftco-navbar");
  var menu = d.getElementById("ftco-nav");
  var toggler = d.querySelector(".navbar-toggler");
  var hero = d.getElementById("home");
  var links = [].slice.call(menu.querySelectorAll('a[href^="#"]'));

  // Menú móvil
  toggler.addEventListener("click", function () {
    var open = menu.classList.toggle("show");
    toggler.classList.toggle("active", open);
    toggler.setAttribute("aria-expanded", open);
  });

  // Scroll suave + cerrar menú
  links.forEach(function (a) {
    a.addEventListener("click", function (e) {
      var t = d.querySelector(a.getAttribute("href"));
      if (!t) return;
      e.preventDefault();
      w.scrollTo({ top: t.getBoundingClientRect().top + w.pageYOffset - 70, behavior: "smooth" });
      menu.classList.remove("show");
      toggler.classList.remove("active");
      toggler.setAttribute("aria-expanded", false);
    });
  });

  // Barra fija, enlace activo y parallax del portada
  var ticking = false;
  function onScroll() {
    var st = w.pageYOffset,
      c = nav.classList;
    if (st > 150) c.add("scrolled");
    else if (c.contains("scrolled")) c.remove("scrolled", "sleep");
    if (st > 350) c.add("awake");
    else if (c.contains("awake")) {
      c.remove("awake");
      c.add("sleep");
    }

    var current = null;
    links.forEach(function (a) {
      var t = d.querySelector(a.getAttribute("href"));
      if (t && t.getBoundingClientRect().top <= 300) current = a;
    });
    // Al llegar al final de la página, marcar la última sección
    if (w.innerHeight + st >= d.documentElement.scrollHeight - 2) current = links[links.length - 1];
    links.forEach(function (a) {
      a.classList.toggle("active", a === current);
    });

    if (st < hero.offsetHeight) hero.style.backgroundPosition = "center " + Math.round(st * 0.5) + "px";
    ticking = false;
  }
  w.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        w.requestAnimationFrame(onScroll);
      }
    },
    { passive: true },
  );
  onScroll();

  // Animación de entrada
  var queue = [],
    timer = null;
  function flush() {
    queue.forEach(function (el, k) {
      setTimeout(function () {
        el.classList.add("fadeInUp", "ftco-animated");
      }, k * 50);
    });
    queue = [];
    timer = null;
  }
  var items = d.querySelectorAll(".ftco-animate");
  if ("IntersectionObserver" in w) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            io.unobserve(en.target);
            queue.push(en.target);
            if (!timer) timer = setTimeout(flush, 100);
          }
        });
      },
      { rootMargin: "0px 0px -5% 0px" },
    );
    [].forEach.call(items, function (el) {
      io.observe(el);
    });
  } else {
    [].forEach.call(items, function (el) {
      el.classList.add("ftco-animated");
    });
  }

  // Cuenta regresiva
  var box = d.getElementById("timer");
  var end = new Date(box.getAttribute("data-fecha")).getTime();
  var parts = [
    ["days", "Días", 86400],
    ["hours", "Horas", 3600],
    ["minutes", "Minutos", 60],
    ["seconds", "Segundos", 1],
  ];
  function tick() {
    var left = Math.max(0, Math.floor((end - Date.now()) / 1000));
    parts.forEach(function (p, i) {
      var v = i === 0 ? Math.floor(left / p[2]) : Math.floor((left % parts[i - 1][2]) / p[2]);
      d.getElementById(p[0]).innerHTML = (i && v < 10 ? "0" : "") + v + "<span>" + p[1] + "</span>";
    });
  }
  tick();
  setInterval(tick, 1000);

  // Ubicación: botones de Google Maps y Waze
  var ubic = d.getElementById("ubicacion-section");
  var lugar = d.getElementById("lugar-nombre").textContent.trim();
  var direccion = d.getElementById("lugar-direccion").textContent.trim();
  var lat = ubic.getAttribute("data-lat"),
    lng = ubic.getAttribute("data-lng");
  var destino = lat && lng ? lat + "," + lng : lugar + ", " + direccion;
  d.getElementById("btn-maps").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(destino);
  d.getElementById("btn-waze").href =
    lat && lng
      ? "https://waze.com/ul?ll=" + encodeURIComponent(destino) + "&navigate=yes"
      : "https://waze.com/ul?q=" + encodeURIComponent(destino) + "&navigate=yes";

  // Agregar al calendario
  var inicio = new Date(box.getAttribute("data-fecha"));
  var fin = new Date(box.getAttribute("data-fin") || inicio.getTime() + 8 * 3600e3);
  var titulo = "Boda de Diana & Pedro";
  var detalle = "¡Nos casamos! Te esperamos.";
  var lugarTexto = lugar + ", " + direccion;
  function utc(dt) {
    return dt
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  }
  d.getElementById("cal-google").href =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" +
    encodeURIComponent(titulo) +
    "&dates=" +
    utc(inicio) +
    "/" +
    utc(fin) +
    "&details=" +
    encodeURIComponent(detalle) +
    "&location=" +
    encodeURIComponent(lugarTexto);
  d.getElementById("cal-ics").addEventListener("click", function (e) {
    e.preventDefault();
    var esc = function (s) {
      return s.replace(/([,;\\])/g, "\\$1");
    };
    var ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Invitacion//ES",
      "BEGIN:VEVENT",
      "UID:boda-diana-pedro-" + utc(inicio) + "@invitacion",
      "DTSTAMP:" + utc(new Date()),
      "DTSTART:" + utc(inicio),
      "DTEND:" + utc(fin),
      "SUMMARY:" + esc(titulo),
      "DESCRIPTION:" + esc(detalle),
      "LOCATION:" + esc(lugarTexto),
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      "DESCRIPTION:" + esc(titulo),
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    var url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    var a = d.createElement("a");
    a.href = url;
    a.download = "boda-diana-pedro.ics";
    d.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  });

  // Video de fondo (solo pantallas grandes; en celulares queda la foto)
  var vid = hero.getAttribute("data-video");
  if (vid && w.matchMedia("(min-width: 992px) and (hover: hover)").matches) {
    var f = d.createElement("iframe");
    f.className = "video-bg";
    f.src =
      "https://www.youtube-nocookie.com/embed/" +
      vid +
      "?autoplay=1&mute=1&loop=1&playlist=" +
      vid +
      "&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0&disablekb=1";
    f.setAttribute("allow", "autoplay; encrypted-media");
    f.setAttribute("tabindex", "-1");
    f.setAttribute("aria-hidden", "true");
    hero.insertBefore(f, hero.firstChild);
  }
})();
