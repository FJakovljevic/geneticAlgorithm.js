class Individual {
  constructor(DNA) {
     this.pos = {x:30, y:canvas.height/2};
     this.vel = {x:0, y:0};
     this.acc = DNA;
     this.fitness = 0;
     this.move = true;
     this.alfa = 1;
  }
  calcFit() {
    let par1 = (this.pos.x-goal.x)*(this.pos.x-goal.x);
    let par2 = (this.pos.y-goal.y)*(this.pos.y-goal.y);
    this.fitness = 1/Math.sqrt(par1 + par2);
    return this.fitness * this.alfa;
  }
  update() {
    if(this.move){
      this.vel.x += this.acc[framesDrawn].x;
      this.vel.y += this.acc[framesDrawn].y;
      this.pos.x += this.vel.x
      this.pos.y += this.vel.y;

      if(this.pos.x < 0 || this.pos.y < 0 || this.pos.x > canvas.width || this.pos.y > canvas.height){
        this.move = false;
        this.alfa = 0.5;
      }
      if(!obsticleNum == 0) {
        obsticleArr.forEach( o => {
          if(isInObsticle(this.pos.x)(this.pos.y)(o.startX)(o.startX + o.w)(o.startY)(o.startY + o.h)){
            this.move = false;
            this.alfa = 0.5;
          }
        });
      }
      if((this.pos.x > goal.x && this.pos.x < goal.x+20) && (this.pos.y > goal.y && this.pos.y < goal.y+20)) {
        this.move = false;
        this.alfa = 2;
      }
    }
  }
  drawI() {
    this.update();
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.globalAlpha = 0.5;
    ctx.arc(this.pos.x, this.pos.y, 7, 0, 2*Math.PI);
    ctx.fill();
    ctx.closePath();
  }
}

const isInObsticle = pX => pY => oX1 => oX2 => oY1 => oY2 => {
  if((pX > oX1 && pX < oX2) && (pY > oY1 && pY < oY2)){
    return true;
  }
  return false;
}