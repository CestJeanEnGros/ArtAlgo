let img;

let margin = 400;
let lines = [];
let circles = [];
let monoSynth;
let newLines = [];  
let epsilon = 0.001;
let buffer = 5;
let zoomFactor = 0.85;
let angle = 0;
let vignetteLayer;

let speed = 60;
let numberOfEntities = 150;
let zoomSpeed = 1;
let angleSpeed = 0;

let cam;
let angleX = 0;
let angleY = 0;
let radius = 2000;
let autoRotate = false;

let envPool = [];
let oscPool = [];
let poolSize = 10;
let oscToPlay = 0;
let chromaticScale = [
  //261.63, // C4
  277.18, // C#4/Db4
  //293.66, // D4
  311.13, // D#4/Eb4
  //329.63, // E4
  //349.23, // F4
  369.99, // F#4/Gb4
  //392.00, // G4
  415.30, // G#4/Ab4
  //440.00, // A4
  466.16, // A#4/Bb4
  //493.88  // B4
];


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cam = createCamera();
  img = createGraphics(windowWidth, windowWidth);

  for (let i = 0; i < poolSize; i++) {
    let env = new p5.Envelope();
    let osc = new p5.Oscillator('triangle');
    osc.start(); 
    osc.freq(0); 
    osc.amp(env);
    envPool.push(env);
    oscPool.push(osc);
  }

  for (let i = 0; i < numberOfEntities; i++) {
    let x = random(img.width);
    let y = random(img.height);
    let l = random(60, 600);
    let o = Math.floor(random(0,4))*Math.PI/2;
    let line = new Line(x, y, l, o);
    let circle = new Circle(x, y, l/4);
    lines.push(line);
    circles.push(circle);   
  }
}

function draw() {
  background(0);


  if (autoRotate) {
    angleX = sin(frameCount * 0.01) * PI / 4; 
    angleY += 0.01; 
  } else {
   
    angleX = map(mouseY, 0, height, -PI / 2, PI / 2); 
    angleY = map(mouseX, 0, width, -PI, PI);
  }

  let camX = radius * cos(angleX) * sin(angleY);
  let camY = radius * sin(angleX);
  let camZ = radius * cos(angleX) * cos(angleY);

  cam.setPosition(camX, camY, camZ);

  cam.lookAt(0, 0, 0);

  // push();

  // translate(0,0,0);
  // fill(255);
  // box(100,100,100);
  // translate(0,0,0);

  // translate(windowWidth/3,0,0);
  // fill(255,0,0);
  // box(100,100,100);
  // translate(-windowWidth/3,0,0);

  // translate(0, windowHeight/3,0);
  // fill(0,255,0);
  // box(100,100,100);
  // translate(0, -windowHeight/3,0);

  // translate(0,0,windowWidth/3);
  // fill(0,0,255);
  // box(100,100,100);
  // translate(0,0,-windowWidth/3);

  // pop();

  let taille = 1000;
  let delta = 100;

  normalMaterial();
  push();
  
  update2D(img);
  texture(img);
  box(taille);
  
  pop();

}

function mousePressed() {
  autoRotate = true;
}

function mouseReleased() {
  autoRotate = false;
}

function mouseWheel(event) {
  radius += event.delta; 
  radius = constrain(radius, minRadius, maxRadius); 
}

