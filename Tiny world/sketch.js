const tiles = [];
const tileImages = [];

let grid = [];

const DIM = 16;

const BLANK = 0;
const UP = 1;
const RIGHT = 2;
const DOWN = 3;
const LEFT = 4;

const WEIGHT = [
  50,
  1,
  2,
  1,
  1,
  1,
  1
]



let axiom = "X";  
let rules = [
  { 
    a: "X",
    b: "[X]F+[[X]-FX][XX]-F[-FX]+X[X][+FX]"
  },
  {
    a: "F",
    b: "FF"
  }
];
let sentence = axiom;
let nbTree = 1;
let trees = [];
let len = 150;
let angle = Math.PI/5;  
let depth = 2;
let thickness = 60;

let cam;

let stoneTexture;
let woodTexture;
let waterTexture;
let wellSize = 1.1;
let wellPos = [];

let clouds = [];
let rain = false;

let block_d = 3000
let step = block_d/DIM;

let k
let l 
let n
let m



function preload() {
  const path = "tiles";
  tileImages[0] = loadImage(`${path}/Grass_1.png`);
  tileImages[1] = loadImage(`${path}/Grass_2.png`);
  tileImages[2] = loadImage(`${path}/Grass_3.png`);
  tileImages[3] = loadImage(`${path}/Grass_4.png`);
  tileImages[4] = loadImage(`${path}/Grass_5.png`);
  tileImages[5] = loadImage(`${path}/Grass_6.png`);
  tileImages[6] = loadImage(`${path}/Grass_7.png`);
  tileImages[7] = loadImage(`${path}/Angle_Int_A.png`);
  tileImages[8] = loadImage(`${path}/Angle_Ext_A.png`);
  tileImages[9] = loadImage(`${path}/Line_A.png`);
  tileImages[10] = loadImage(`${path}/Line_B.png`);
  tileImages[11] = loadImage(`${path}/Angle_Int_B.png`);
  tileImages[12] = loadImage(`${path}/Angle_Ext_B.png`);
  tileImages[13] = loadImage(`${path}/Angle_Int_C.png`);
  tileImages[14] = loadImage(`${path}/Angle_Int_D.png`);
  tileImages[15] = loadImage(`${path}/Imp_A.png`);
  tileImages[16] = loadImage(`${path}/Imp_B.png`);
  tileImages[17] = loadImage(`${path}/Imp_C.png`);
  tileImages[18] = loadImage(`${path}/Imp_D.png`);
  for (let i = 0; i < 13; i++) {
    tileImages[76 + i] = loadImage(`${path}/Water_${i}.png`);
  }
  cobbleTexture = loadImage("textures/cobble.png"); 
  woodTexture = loadImage("textures/wood.png");
  waterTexture = loadImage("textures/water.jpg");
  plankTexture = loadImage("textures/plank.png");
  leafTexture = loadImage("textures/leaf.png"); 
  dirtTexture = loadImage("textures/dirt.png"); 
}


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  let fov = Math.PI/4; 
  let aspect = width / height; 
  let near = 10; 
  let far = 10000; 
  perspective(fov, aspect, near, far);

  
  if (random(0,1) < 0.9) {
    rain = true
  }
  for (let i = 0; i < random(1,2); i++) {
    
    clouds.push(createCloud(random(-block_d/1.9 , block_d/1.9 ), random(-2500, -2000), random(-block_d/1.9 , block_d/1.9 ), rain));
  }

  

  prepareTiles();
  generatePath();

  console.log(k,l)
  for(let i = 0; i < nbTree; i++) {
    generateTree(k,l);
  }

  

  
  console.log(n,m);
  wellPos = [-block_d/2 + (n+1)*step, -75, -block_d/2 + (m+1)*step];
  console.log(wellPos);

  

  cam = createCamera();
  cam.setPosition(3500, -3500, 3500); 
  cam.lookAt(-block_d/2, 0, -block_d/2); 
}




