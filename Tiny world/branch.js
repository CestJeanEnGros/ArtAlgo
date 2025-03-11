const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

class Branch{
    constructor(begin, vect, thickness, pred){
      this.begin = begin;
      this.vect = vect;
      this.thickness = thickness;
      this.pred = pred;
      this.suc = [];
      this.w = randomInt(25,150);
    }
  }