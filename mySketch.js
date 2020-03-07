let x, y, circleColor;
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
  circleColor = color(255, 0, 0);
  for (let i = 0; i < 20; i++) {
    particles[i] = new Particle(5, 5, circleColor);
  }
}

function draw() {
  // when the function completes it's animation go to the next one
  for (let i = 0; i < particles.length; i++) {
    x = width / i;
    y = height / i;
    particles[i].display(random(0, 5));
  }
}

class Particle {
  constructor(w, h, color) {
    this.w = w;
    this.h = h;
    this.color = color;
  }
  update(speed) {
    this.speedX += speed;
    this.speedY += speed;
  }
  display() {
    noStroke();
    fill(this.color);
    ellipse(x, y, this.w, this.h);
  }
}
