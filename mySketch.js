let x, y, circleColor, stage, time;
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
  circleColor = color(255);
  stage = 1;
  // create 20 "particles" using the for loop.
  for (let i = 0; i < 20; i++) {
    particles[i] = new Particle(5, 5, circleColor);
  }
}

function draw() {
  switch (stage) {
    case 1: // Initial particle
      background(100);
      x = width / 2; // have the particle show in the middle
      y = height / 2;
      //drawing one particle to start the project
      particles[0].display();
      particles[0].update();
      break;
    case 2: // Have the particles form a circle with one missing :O
      background(100);
      // Inspired by a Stack Overflow answer on making a ring using shapes: https://stackoverflow.com/questions/55934842/making-a-ring-out-of-shapes-in-p5-js
      let curve = (Math.PI * 2) / particles.length; // Area of a circle in radianss is 2 * pi. Dividing it by the amount of particles gives us "slices" of the circle - like a regular pie
      for (let i = 0; i < particles.length - 1; i++) {
        x = width / 2 + cos(curve * i) * particles[i].w * 50; // Starting from the center, have the circle draw particles on each of the "slices" on the
        // x- axis multiplied by the width of the particles times 50 so we can get a wide circle
        y = height / 2 - sin(curve * i) * particles[i].w * 50; // the y-axis is similar to the x-axis,
        // however we are using sin here for it to have the arc of a circle appear.
        particles[i].display();
        particles[i].update();
      }
      break;
    default:
      break;
  }
}
function mousePressed() {
  stage++; // go to the next stage of the project
}
class Particle {
  constructor(w, h, color) {
    this.w = w;
    this.h = h;
    this.color = color;
    this.blink = false;
  }
  update() {
    time = millis();
    // get the integer of "time" and find out if it's divisible by a number
    if (ceil(time) % 7) {
      this.blink = true;
    }
    if (ceil(time) % 2) {
      this.blink = false;
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
