let cols, rows;
let cellW, cellH;
let cells = []; // Chaque cellule contient un RetroEye

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  generateGrid();
  setInterval(generateGrid, 3000);
}

function draw() {
  let t = millis() / 1000;
  let glitch = frameCount % 240 < 2 && random() < 0.5;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * cellW;
      let y = j * cellH;

      push();
      translate(x, y);
      drawingContext.save();
      drawingContext.beginPath();
      drawingContext.rect(0, 0, cellW, cellH);
      drawingContext.clip();

      cells[i][j].eye.draw(t, glitch);

      drawingContext.restore();
      pop();
    }
  }
}

function generateGrid() {
  cols = floor(random(1, 5));
  rows = floor(random(1, 5));
  cellW = width / cols;
  cellH = height / rows;
  console.log(`Nouvelle grille : ${cols} x ${rows}`);

  cells = Array.from({ length: cols }, () =>
    Array.from({ length: rows }, () => null)
  );

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const palette = random(palettes);
      const eye = new RetroEye(palette);
      eye.setup(cellW, cellH);

      cells[i][j] = {
        eye,
      };
    }
  }
}

// Re-génère la grille à chaque pression sur Espace
function keyPressed() {
  if (key === " ") generateGrid();
}

class RetroEye {
  constructor(palette) {
    this.palette = palette || random(palettes);
    this.phi = 1.618;
    this.ouverture = 1.2;
    this.decoElements = [];
  }

  setup(w, h) {
    this.width = w;
    this.height = h;

    this.eyeH = h * 0.7;
    this.eyeW = this.eyeH * this.phi;

    this.innerH = this.eyeH * this.ouverture;
    this.upperArcH = this.innerH * (1 / (1 + 1 / this.phi));
    this.lowerArcH = this.innerH - this.upperArcH;

    this.irisDiameter = this.innerH * 0.6;
    this.pupilDiameter = this.irisDiameter * 0.4;

    this.decoElements = [];
    let minSize = min(w, h) * 0.08;
    let maxSize = min(w, h) * 0.15;
    for (let i = 0; i < 10; i++) {
      this.decoElements.push({
        type: "rect",
        x: random(w),
        y: random(h),
        size: random(minSize, maxSize),
        col: random(this.palette.blockColors),
      });
    }

    let arcSize = min(w, h) * 0.4;
    this.decoElements.push({
      type: "arc",
      x: w * 0.15,
      y: h * 0.15,
      size: arcSize,
      col: this.palette.arcDeco,
    });

    this.decoElements.push({
      type: "bar",
      x: w * 0.75,
      y: h * 0.9,
      w: w * 0.15,
      h: h * 0.025,
      col: this.palette.barDeco,
    });
  }