function update2D(img){
  img.clear();
  img.background(0,0,0,0);
  img.frameRate(speed);

  img.fill(255);
  img.textSize(16);
  img.strokeWeight(1);

  img.push();
  
  img.translate(img.width / 2, img.height / 2); 

  img.scale(zoomFactor); 
  img.rotate(angle); 

  img.translate(-img.width / 2, -img.height / 2); 

  angle += radians(angleSpeed); 
  zoomFactor *= zoomSpeed;

  newLines = [];
  detectCollisions();

  for (let c of circles) {
    c.show(img);
  }

  for (let l of lines) {
    l.move();
    l.show(img);
  }

  img.pop();
  
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

    ark = new Arc(circle.x, circle.y, circle.r, theta1, theta2, rand, line, circle);

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

  show(img) {
    img.stroke(255, 255, 255);
    img.strokeWeight(1);
    img.line(this.x, this.y, this.x + Math.cos(this.o)*this.l, this.y + Math.sin(this.o)*this.l);
  }


  move() {
    this.y = this.y + 10*Math.sin(this.o);
    this.x = this.x + 10*Math.cos(this.o);

    

    if (this.x + Math.cos(this.o)*this.l > img.width + 10 && !this.sliced) {
      newLines.push(new Line(0 - Math.cos(this.o)*this.l, this.y, this.l, this.o));
      this.sliced = true;
    }

    if (this.x + Math.cos(this.o)*this.l < -10 && !this.sliced) {
      newLines.push(new Line(img.width - Math.cos(this.o)*this.l, this.y, this.l, this.o));
      this.sliced = true;
    }

    if (this.y + Math.sin(this.o)*this.l > img.height + 10 && !this.sliced) {
      newLines.push(new Line(this.x, 0 - Math.sin(this.o)*this.l, this.l, this.o));
      this.sliced = true;
    }

    if (this.y + Math.sin(this.o)*this.l < -10 && !this.sliced) {
      newLines.push(new Line(this.x, img.height - Math.sin(this.o)*this.l, this.l, this.o));
      this.sliced = true;
    }

    
    if (
      this.x < img.width + margin && 
      this.x > -margin && 
      this.y < img.height + margin && 
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

  show(img) {
    for (let a of this.arcs) {
      a.show(img);
    } 

    img.stroke(255, 255, 255);
    img.strokeWeight(1);
    img.noFill();
    img.circle(this.x, this.y, this.r);
  }
}

class Arc {
  constructor(x, y, r, theta1, theta2, rand, line, circle) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.theta1 = theta1;
    this.theta2 = theta2;
    this.rand= rand;
    this.line = line;
    this.played = false;
    this.circle = circle;
  }

  show(img) {
    // textSize(100);
    // text(this.theta2 - this.theta1, 1000, 100);
    if (this.rand > 4.8) {
      img.noStroke(255, 255, 255);
      img.fill(255, 0, 0);
      img.arc(this.x, this.y, this.r, this.r, this.theta1, this.theta2, CHORD);
      if (!this.played) {
        let d = this.theta2 - this.theta1;
        
        playNote(this.circle, this.theta1, this.theta2);

        this.played = true;
      }
    }
    else if (int(this.rand) == 0) {
      img.noStroke(255, 255, 255);
      img.fill(0 + 200/(1+this.rand));
      img.arc(this.x, this.y, this.r, this.r, this.theta1, this.theta2, CHORD);
    }
    else if (int(this.rand) == 1) {
      img.noStroke(255, 255, 255);
      img.fill(0 + 200/(1+this.rand));
      img.arc(this.x, this.y, this.r, this.r, this.theta1, this.theta2, CHORD);
    }
    else if (int(this.rand) == 2) {
      img.noStroke(255, 255, 255)
      img.fill(0 + 200/(1+this.rand));
      img.arc(this.x, this.y, this.r, this.r, this.theta2, this.theta1, CHORD);
    }
    else if (int(this.rand) == 3) {
      img.noStroke(255, 255, 255)
      img.fill(0 + 200/(1+this.rand));
      img.arc(this.x, this.y, this.r, this.r, this.theta2, this.theta1, CHORD);
    }
  }
}


function playNote(circle, theta1, theta2) {
  let vol = random(0.1, 0.3);
  let attackTime = 0.5;
  let decayTime = 0;
  let sustainLevel = vol
  let sustainTime = map(Math.abs(theta1 - theta2), 0, 2*Math.PI, 0, 1);
  let releaseTime = 1;

  let env = envPool.shift();
  let osc = oscPool.shift();

  if (env && osc) {
    env.setADSR(attackTime, decayTime, sustainLevel, releaseTime);
    env.setRange(vol, 0);

    osc.freq(chromaticScale[int(map(circle.r, 20, 200, chromaticScale.length, 0))]);
    env.triggerAttack(osc);

    let totalDuration = attackTime + decayTime + sustainTime + releaseTime;
    
    setTimeout(() => {
      env.triggerRelease(osc);
    }, (attackTime + decayTime + sustainTime) * 1000);
    
    setTimeout(() => {
      osc.freq(0); 

      envPool.push(env);  
      oscPool.push(osc);  
    }, totalDuration * 1000);  
  }
}