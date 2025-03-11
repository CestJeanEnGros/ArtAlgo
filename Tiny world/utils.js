function rotateAround(vect, axis, angle) {
    axis = p5.Vector.normalize(axis);
    
    return p5.Vector.add(
      p5.Vector.mult(vect, cos(angle)),
      p5.Vector.add(
        p5.Vector.mult(
          p5.Vector.cross(axis, vect),
          sin(angle)
        ),
        p5.Vector.mult(
          p5.Vector.mult(
            axis,
            p5.Vector.dot(axis, vect)
          ),
          (1 - cos(angle))
        )
      )
    );
  }



  function applyRules(s) {
    let nextSentence = "";
    for (let i = 0; i < s.length; i++) {
      
      let current = s.charAt(i);
      
      let found = false;
      for (let j = 0; j < rules.length; j++) {
        if (current == rules[j].a) {
          nextSentence += rules[j].b;
          found = true;
          break;
        }
      }
      if (!found) {
        nextSentence += current;
      }
    }
    return nextSentence;
  }
  
  

  function drawTree(tree) {
    push();
    translate(-block_d/2,0,-block_d/2);
    for (let i = 0; i < tree.length; i++){
      
      let branch = tree[i];
      let begin = branch.begin;
      let end = p5.Vector.add(branch.begin, branch.vect);

      // let u_X = createVector(1,0);
      // let v_X = createVector(branch.vect.z, branch.vect.x);
      // let angleY = u_X.angleBetween(v_X);

      // let v_Y = createVector(branch.vect.x, branch.vect.y);
      // let angleZ = u_X.angleBetween(v_Y);

      // let v_Z = createVector(branch.vect.y, branch.vect.z);
      // let angleX = u_X.angleBetween(v_Z);

      // console.log(angleX, angleY, angleZ);

      // let center = p5.Vector.lerp(begin, end, 0.5); 
      // let direction = p5.Vector.sub(end, begin);
      // let length = direction.mag(); 

      // push();
      // translate(begin.x, begin.y, begin.z); 
      // rotateZ(angleZ);
      // rotateX(angleX);
      // rotateY(angleY);
      // translate(0,-length/2,0)
      // box(branch.thickness, length, branch.thickness); 
      // pop();

      strokeWeight(branch.thickness)
      texture(woodTexture);
      stroke(0);
      line(begin.x, begin.y, begin.z, end.x, end.y, end.z);
  
      if (branch.suc.length == 0){
        push();
        translate(end.x, end.y, end.z);
        texture(leafTexture)
        noStroke();
        specularMaterial(255,255,255);
        box(branch.w);
        pop();
      }
    }
    pop();
  }


  function drawIsland() {
    push();
    strokeWeight(1);
    translate(0,25,0);
    texture(grass);
    box(400,50,400);
    pop();
  }


  function generateTree(k,l){
    let tree = [];
    for (let i = 0; i < depth; i++){
      sentence = applyRules(sentence);
    }
  
    let savedPos = [];
    let savedVect = [];
    let savedThickness = [];
    let savedPred = [];
  
    let pred = null;
    let currentPos = createVector(k*step + step/2, 0, l*step + step/2); 
    let currentVect = createVector(0,-len,0);
  
    for (let i = 0; i < sentence.length; i++) {
      currentChar = sentence[i];
      if (currentChar == "+"){
        if (currentVect.x == 0) {
          let rot = createVector(1,0,0);
          let newVect = rotateAround(currentVect, rot, angle);
          newVect = rotateAround(newVect, currentVect, random(0, 2*Math.PI/10));
          currentVect = newVect;
        } 
        else if(currentVect.y == 0){
          let rot = createVector(0,1,0);
          let newVect = rotateAround(currentVect, rot, angle);
          newVect = rotateAround(newVect, currentVect, random(0, 2*Math.PI));
          currentVect = newVect;
        }
        else {
          let rot = createVector((-currentVect.y/currentVect.x),1,0);
          let newVect = rotateAround(currentVect, rot, angle);
          newVect = rotateAround(newVect, currentVect, random(0, 2*Math.PI));
          currentVect = newVect;      
        }
      }
      else if (currentChar == "-"){
        if (currentVect.x == 0) {
          let rot = createVector(-1,0,0);
          let newVect = rotateAround(currentVect, rot, angle);
          newVect = rotateAround(newVect, currentVect, random(0, 2*Math.PI));
          currentVect = newVect;
        } 
        else if(currentVect.y == 0){
          let rot = createVector(0,-1,0);
          let newVect = rotateAround(currentVect, rot, angle);
          newVect = rotateAround(newVect, currentVect, random(0, 2*Math.PI));
          currentVect = newVect;
        }
        else {
          let rot = createVector((currentVect.y/currentVect.x),-1,0);
          let newVect = rotateAround(currentVect, rot, angle);
          newVect = rotateAround(newVect, currentVect, random(0, 2*Math.PI));
          currentVect = newVect;
        }
      }
      else if (currentChar == "["){
        savedPos.push(currentPos);
        savedVect.push(currentVect);
        savedThickness.push(thickness);
        savedPred.push(pred);
      }
      else if (currentChar == "]"){
        currentPos = savedPos.pop();
        currentVect = savedVect.pop();
        thickness = savedThickness.pop();
        pred = savedPred.pop();
      }
      else if (currentChar == "F"){
        
        tree.push(new Branch(currentPos, currentVect, thickness, pred, null));
        if (pred != null){
          pred.suc.push(tree.at(-1));
        }
        
        thickness *= 0.8;
        currentPos = p5.Vector.add(currentPos, currentVect);
        currentVect = p5.Vector.mult(currentVect, 0.9); 
        pred = tree.at(-1);
        ;
      }
  
    }

    trees.push(tree);
  }


  function prepareTiles() {
    tiles[0] = new Tile(tileImages[0], ["0","0","0","0"], 5);
    tiles[1] = new Tile(tileImages[1], ["0","0","0","0"], 2);
    tiles[2] = new Tile(tileImages[2], ["0","0","0","0"], 2);
    tiles[3] = new Tile(tileImages[3], ["0","0","0","0"], 2);
    tiles[4] = new Tile(tileImages[4], ["0","0","0","0"], 2);
    tiles[5] = new Tile(tileImages[5], ["0","0","0","0"], 2);
    tiles[6] = new Tile(tileImages[6], ["0","0","0","0"], 2);
    tiles[7] = new Tile(tileImages[7], ["21","31","03","30"], 7);
    tiles[8] = new Tile(tileImages[8], ["31","21","0","0"], 3);
    tiles[9] = new Tile(tileImages[9], ["31","03","13","0"], 25);
    tiles[10] = new Tile(tileImages[10], ["21","0","12","30"], 25);
    tiles[11] = new Tile(tileImages[11], ["12","30","03","13"], 7);
    tiles[12] = new Tile(tileImages[12], ["13","0","0","12"], 3);
    tiles[13] = new Tile(tileImages[13], ["03","13","31","03"], 7);
    tiles[14] = new Tile(tileImages[14], ["30","30","21","12"], 7);
    tiles[15] = new Tile(tileImages[15], ["0","4","21","0"], 1);
    tiles[16] = new Tile(tileImages[16], ["0","0","31","4"], 1);
    tiles[17] = new Tile(tileImages[17], ["12","5","0","0"], 1);
    tiles[18] = new Tile(tileImages[18], ["13","0","0","5"], 1);
    tiles[76] = new Tile(tileImages[76], ["7","7","7","7"], 30);
    tiles[77] = new Tile(tileImages[77], ["7","76","67","7"], 28);
    tiles[78] = new Tile(tileImages[78], ["0","67","7","76"], 20);
    tiles[79] = new Tile(tileImages[79], ["7","7","76","67"], 28);
    tiles[80] = new Tile(tileImages[80], ["67","7","76","0"], 20);
    tiles[81] = new Tile(tileImages[81], ["76","0","67","7"], 20);
    tiles[82] = new Tile(tileImages[82], ["76","67","7","7"], 28);
    tiles[83] = new Tile(tileImages[83], ["7","76","0","67"], 20);
    tiles[84] = new Tile(tileImages[84], ["67","7","7","76"], 28);
    tiles[85] = new Tile(tileImages[85], ["0","67","76","0"], 32);
    tiles[86] = new Tile(tileImages[86], ["0","0","67","76"], 32);
    tiles[87] = new Tile(tileImages[87], ["67","76","0","0"], 32);
    tiles[88] = new Tile(tileImages[88], ["76","0","0","67"], 32);
  
  
    for (let i = 0; i < 19; i++){
      tiles[19 + 3*i] = tiles[i].rotate(1);
      tiles[19 + 3*i + 1] = tiles[i].rotate(2);
      tiles[19 + 3*i + 2] = tiles[i].rotate(3);
    }
  
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      // console.log(tile)
      tile.analyze(tiles, i);
      
    }
  
  }


  function nextTile() {
    let gridCopy = grid.slice();
    gridCopy = gridCopy.filter((a) => !a.collapsed);
  
    if (gridCopy.length == 0) {
      console.table(grid)
      return;
    }
  
    gridCopy.sort((a,b) => {
      return a.options.length - b.options.length;
    });
    
    let len = gridCopy[0].options.length;
    let stopIndex = 0;
    for (let i = 1; i < gridCopy.length; i++) {
      if (gridCopy[i].options.length > len) {
        stopIndex = i;
        break;
      }
    }
  
    if (stopIndex > 0) {
      gridCopy.splice(stopIndex);
    }
    
    // console.table(gridCopy)
    const cell = random(gridCopy);
    // console.log(cell)
    cell.collapsed = true;
    // console.log(cell.options)
    const pick = randomPick(cell.options);
    // console.log(pick)
    if (pick == undefined) {
      console.log("Restart")
      generatePath();
      return;
    }
    
    cell.options = [pick];
    
    // console.table(gridCopy)
  
  
  
    const nextGrid = [];
    for (let j = 0; j < DIM; j++) {
      for (let i = 0; i < DIM; i++) {
        let index = i + j * DIM;
        // console.log(i,j);
        if (grid[index].collapsed) {
          nextGrid[index] = grid[index];
        } 
        else {
          let options = new Array(tiles.length).fill(0).map((x, i) => i);
          if (j == DIM - 1 || j == 0 || i == 0 || i == DIM - 1) {
            options = options.slice(0,76);
          }
          // Look up
          if (j > 0) {
            let validOptions = [];
            let up = grid[i + (j-1) * DIM];
            for (let option of up.options) {
              let valid = tiles[option].down;
              validOptions = validOptions.concat(valid);
            }
            checkValid(options, validOptions);
            // console.log(options);
          }
          // Look right
          if (i < DIM - 1) {
            let validOptions = [];
            let right = grid[i+1 + j * DIM];
            for (let option of right.options) {
              let valid = tiles[option].left;
              validOptions = validOptions.concat(valid);
            }
            checkValid(options, validOptions);
            // console.log(options);
  
          }
          // Look down
          if (j < DIM - 1) {
            let validOptions = [];
            let down = grid[i + (j+1) * DIM];
            for (let option of down.options) {
              let valid = tiles[option].up;
              validOptions = validOptions.concat(valid);
            }
            // console.log(valid);
            checkValid(options, validOptions);
          }
          // Look left
          if (i > 0) {
            let validOptions = [];
            let left = grid[(i-1) + j * DIM];
            for (let option of left.options) {
              let valid = tiles[option].right;
              validOptions = validOptions.concat(valid);
            }
            checkValid(options, validOptions);
            // console.log(options);
  
          }
          nextGrid[index] = new Cell(options);
        }
      }
    }
    grid = nextGrid;
  
    nextTile();
  }
  
