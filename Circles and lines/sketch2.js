let margin = 400;
let lines = [];
let circles = [];
let monoSynth;
let newLines = [];  
let epsilon = 0.001;
let buffer = 5;
let zoomFactor = 0.5;
let angle = 0;
let vignetteLayer;

let speed = 30;
let numberOfEntities = 300;
let zoomSpeed = 0.999;
let angleSpeed = 0.1;


let speedSlider, numberOfEntitiesSlider, zoomSpeedSlider, angleSpeedSlider;

function setup() {
  createCanvas(3*windowWidth, 3*windowWidth);
  
  speedSlider = createSlider(1, 60, speed); 
  speedSlider.position(20, 20); 

  zoomSpeedSlider = createSlider(0.99, 1.01, zoomSpeed, 0.001); 
  zoomSpeedSlider.position(20, 60);

  angleSpeedSlider = createSlider(0, 0.5, angleSpeed, 0.001); 
  angleSpeedSlider.position(20, 100);

  
  
  vignetteLayer = createGraphics(width * 3, width * 3); 
  drawVignetteLayer();

  translate(-margin, -margin);

  for (let i = 0; i < numberOfEntities; i++) {
    let x = random(width);
    let y = random(height);
    let l = random(50, 600);
    let o = Math.floor(random(0,4))*Math.PI/2;
    let line = new Line(x, y, l, o);
    let circle = new Circle(x, y, l/3);
    lines.push(line);
    circles.push(circle);
  }
}

function windowResized() {
  resizeCanvas(2 * windowWidth, 2 * windowWidth); 
}

function draw() {
  
  background(0);

  speed = speedSlider.value();
  zoomSpeed = zoomSpeedSlider.value();
  angleSpeed = angleSpeedSlider.value();

  frameRate(speed);

  fill(255);
  textSize(16);
  strokeWeight(1);
  text(`Speed: ${speed}`, 200, 35);
  text(`Zoom Speed: ${zoomSpeed.toFixed(3)}`, 200, 75);
  text(`Angle Speed: ${angleSpeed.toFixed(2)}`, 200, 115);

  strokeWeight(1);

  translate(windowWidth / 2, windowHeight / 2); 

  scale(zoomFactor); 
  rotate(angle); 

  translate(-width / 2, -height / 2); 

  angle += radians(angleSpeed); 
  zoomFactor *= zoomSpeed;

  newLines = [];
  detectCollisions();
  
  
  for (let c of circles) {
    c.show();
  }

  for (let l of lines) {
    l.move();
    l.show();
  }
  imageMode(CENTER);
  image(vignetteLayer, width / 2, height / 2);
}
function detectCollisions() {
  for (let l of lines) {
    for (let c of circles) {
      if (lineIntersectsCircle(l, c)) {
        randomColoring(l,c);
      }
    }
  }
}

function drawVignetteLayer() {

}

function lineIntersectsCircle(line, circle) {
  if (line.o == Math.PI/2 || line.o == Math.PI*3/2) {
    let y2 = line.y + Math.sin(line.o)*line.l;
    let r = circle.r/2;
    let a = (line.y - y2)**2;
    let b = 2*(line.y*y2 - y2**2 - circle.y*(line.y - y2));
    let c = circle.y**2 + (line.x-circle.x)**2 - r**2 - 2*circle.y*y2 + y2**2;
    
    let delta = b**2 - 4*a*c;
  
    if (delta >= 0) {
      let r1 = (-b - Math.sqrt(delta))/(2*a);
      let r2 = (-b + Math.sqrt(delta))/(2*a);

      let p = Math.min(1,r2) - Math.max(0,r1);
      if (p*line.l + epsilon >= 2*Math.sqrt(r**2 - (circle.x - line.x)**2)) {
        return true;
      }
    }
    else if (delta < 0 && a <= 0) {
      return true;
    }
    else {  
      return false;
    }
  }
  else {
    let x2 = line.x + Math.cos(line.o)*line.l;
    let r = circle.r/2;
    let a = (line.x - x2)**2;
    let b = 2*(line.x*x2 - x2**2 - circle.x*(line.x - x2));
    let c = circle.x**2 + (line.y-circle.y)**2 - r**2 - 2*circle.x*x2 + x2**2;

    let delta = b**2 - 4*a*c;
    
    if (delta >= 0) {
      let r1 = (-b - Math.sqrt(delta))/(2*a);
      let r2 = (-b + Math.sqrt(delta))/(2*a);
      
      let p = Math.min(1,r2) - Math.max(0,r1);
      if (p*line.l + epsilon >= 2*Math.sqrt(r**2 - (circle.y - line.y)**2)) {
        return true;
      }
    }
    else if (delta < 0 && a <= 0) {
      return true;
    }
    else {  
      return false;
    }
  }
}

