let x, y, circleColor, stage, time, randomParticle;
let particles = [];
let paddles = [];
let opacity = 255;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
  circleColor = color(255);
  stage = 1;
  randomParticle = ceil(random(0, 19));
  // create 20 "particles" using the for loop.
  for (let i = 0; i < 20; i++) {
    particles[i] = new Particle(10, 10, circleColor);
  }
  paddles[0] = new Paddle(height / 1.2, 100, 20);
}
function textRef(size, content, x, y) {
  textAlign(CENTER);
  textSize(size);
  fill(255, 255, 255);
  text(content, x, y);
  if (opacity === 0) {
    opacity += 50;
  }

  opacity -= 50;
}
function displayParticles(particleX, particleY, particleShape) {
  if (particleShape === 'circle') {
    // Inspired by a Stack Overflow answer on making a ring using shapes: https://stackoverflow.com/questions/55934842/making-a-ring-out-of-shapes-in-p5-js
    let curve = TWO_PI / particles.length; // Area of a circle in radians is 2 * pi.
    // Dividing it by the amount of particles gives us "slices" of the circle - like a regular pie
    for (let i = 0; i < particles.length - 1; i++) {
      x = particleX + cos(curve * i) * particles[i].w * 30; // Starting from the center, have the circle draw particles on each of the "slices" on the
      // x- axis multiplied by the width of the particles so they don't over lap and multiplied again by 50 so we can get a wide circle
      y = particleY - sin(curve * i) * particles[i].w * 30; // the y-axis is similar to the x-axis,
      // however we are using sin on the y - axis for it to have the arc of a circle appear.
      particles[i].color = color(200);
      particles[i].display();
      particles[i].animation();
    }
  } else if (particleShape === 'line') {
    for (let i = 0; i < particles.length; i++) {
      // print(randomParticle);
      particles[i].color = color(255);
      x = particleX + i * particles[i].w * 2;
      y = particleY - i * particles[i].w * 2;
      particles[i].animation();
      if (i === randomParticle) {
        particles[i].color = color(255, 0, 0);
        x = particleX + i * particles[i].w * 2;
        particles[i].blink = false;
        if (keyIsDown(32)) {
          particles[i].color = color(255);
          y = particleY - i * particles[i].w * 2;
          particles[i].animation();
        } else {
          y = particleY - i * particles[i].w * 2 - 10;
        }
      }
      particles[i].display();
    }
  } else if (particleShape === 'ball') {
    x = particles[0].position.x;
    y = particles[0].position.y;

    particles[0].display();
    particles[0].update();
  } else {
    x = particleX;
    y = particleY;

    particles[0].display();
    particles[0].animation();
  }
}
function ballCollision() {
  if (
    x > paddles[0].x &&
    x < paddles[0].x + paddles[0].w &&
    y > paddles[0].y - particles[0].h
  ) {
    textRef(32, 'So Close! ;)', width / 2, 50);
  }
}
function draw() {
  switch (stage) {
    case 1: // Initial particle
      background(100);
      textRef(32, 'Click to continue', width / 2, 50);
      displayParticles(width / 2, height / 2);
      break;
    case 2: // Have the particles form a circle with one missing :O
      background(100);
      displayParticles(width / 2, height / 2, 'circle');
      break;
    case 3: // Have the particles in a diagonal line, with one out of order.
      // When the spacebar is pressed, have the particles line up temporaily, but have the displaced one slide back.
      background(100);
      textRef(32, 'Press the spacebar to fix the line ;)', width / 2, 50);
      displayParticles(width / 3, height / 1.5, 'line');
      break;
    case 4:
      background(60);
      displayParticles(width / 2, height / 2, 'ball');
      break;
    case 5:
      background(60);
      displayParticles(width / 2, height / 2, 'ball');

      // paddles[0].collision();
      paddles[0].display();
      ballCollision();
      break;
    default:
      //Final piece
      background(100);
      textRef(32, 'Fin', width / 2, height / 2);
      break;
  }
}
function mousePressed() {
  stage++; // go to the next stage of the project
  if (stage > 6) {
    stage = 1;
  }
}
class Particle {
  constructor(w, h, color) {
    this.w = w;
    this.h = h;
    this.color = color;
    this.blink = false;
    // this.velocity = new createVector(4, 2);
    this.velocity = new createVector(8, 8);
    this.position = new createVector(width / 2, 100);
  }
  animation() {
    time = millis();
    // get the integer of "time" and find out if it's divisible by a number
    if (ceil(time) % 7) {
      this.blink = true;
    }
    if (ceil(time) % 2) {
      this.blink = false;
    }
  }
  update() {
    // Modified version of the NOC example
    // Add the current speed to the position.
    this.position.add(this.velocity);
    if (this.position.x > width - this.w || this.position.x < 0 + this.w) {
      this.color = color(255);
      this.velocity.x *= -1;
    }
    if (this.position.y > height - this.h || this.position.y < 0 + this.h) {
      this.color = color(255);
      this.velocity.y *= -1;
    }
    if (
      (this.position.x === 0 + this.w && this.position.y === 0 + this.h) ||
      (this.position.x === width - this.w && this.position.y === 0 + this.h) ||
      (this.position.x === 0 + this.w && this.position.y === height - this.h) ||
      (this.position.x === width - this.w &&
        this.position.y === height - this.h)
    ) {
      this.color = color(0, 255, 0);
    }
  }
  display() {
    if (this.blink === false) {
      noStroke();
      fill(this.color);
      ellipse(x, y, this.w, this.h);
    }
  }
}
class Paddle {
  constructor(y, w, h) {
    this.x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  display() {
    this.x = mouseX;
    noStroke();
    fill(0, 255, 0);
    rect(this.x, this.y, this.w, this.h);
  }
}