function generatePath() {
    k = int(random(0,DIM));
    l = int(random(0,DIM));
    n = int(random(0,DIM-1));
    m = int(random(0,DIM-1));
    while ((n==k && m ==l) || (n+1==k && m ==l) || (n==k && m+1==l) || (n+1==k && m+1==l)) {
      n = int(random(0,DIM-1));
      m = int(random(0,DIM-1));
    }

    for (let i = 0; i < DIM * DIM; i++) {
      grid[i] = new Cell(tiles.length);
    }
    grid[k + l*DIM].options = [0];
    grid[k + l*DIM].collapsed = true;
    grid[n + m*DIM].options = [0];
    grid[n + m*DIM].collapsed = true;
    
    nextTile(k,l,n,m);
  }


function randomPick(options) {
  let totalWeight= 0;
  for (let opt of options) {
    totalWeight += tiles[opt].weight;
  }
  let random = Math.random() * totalWeight;
  for (let opt of options) {
      if (random < tiles[opt].weight) {
          return opt;
      }
      random -= tiles[opt].weight;
  }
}

function checkValid(arr, valid) {
    for (let i = arr.length - 1; i >= 0; i--) {
      let element = arr[i];
      if (!valid.includes(element)) {
        arr.splice(i,1);
      }
    }
  
  }


