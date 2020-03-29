let x, y, circleColor, stage, time, randomParticle, buttonClicked, ball;
let randomLocation;
let particles = [];
let paddles = [];
let opacity = 255;
let timer = 30;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
  circleColor = color(255);
  buttonClicked = false;
  stage = 4;
  randomParticle = ceil(random(0, 19)); // chooses a random particle each time the program refreshes
  randomLocation = random(50, 100);
  // create 20 "particles" using the for loop.
  for (let i = 0; i < 20; i++) {
    particles[i] = new Particle(10, 10, circleColor);
  }
  ball = new Particle(10, 10, circleColor);
  // create the first paddle for "pong"
  paddles[0] = new Paddle(randomLocation, height / 1.2, 100, 20);
}

// Text function to make it easier to create text
function textRef(size, content, x, y) {
  textAlign(CENTER);
  textSize(size);
  fill(255, 255, 255);
  text(content, x, y);
}

//Function to display the kinds of particles in the project
function displayParticles(particleX, particleY, particleShape) {
  // Circular pattern
  if (particleShape === 'circle') {
    // Inspired by a Stack Overflow answer on making a ring using shapes: https://stackoverflow.com/questions/55934842/making-a-ring-out-of-shapes-in-p5-js
    let curve = TWO_PI / particles.length; // Area of a circle in radians is 2 * pi.
    // Dividing it by the amount of particles gives us "slices" of the circle - like a regular pie
    for (let i = 0; i < particles.length; i++) {
      if (i === particles.length - 1) {
        particles[i].color = color(255, 0, 0);
      } else {
        particles[i].color = color(200);
      }
      x = particleX + cos(curve * i) * particles[i].w * 30; // Starting from the center, have the circle draw particles on each of the "slices" on the
      // x- axis multiplied by the width of the particles so they don't over lap and multiplied again by 50 so we can get a wide circle
      y = particleY - sin(curve * i) * particles[i].w * 30; // the y-axis is similar to the x-axis,
      // however we are using sin on the y - axis for it to have the arc of a circle appear.
      particles[i].display();
      particles[i].animation();
    }
  } else if (particleShape === 'line') {
    // Diagonal pattern
    for (let i = 0; i < particles.length; i++) {
      // print(randomParticle);
      particles[i].color = color(255);
      // have the particles not overlap and spead out by 2
      x = particleX + i * particles[i].w * 2;
      y = particleY - i * particles[i].w * 2;
      particles[i].animation();
      if (i === randomParticle) {
        // if the particle matches the randomParticle variable, have it be out of place
        particles[i].color = color(255, 0, 0); // different color to differentiate it
        x = particleX + i * particles[i].w * 2;
        particles[i].blink = false; // haave this one not blinking to make it stand out
        if (keyIsDown(32)) {
          // If you *hold* down the space bar, it corrects the line.
          particles[i].color = color(255);
          y = particleY - i * particles[i].w * 2;
          particles[i].animation();
        } else {
          // the particle is shifted slightly upward which is quite annoying.
          y = particleY - i * particles[i].w * 2 - 15;
        }
      }
      particles[i].display();
    }
  } else if (particleShape === 'ball') {
    // Bouncing ball particle
    x = ball.position.x; // changing the x,y to the vector postitions allows the baall to move
    y = ball.position.y;

    ball.display();
    ball.update();
  } else {
    // the default look for the particle is a singular particle in the center.
    x = particleX;
    y = particleY;

    particles[0].display();
    particles[0].animation();
  }
}
function ballCollision(paddleNumber) {
  // If the ball enters within the the range of the paddles, a message briefly pops up
  if (
    x >= mouseX - paddles[paddleNumber].x &&
    x <= mouseX - paddles[paddleNumber].x + paddles[paddleNumber].w &&
    y >= paddles[paddleNumber].y &&
    y <= paddles[paddleNumber].y + particles[paddleNumber].h
  ) {
    textRef(32, 'So Close! ;)', width / 2, 100);
  }
}
// Button function
function button(x, y, w, h, content) {
  // if the mousse hovers within the range of the button, change color to indicate it's a button.
  if (mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h) {
    fill(200, 255, 255, 50);
  } else {
    fill(150, 200, 240, 50);
  }
  // if the button is pressed, make the button clicked variable true
  if (
    mouseIsPressed &&
    mouseX >= x &&
    mouseX <= x + w &&
    mouseY >= y &&
    mouseY <= y + h
  ) {
    textRef(32, 'Cant do that ;)', width / 2, 50);
    fill(100, 155, 155, 150);
    buttonClicked = true;
  }
  rect(x, y, w, h, 25);
  // center the text in the button
  textAlign(CENTER, CENTER);
  textRef(32, content, x + w / 2, y + h / 2);
}
function draw() {
  // print(randomLocation);
  if (frameCount % 60 == 0 && timer > 0 && stage !== 1) {
    // staage one is the only stage without a timer
    // if the frameCount is divisible by 60, then a second has passed.
    timer--;
  }
  if (timer == 0) {
    // if the timer reaches 0, go to the next stage.
    stage++;
    timer = 30; // reset the timer.
    if (stage > 6) {
      stage = 6; // keep the project at the last stage
    }
  }
  if (buttonClicked === true) {
    // if the button is clicked, DON'T go to the next stage.
    buttonClicked = false;
    timer = 30;
  }
  switch (stage) {
    case 1: // Initial particle
      background(100);
      textRef(32, 'Click to start', width / 2, 50);
      displayParticles(width / 2, height / 2);
      break;
    case 2: // Have the particles form a circle with one missing :O
      background(100);
      textRef(32, timer, width / 1.2, 100);
      displayParticles(width / 2, height / 2, 'circle');
      button(width / 1.25, 150, 150, 50, 'Skip >>');
      break;
    case 3: // Have the particles in a diagonal line, with one out of order.
      // When the spacebar is pressed, have the particles line up temporaily, but have the displaced one slide back.
      background(100);
      textRef(32, 'Press the spacebar to fix the line ;)', width / 2, 50);
      textRef(32, timer, width / 1.2, 50);
      displayParticles(width / 3, height / 1.5, 'line');
      button(width / 1.25, 100, 150, 50, 'Skip >>');
      break;
    case 4: // Have the particle never hit the top corner so the user watches forever >:)
      background(60);
      textRef(32, 'Watch until the ball hits the top corner ;)', width / 2, 50);
      textRef(32, timer, width / 1.2, 100);
      displayParticles(width / 2, height / 2, 'ball');
      button(width / 1.25, 150, 150, 50, 'Skip >>');
      break;
    case 5: // Have a paddle that doesn't change the tragetory of the ball, but rather taunts the user
      background(60);
      textRef(32, timer, width / 1.2, 50);
      textRef(32, 'Bounce the ball with the paddle!', width / 2, 50);
      displayParticles(width / 2, height / 2, 'ball');
      // have all the new paddles appear
      for (i = 0; i < paddles.length; i++) {
        paddles[i].display();
        ballCollision(i);
      }
      button(width / 1.25, 100, 150, 50, 'Skip >>');
      break;
    default:
      //Final piece
      background(100);
      textRef(32, 'Fin', width / 2, height / 2);
      break;
  }
}
function mousePressed() {
  if (stage === 1) {
    // if it's stage 1, got to the next stage
    stage++;
  }
  if (stage === 5) {
    // add a new paddle after every click.
    randomLocation = random(100, 300);
    paddles.push(
      new Paddle(randomLocation, height - random(20, 200), random(50, 150), 20)
    );
  }
}
class Particle {
  constructor(w, h, color) {
    this.w = w;
    this.h = h;
    this.color = color;
    this.blink = false;
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
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  display() {
    // this.x = mouseX;
    noStroke();
    fill(0, 255, 0);
    rect(mouseX - this.x, this.y, this.w, this.h);
  }
}
