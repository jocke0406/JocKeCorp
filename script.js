const messages = [
  "« Certifié apte à ne rien entreprendre. » — Nicolas II, 15 mars 1917",
  "« Permis d’admirer — catégorie A. » — Charles Baudelaire, 9 avril 1851",
  "« La reconnaissance extérieure commence par la reconnaissance de la certification intérieure. » — Jean-Claude Van Damme, 18 octobre 1960 — autocertifié",
  "« Mon existence est un concept flou mais administrativement cohérent. » — Banksy, 5 octobre 2018",
  "« Je suis né d’un formulaire égaré. » — Fille n°34 de Jonathan Jacob Meijer, 28 avril 2023",
  "« J’ai rempli un dossier. Le néant m’a répondu. » — Friedrich Nietzsche, 3 janvier 1889",
  "« Ma culpabilité est en reconversion professionnelle. » — Oskar Schindler, 13 mars 1943",
  "« Mon immobilisme est un engagement. » — Ségolène Royal, 24 janvier 2020",
  "« Je n’ai rien empêché, mais je l’ai fait avec intégrité. » — Ponce Pilate, 3 avril 33",
  "« J’ai suivi une formation sur l’interruption des formations d’interruption. » — user_#12, 21 juillet 2025",
  "« Grâce à ce module, je maîtrise enfin l’art de douter sans réfléchir. » — Dieudonné M’bala M’bala, 26 décembre 2003",
  "« J’ai obtenu une attestation de présence à mon absence. » — Le Soleil, 11 août 1999",
];

const container = document.getElementById("message-container");
const secret = document.getElementById("secret-message");
const help = document.querySelector(".help-bubble");
const helpText = document.querySelector(".help-text");
const chrono = document.getElementById("chrono");

// Show messages aléatoires
function showRandomMessage() {
  const text = messages[Math.floor(Math.random() * messages.length)];
  const div = document.createElement("div");
  div.className = "message";
  div.innerText = text;
  const top = 30 + Math.random() * 40;
  const left = 20 + Math.random() * 60;
  div.style.top = `${top}%`;
  div.style.left = `${left}%`;
  container.appendChild(div);
  requestAnimationFrame(() => (div.style.opacity = 1));
  const dx = Math.floor(Math.random() * 200 - 100);
  const dy = Math.floor(Math.random() * 200 - 100);
  div.animate(
    [
      { transform: "translate(0px, 0px)" },
      {
        transform: `translate(${dx}px, ${dy}px) rotate(${
          Math.random() * 6 - 3
        }deg)`,
      },
    ],
    {
      duration: 7000,
      easing: "ease-in-out",
      fill: "forwards",
    }
  );
  setTimeout(() => {
    div.style.opacity = 0;
    setTimeout(() => container.removeChild(div), 1000);
  }, 6500);
}

// Chrono
let seconds = 0;
setInterval(() => {
  seconds++;
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  chrono.textContent = `${h}:${m}:${s}`;
}, 1000);

// Affichage message secret
document.addEventListener("keydown", (e) => {
  if (["Enter", "Escape"].includes(e.key)) {
    secret.classList.remove("hidden");
    setTimeout(() => secret.classList.add("hidden"), 5000);
  }
});
document.addEventListener("click", () => {
  secret.classList.remove("hidden");
  setTimeout(() => secret.classList.add("hidden"), 5000);
});

// Help tooltip
help.addEventListener("mouseenter", () => {
  helpText.classList.remove("hidden");
});
help.addEventListener("mouseleave", () => {
  helpText.classList.add("hidden");
});

showRandomMessage();
setInterval(showRandomMessage, 7000);