function printPath() {
  img = createGraphics(64*DIM,64*DIM);
  const w = img.width / DIM;
  const h = img.height / DIM;
  for (let j = 0; j < DIM; j++) {
    for (let i = 0; i < DIM; i++) {
      let cell = grid[i + j * DIM];
      if (cell.collapsed) {
        let index = cell.options[0];
        img.image(tiles[index].img, i * w, j * h, w, h);
      } else {
        img.fill(0);
        img.stroke(255);
        img.rect(i* w, j * h, w, h);
      }
    }
  }

  return img;
}

function drawWell() {
  // Corps du puits
  push();
  push();
  translate(0,25,0)
  texture(cobbleTexture);
  specularColor(255,255,255);
  scale(wellSize);
  cylinder(80, 125, 24, 1, false, false); 
  pop();

  // Eau au fond
  push();
  translate(0, 75, 0);
  rotateX(HALF_PI);
  texture(waterTexture);
  specularColor(255,255,255);
  scale(wellSize);
  circle(0, 0, 160);
  pop();

  // Rebord du puits
  push();
  translate(0, -50, 0);
  rotateX(HALF_PI);
  texture(cobbleTexture);
  specularColor(255,255,255);
  scale(wellSize);
  torus(90, 20, 24, 8); 
  pop();
  pop();
}