function randomColoring(line, circle) {
  if (line.o == 0 || line.o == Math.PI) {
    let theta1 = Math.asin((circle.y - line.y)/(circle.r/2)) + Math.PI;
    let theta2 = Math.acos((circle.y - line.y)/(circle.r/2)) - Math.PI/2;
    let rand = int(random(4));

    ark = new Arc(circle.x, circle.y, circle.r, theta1, theta2, rand, line);
    
    let toAdd = true;
    for(a of circle.arcs) {
      if (a.line == ark.line) {
        toAdd = false;
      }
    }
    
    
    if (toAdd) {
      if(circle.arcs.length >= buffer) {
        circle.arcs.shift();
        circle.arcs.push(ark);  
      }
      else {
        circle.arcs.push(ark);  
      }
    }
  }
  else {
    let theta1 = Math.asin((circle.x - line.x)/(circle.r/2)) + Math.PI/2;
    let theta2 = Math.acos((circle.x - line.x)/(circle.r/2)) - Math.PI; 
    let rand = random(5);

    ark = new Arc(circle.x, circle.y, circle.r, theta1, theta2, rand, line);

    let toAdd = true;
    
    for(a of circle.arcs) {
      if (a.line == ark.line) {
        toAdd = false;
      }
    }
    
    if (toAdd) {
      if(circle.arcs.length >= buffer) {
        circle.arcs.shift()
        circle.arcs.push(ark);  
      }
    
      else {
        circle.arcs.push(ark);  
      }
    }
  }
}



class Line {
  constructor(x, y, l, o) {
    this.x = x;
    this.y = y;
    this.l = l;
    this.o = o;
    this.sliced = false;
  }

  show() {
    stroke(255, 255, 255);
    strokeWeight(1);
    line(this.x, this.y, this.x + Math.cos(this.o)*this.l, this.y + Math.sin(this.o)*this.l);
  }


  move() {
    this.y = this.y + 10*Math.sin(this.o);
    this.x = this.x + 10*Math.cos(this.o);

    

    if (this.x + Math.cos(this.o)*this.l > width + 10 && !this.sliced) {
      newLines.push(new Line(0 - Math.cos(this.o)*this.l, this.y, this.l, this.o));
      this.sliced = true;
    }

    if (this.x + Math.cos(this.o)*this.l < -10 && !this.sliced) {
      newLines.push(new Line(width - Math.cos(this.o)*this.l, this.y, this.l, this.o));
      this.sliced = true;
    }

    if (this.y + Math.sin(this.o)*this.l > height + 10 && !this.sliced) {
      newLines.push(new Line(this.x, 0 - Math.sin(this.o)*this.l, this.l, this.o));
      this.sliced = true;
    }

    if (this.y + Math.sin(this.o)*this.l < -10 && !this.sliced) {
      newLines.push(new Line(this.x, height - Math.sin(this.o)*this.l, this.l, this.o));
      this.sliced = true;
    }

    
    if (
      this.x < width + margin && 
      this.x > -margin && 
      this.y < height + margin && 
      this.y > -margin
    ) {
      newLines.push(this); 
    }

    lines = newLines;
  }
}



class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.linesIntersect = [];
    this.arcs = [];
  }

  show() {
    for (let a of this.arcs) {
      a.show();
    } 

    stroke(255, 255, 255);
    strokeWeight(1);
    noFill();
    circle(this.x, this.y, this.r);
  }
}

class Arc {
  constructor(x, y, r, theta1, theta2, rand, line) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.theta1 = theta1;
    this.theta2 = theta2;
    this.rand= rand;
    this.line = line;
  }

  show() {
  }
}