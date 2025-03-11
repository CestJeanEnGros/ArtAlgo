const BAN = new Array(89).fill([[],[],[],[]])
BAN[7] = [[63,23],[11,59],[],[]];
BAN[11] = [[41,14],[],[],[7,60]];
BAN[13] = [[],[41,58],[52,60],[]];
BAN[14] = [[],[],[11,61],[40,63]];
BAN[58] = [[],[],[59,42],[13,53]];
BAN[60] = [[13,40],[59],[],[]];
BAN[59] = [[58,54],[],[],[60]];
BAN[53] = [[],[58],[62],[]];
BAN[62] = [[53],[42],[],[]];
BAN[42] = [[58],[],[],[62]];
BAN[40] = [[],[54],[60],[]];
BAN[54] = [[],[],[59],[40]];





function compareEdge(a, b) {
    return a == reverseString(b);
}

function reverseString(s) {
    let arr = s.split('');
    arr = arr.reverse();
    return arr.join('');
}

  
class Tile {
    constructor(img, edges, weight) {
        this.img = img;
        this.edges = edges;

        this.up = [];
        this.right = [];
        this.down = [];
        this.left = []; 

        this.weight = weight;
    
        // if (i !== undefined) {
        //   this.index = i;
        // }
      }
    
    analyze(tiles, idx) {
        for (let i = 0; i < tiles.length; i++) {
            let tile = tiles[i];
            // Check if the current tile's bottom edge matches this tile's top edge
            if (compareEdge(tile.edges[2], this.edges[0])) {
                if ((this.edges.join('') === "0000" || this.edges[0] != 0 || tile.edges.join('') === "0000") && !BAN[idx][0].includes(i))  {
                    this.up.push(i);       
                }   
            }
            // Check if the current tile's left edge matches this tile's right edge
            if (compareEdge(tile.edges[3], this.edges[1])) {
                if ((this.edges.join('') === "0000" || this.edges[1] != 0 || tile.edges.join('') === "0000") && !BAN[idx][1].includes(i))  {
                    this.right.push(i);       
                }   
            }
            // Check if the current tile's top edge matches this tile's bottom edge
            if (compareEdge(tile.edges[0], this.edges[2])) {
                if ((this.edges.join('') === "0000" || this.edges[2] != 0 || tile.edges.join('') === "0000") && !BAN[idx][2].includes(i))  {
                    this.down.push(i);       
                }  
            }
            // Check if the current tile's right edge matches this tile's left edge
            if (compareEdge(tile.edges[1], this.edges[3])) {
                if ((this.edges.join('') === "0000" || this.edges[3] != 0 || tile.edges.join('') === "0000") && !BAN[idx][3].includes(i))  {
                    this.left.push(i);       
                }  
            }
        }
    }

    rotate(num) {
        const w = this.img.width;
        const h = this.img.height;
        const newImg = createGraphics(w, h);
        newImg.imageMode(CENTER);
        newImg.translate(w/2, h/2);
        newImg.rotate(HALF_PI * num);

        newImg.image(this.img, 0, 0);

        const newEdges = [];
        const len = this.edges.length;
        for (let i = 0; i < len; i++) {
            newEdges[i] = this.edges[(i - num + len) % len];
        }


        
        
        return new Tile(newImg, newEdges, this.weight);
    }
}