function drawArch() {
  push();
  translate(0, -130, 0);
  texture(plankTexture);
  
  // Arche en bois
  push();
  translate(0, 50, 0);
  texture(plankTexture);
  specularColor(255,255,255);
  scale(wellSize);
  torus(90, 10, 24, 8); 
  pop();

  // Piliers
  for (let i = -1; i <= 1; i += 2) {
    push();
    translate(i * 50, 40, 0);
    specularColor(255,255,255);
    scale(wellSize);
    box(10, 100, 10);
    pop();
  }
  
  // Barre transversale
  push();
  translate(0, 0, 0);
  specularColor(255,255,255);
  scale(wellSize);
  box(100, 10, 10);
  pop();

  // Corde
  push();
  translate(0,-10,0);
  stroke(100);
  strokeWeight(2);
  specularColor(255,255,255);
  scale(wellSize);
  line(0, 15, 0, 0, 100, 0);
  pop();

  // Seau
  push();
  translate(0, 100, 0);
  fill(150);
  specularColor(255,255,255);
  scale(wellSize);
  cylinder(20, 30);
  pop();
  
  pop();
}

function createCloud(x, y, z, rain) {
  let cloud = [];
  let numBoxes = int(random(1, 2)); 
  for (let i = 0; i < numBoxes; i++) {
      cloud.push({
          sizeX: random(200, 600),
          sizeY: random(100,300),
          sizeZ: random (100, 600),
          x: x,
          y: y, 
          z: z, 
          storm: rain,
          color_storm: random(50,150),
          color_sunny: random(200,255)
      });
  }
  return cloud;
}

function drawCloud(cloud) {
  push();
  // + sin(frameCount * 0.1) * 2
  for (let part of cloud) {
      push();
      translate(part.x + part.sizeX, part.y + part.sizeY , part.z + part.sizeZ); 
      fill(255, 255, 255, 255); 
      strokeWeight(1);
      if (part.storm) {
        fill(part.color_storm);
      }
      else{part.color_sunny;}
      
      // ambientMaterial(255);
      box(part.sizeX, part.sizeY, part.sizeZ);
      if (part.storm) {
        drawRain(part.x, part.y, part.z, part.sizeX, part.SizeY, part.sizeZ);
      }
      pop();
  }
  pop();
}


function drawRain(x, y, z, sizeX, sizeY, sizeZ) {
  let numDrops = 5; 

  push();
  // translate(x + sizeX, y + sizeY, z + sizeZ);
  stroke(0, 0, 255, 50); 
  strokeWeight(10);

  for (let i = 0; i < numDrops; i++) {
      let dropX = random(-sizeX / 2, sizeX / 2);
      let dropZ = random(-sizeZ / 2, sizeZ / 2);
      let dropY1 = random(y, 0); 
      let dropY2 = dropY1 + random(50, 100); 
      line(dropX, -dropY1, dropZ, dropX, -dropY2, dropZ);
  }

  pop();
}