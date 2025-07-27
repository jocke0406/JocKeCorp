let eyeW, eyeH;
let ouverture = 1.2;
let irisDiameter, pupilDiameter;
let upperArcH, lowerArcH, innerH;
let phi = 1.618;
let decoElements = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  eyeH = height * 0.7;
  eyeW = eyeH * phi;

  innerH = eyeH * ouverture;
  upperArcH = innerH * (1 / (1 + 1 / phi));
  lowerArcH = innerH - upperArcH;

  irisDiameter = innerH * 0.6;
  pupilDiameter = irisDiameter * 0.4;

  // 🎨 Carrés façon Bauhaus – taille responsive
  let blockColors = ["#e63946", "#f1c40f", "#14213d"];
  let minSize = min(width, height) * 0.08; // ~8% de la plus petite dimension
  let maxSize = min(width, height) * 0.15; // ~15%
  for (let i = 0; i < 10; i++) {
    decoElements.push({
      type: "rect",
      x: random(width),
      y: random(height),
      size: random(minSize, maxSize),
      col: random(blockColors),
    });
  }

  // 🔵 Arc décoratif responsive
  let arcSize = min(width, height) * 0.4;
  decoElements.push({
    type: "arc",
    x: width * 0.15,
    y: height * 0.15,
    size: arcSize,
    col: "#fefae0",
  });

  // 🟥 Barre horizontale responsive
  let barWidth = width * 0.15;
  let barHeight = height * 0.025;
  decoElements.push({
    type: "bar",
    x: width * 0.75,
    y: height * 0.9,
    w: barWidth,
    h: barHeight,
    col: "#e63946",
  });

  frameRate(60);
}

function draw() {
  background("#0f0f1f");

  // 🟦 Éléments décoratifs fixes (carrés + formes)
  for (let d of decoElements) {
    if (d.type === "rect") {
      fill(d.col + "88");
      noStroke();
      rect(d.x, d.y, d.size, d.size);
    } else if (d.type === "arc") {
      fill(d.col + "88");
      noStroke();
      arc(d.x, d.y, d.size, d.size, PI, 0, CHORD);
    } else if (d.type === "bar") {
      fill(d.col + "aa");
      noStroke();
      rect(d.x, d.y, d.w, d.h);
    }
  }

  translate(width / 2, height / 2);

  // 🌌 HALO lumineux
  noFill();
  for (let i = 0; i < 60; i++) {
    let alpha = map(i, 0, 60, 25, 0);
    stroke(127, 0, 255, alpha);
    strokeWeight(30);
    ellipse(0, 0, eyeW + i * 8, eyeH + i * 8);
  }

  // 🧠 Mouvement Nystagmus
  let t = millis() / 1000;
  let nystagX = sin(t * 5) * 80;
  let nystagY = cos(t * 4.5) * 50;

  // ⚪ Zone centrale (CD)
  noStroke();
  fill("#ffeffe");
  beginShape();
  for (let a = PI; a >= 0; a -= 0.05)
    vertex((eyeW / 2) * cos(a), -(upperArcH / 2) * sin(a));
  for (let a = 0; a <= PI; a += 0.05)
    vertex((eyeW / 2) * cos(a), (lowerArcH / 2) * sin(a));
  endShape(CLOSE);

  // 🟢 IRIS
  fill("#7f00ff");
  ellipse(nystagX, nystagY, irisDiameter, irisDiameter);

  // ⚫ PUPILLE
  fill("#050505");
  ellipse(nystagX, nystagY, pupilDiameter, pupilDiameter);

  // 🔴 Zone supérieure (AC)
  fill("#ff005c");
  beginShape();
  for (let a = PI; a >= 0; a -= 0.05)
    vertex((eyeW / 2) * cos(a), -(eyeH / 2) * sin(a));
  for (let a = 0; a <= PI; a += 0.05)
    vertex((eyeW / 2) * cos(a), -(upperArcH / 2) * sin(a));
  endShape(CLOSE);

  // 🟡 Zone inférieure (BD)
  fill("#ffe600");
  beginShape();
  for (let a = 0; a <= PI; a += 0.05)
    vertex((eyeW / 2) * cos(a), (eyeH / 2) * sin(a));
  for (let a = PI; a >= 0; a -= 0.05)
    vertex((eyeW / 2) * cos(a), (lowerArcH / 2) * sin(a));
  endShape(CLOSE);
}