  draw(t, glitch = false) {
    background(this.palette.background);

    stroke(this.palette.grid);
    strokeWeight(0.5);
    let spacing = 36;
    for (let x = 0; x < this.width; x += spacing) line(x, 0, x, this.height);
    for (let y = 0; y < this.height; y += spacing) line(0, y, this.width, y);

    for (let d of this.decoElements) {
      fill(d.col + "88");
      noStroke();
      if (d.type === "rect") {
        rect(d.x, d.y, d.size, d.size);
      } else if (d.type === "arc") {
        arc(d.x, d.y, d.size, d.size, PI, 0, CHORD);
      } else if (d.type === "bar") {
        fill(d.col + "aa");
        rect(d.x, d.y, d.w, d.h);
      }
    }

    push();
    translate(this.width / 2, this.height / 2);

    noFill();
    for (let i = 0; i < 60; i++) {
      let alpha = map(i, 0, 60, this.palette.halo.alphaStart, 0);
      stroke(...this.palette.halo.color, alpha);
      strokeWeight(30);
      ellipse(0, 0, this.eyeW + i * 8, this.eyeH + i * 8);
    }

    let nystagX = sin(t * 3.5) * 50;
    let nystagY = cos(t * 3) * 20;
    if (glitch) {
      nystagX += random([-80, 80]);
      nystagY += random([-30, 30]);
    }

    noStroke();
    fill(this.palette.cdZone);
    beginShape();
    for (let a = PI; a >= 0; a -= 0.05)
      vertex((this.eyeW / 2) * cos(a), -(this.upperArcH / 2) * sin(a));
    for (let a = 0; a <= PI; a += 0.05)
      vertex((this.eyeW / 2) * cos(a), (this.lowerArcH / 2) * sin(a));
    endShape(CLOSE);

    fill(this.palette.iris);
    ellipse(nystagX, nystagY, this.irisDiameter, this.irisDiameter);

    fill(this.palette.pupil);
    ellipse(nystagX, nystagY, this.pupilDiameter, this.pupilDiameter);

    fill(this.palette.upperLid);
    beginShape();
    for (let a = PI; a >= 0; a -= 0.05)
      vertex((this.eyeW / 2) * cos(a), -(this.eyeH / 2) * sin(a));
    for (let a = 0; a <= PI; a += 0.05)
      vertex((this.eyeW / 2) * cos(a), -(this.upperArcH / 2) * sin(a));
    endShape(CLOSE);

    fill(this.palette.lowerLid);
    beginShape();
    for (let a = 0; a <= PI; a += 0.05)
      vertex((this.eyeW / 2) * cos(a), (this.eyeH / 2) * sin(a));
    for (let a = PI; a >= 0; a -= 0.05)
      vertex((this.eyeW / 2) * cos(a), (this.lowerArcH / 2) * sin(a));
    endShape(CLOSE);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateGrid(); // Recalculer la grille proprement
}

// === Palettes ===

let palettes = [
  {
    name: "mauve",
    background: "#14001a",
    grid: "#d900ff",
    halo: { color: [217, 0, 255], alphaStart: 40 },
    cdZone: "#26092f",
    iris: "#d900ff",
    pupil: "#0a0010",
    upperLid: "#6a1b9a",
    lowerLid: "#ba68c8",
    blockColors: ["#26092f", "#d900ff", "#6a1b9a"],
    arcDeco: "#e1b7f2",
    barDeco: "#d900ff",
  },
  {
    name: "bleu",
    background: "#001d2e",
    grid: "#4ffff0",
    halo: { color: [0, 255, 255], alphaStart: 30 },
    cdZone: "#002b36",
    iris: "#00f7ff",
    pupil: "#001015",
    upperLid: "#004e89",
    lowerLid: "#7fd3f7",
    blockColors: ["#001f2f", "#00f7ff", "#004e89"],
    arcDeco: "#b3ecff",
    barDeco: "#00f7ff",
  },
  {
    name: "rouge",
    background: "#2d0005",
    grid: "#ff4d4d",
    halo: { color: [255, 80, 80], alphaStart: 40 },
    cdZone: "#400000",
    iris: "#ff0033",
    pupil: "#0a0000",
    upperLid: "#8b0000",
    lowerLid: "#ff6b6b",
    blockColors: ["#400000", "#ff0033", "#8b0000"],
    arcDeco: "#ffcccc",
    barDeco: "#ff0033",
  },
  {
    name: "jaune",
    background: "#2e2a00",
    grid: "#ffee00",
    halo: { color: [255, 255, 0], alphaStart: 30 },
    cdZone: "#3f3b00",
    iris: "#f7e000",
    pupil: "#1c1b00",
    upperLid: "#a08f00",
    lowerLid: "#fff700",
    blockColors: ["#3f3b00", "#f7e000", "#a08f00"],
    arcDeco: "#fffac0",
    barDeco: "#f7e000",
  },
  {
    name: "orange",
    background: "#2b1500",
    grid: "#ffb347",
    halo: { color: [255, 165, 0], alphaStart: 35 },
    cdZone: "#4a2300",
    iris: "#ff7300",
    pupil: "#1c0d00",
    upperLid: "#c45a00",
    lowerLid: "#ffae42",
    blockColors: ["#4a2300", "#ff7300", "#c45a00"],
    arcDeco: "#ffd9b3",
    barDeco: "#ff7300",
  },
  {
    name: "vert toxique",
    background: "#001a00",
    grid: "#aaff00",
    halo: { color: [170, 255, 0], alphaStart: 35 },
    cdZone: "#003300",
    iris: "#aaff00",
    pupil: "#001000",
    upperLid: "#337f00",
    lowerLid: "#bfff66",
    blockColors: ["#003300", "#aaff00", "#337f00"],
    arcDeco: "#e6ffcc",
    barDeco: "#aaff00",
  },
];
