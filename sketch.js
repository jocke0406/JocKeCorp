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

    // 🎯 Mouvement unique par œil
    this.freqX = random(2, 5);
    this.freqY = random(1.5, 4);
    this.phase = random(TWO_PI);
  }

  setup(w, h) {
    this.ampX = min(w, h) * random(0, 0.1); // anciennement entre 30–60 px
    this.ampY = min(w, h) * random(0, 0.1); // anciennement entre 15–35 px

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

    let nystagX = sin(t * this.freqX + this.phase) * this.ampX;
    let nystagY = cos(t * this.freqY + this.phase) * this.ampY;
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
