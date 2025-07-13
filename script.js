const malla = document.getElementById('malla');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const aprobadoSet = new Set(JSON.parse(localStorage.getItem('ramos_aprobados')) || []);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function dibujarLinea(elem1, elem2) {
  const rect1 = elem1.getBoundingClientRect();
  const rect2 = elem2.getBoundingClientRect();
  const x1 = rect1.left + rect1.width / 2;
  const y1 = rect1.top + rect1.height / 2 + window.scrollY;
  const x2 = rect2.left + rect2.width / 2;
  const y2 = rect2.top + rect2.height / 2 + window.scrollY;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = "#aaa";
  ctx.stroke();
}

function renderMalla() {
  malla.innerHTML = "";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const elementos = {};

  ramos.forEach((ramo) => {
    const div = document.createElement("div");
    div.className = "ramo";
    div.innerText = `${ramo.nombre}\n(${ramo.id})`;
    div.dataset.id = ramo.id;

    if (aprobadoSet.has(ramo.id)) {
      div.classList.add("aprobado");
    }

    div.onclick = () => {
      if (ramo.prereqs.every(pr => aprobadoSet.has(pr))) {
        if (aprobadoSet.has(ramo.id)) {
          aprobadoSet.delete(ramo.id);
          div.classList.remove("aprobado");
        } else {
          aprobadoSet.add(ramo.id);
          div.classList.add("aprobado");
        }
        localStorage.setItem("ramos_aprobados", JSON.stringify([...aprobadoSet]));
        renderMalla();
      } else {
        alert("❌ Aún no cumples los prerrequisitos.");
        div.classList.add("no-prereq");
        setTimeout(() => div.classList.remove("no-prereq"), 1500);
      }
    };

    malla.appendChild(div);
    elementos[ramo.id] = div;
  });

  // Dibujar líneas entre prerrequisitos
  ramos.forEach((ramo) => {
    ramo.prereqs.forEach(pr => {
      if (elementos[pr] && elementos[ramo.id]) {
        dibujarLinea(elementos[pr], elementos[ramo.id]);
      }
    });
  });
}

function resetear() {
  if (confirm("¿Seguro que quieres borrar tu progreso?")) {
    localStorage.removeItem("ramos_aprobados");
    aprobadoSet.clear();
    renderMalla();
  }
}

renderMalla();