function draw() {
  //noLoop();
  background(119,181,254);
  ambientLight(75,75,75);
  if (rain){lightFalloff(0, 0.00015, 0);}
  else{lightFalloff(0, 0.00007, 0);}
  
  pointLight(255, 255, 100, -2*block_d, -3000, -2*block_d); 
  ambientLight(50, 50, 50);
 
  orbitControl();
  translate(-block_d/2,0,-block_d/2);

  noStroke();
  push();
  translate(100,0,0);
  fill(255,0,0);
  sphere(10,5,5);
  pop();
  push();
  translate(0,100,0);
  fill(0,255,0);
  sphere(10,5,5);
  pop();
  push();
  translate(0,0,100);
  fill(0,0,255);
  sphere(10,5,5);
  pop();

  for (let cloud of clouds) {
    drawCloud(cloud);
  }


  push();
  scale(wellSize);
  translate(wellPos[0], wellPos[1], wellPos[2]);
  noStroke();
  drawWell();
  drawArch();
  pop();


  for (let tree of trees) {
    drawTree(tree);
  }
 

  img = printPath();
  
  



  let w = 400;  
  let h = 50;   
  let d = 400;  

  
  
  strokeWeight(1);
  specularMaterial(255,255,255);
  shininess(100000)
  texture(img);
  push();
  translate(0,1,0);
  box(block_d,1,block_d);
  pop();

  // push();
  // translate(0,block_d,0);
  // specularMaterial(255,255,255);
  // texture(dirtTexture);
  // box(block_d,1,block_d);
  // pop();

  push();
  translate(block_d/2,block_d/2,0);
  rotateZ(Math.PI/2);
  rotateX(Math.PI);
  specularMaterial(255,255,255);
  texture(dirtTexture);
  box(block_d,1,block_d);
  pop();

  push();
  translate(-block_d/2,block_d/2,0);
  rotateY(3*Math.PI/2);
  rotateX(-Math.PI/2)
  specularMaterial(255,255,255);
  texture(dirtTexture);
  box(block_d,1,block_d);
  pop();

  push();
  translate(0,block_d/2,block_d/2);
  rotateX(-Math.PI/2)
  specularMaterial(255,255,255);
  texture(dirtTexture);
  box(block_d,1,block_d);
  pop();

  push();
  translate(0,block_d/2,-block_d/2);
  rotateY(-Math.PI/2)
  rotateZ(Math.PI/2)
  specularMaterial(255,255,255);
  texture(dirtTexture);
  box(block_d,1,block_d);
  pop();

  // push();
  // texture(img);
  // beginShape();
  // vertex(-w / 2, 0, -d / 2, 0, 0);
  // vertex( w / 2, 0, -d / 2, 0, 1);
  // vertex( w / 2, 0,  d / 2, 1, 1);
  // vertex(-w / 2, 0,  d / 2, 1, 0);
  // endShape(CLOSE);
  // pop();

  // fill(150);
  // beginShape(); // Face avant
  // vertex(-w / 2, -h / 2, d / 2);
  // vertex( w / 2, -h / 2, d / 2);
  // vertex( w / 2,  h / 2, d / 2);
  // vertex(-w / 2,  h / 2, d / 2);
  // endShape(CLOSE);

  // beginShape(); // Face arrière
  // vertex(-w / 2, -h / 2, -d / 2);
  // vertex( w / 2, -h / 2, -d / 2);
  // vertex( w / 2,  h / 2, -d / 2);
  // vertex(-w / 2,  h / 2, -d / 2);
  // endShape(CLOSE);

  // beginShape(); // Face gauche
  // vertex(-w / 2, -h / 2, -d / 2);
  // vertex(-w / 2, -h / 2,  d / 2);
  // vertex(-w / 2,  h / 2,  d / 2);
  // vertex(-w / 2,  h / 2, -d / 2);
  // endShape(CLOSE);

  // beginShape(); // Face droite
  // vertex(w / 2, -h / 2, -d / 2);
  // vertex(w / 2, -h / 2,  d / 2);
  // vertex(w / 2,  h / 2,  d / 2);
  // vertex(w / 2,  h / 2, -d / 2);
  // endShape(CLOSE);
}






























