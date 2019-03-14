const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.scrollWidth;
canvas.height = canvas.scrollHeight;
const dnaLength = 300;
const genSize = 500;
let generation = [];
let framesDrawn = 0;
const goal = {x:canvas.width-100, y:canvas.height/2};
const tournamentParcipiants = 10;
let genNumber = 1;

// obsticle drawing
let obsticleNum = 0;
let obsticleArr = [];
let rect = {};
let drag = false;
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", mouseUp);
canvas.addEventListener("mousemove", mouseMove);
function mouseDown(e) {
  rect.startX = e.pageX;
  rect.startY = e.pageY;
  drag = true;
}
function mouseUp() {
  if(rect.w<0){
    rect.startX+=rect.w;
    rect.w*=-1;
  }
  if(rect.h<0){
    rect.startY+=rect.h;
    rect.h*=-1;
  }
  obsticleArr.push({startX:rect.startX, startY:rect.startY, w:rect.w, h:rect.h});
  obsticleNum++;
  drag = false;
}
function mouseMove(e) {
  if (drag) {
    rect.w = (e.pageX) - rect.startX;
    rect.h = (e.pageY) - rect.startY;
  }
}

// screen and elements on screen drawing
const draw = () => {
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#211f1f';                         // clear canvas
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = "30px Arial";
  ctx.fillText("generation: " + genNumber,canvas.width-250,canvas.height-50);
  ctx.fillStyle = '#a5551c';
  ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);  // drawing rect that is going to become obsticle
  obsticleArr.forEach( k => {ctx.fillRect(k.startX, k.startY, k.w, k.h);});  // drawing obsticles
  ctx.fillStyle = 'green';    // drawing goal
  ctx.fillRect(goal.x, goal.y, 20, 20);
  generation.forEach( indi => {  // drawing individuals
    indi.drawI();
  });
}

// chromoseme exchange
const pairChromosomes = t1 => t2 => {
  let ret = [];
  for (let i = 0; i < dnaLength; i++) {  
    if(Math.random() > 0.01){             // some random function i found good in no mutation
    i<dnaLength/(dnaLength/4 + Math.random()*dnaLength/2)?ret.push(t1.acc[i]):ret.push(t2.acc[i]);
    //i<dnaLength/2?ret.push(t1.acc[i]):ret.push(t2.acc[i]);  // half half exchange
    }else{
      ret.push(randomVel());   // mutation happened
    }
  }
  return ret;
}
// tournament to create new generation
// would like to add maybe another method that will respond to one individual better sucess
const tournament = () => {
  let toHalf = 0;
  while(toHalf++ < genSize/2){
    // random pick tournamentParcipiants
    let tournament = [];
    for (let i = 0; i < tournamentParcipiants; i++) {
      let k = Math.random()*genSize;
      tournament.push(generation[Math.floor(k)]);
    }
    // get 2 best for parents
    let parent1 = tournament.reduce((a, b) => a.calcFit()>b.calcFit()?a:b);
    tournament.splice(tournament.indexOf(parent1), 1);
    let parent2 = tournament.reduce((a, b) => a.calcFit()>b.calcFit()?a:b);

    // get 2 children from 2 parents
    let child1 = new Individual(pairChromosomes(parent1)(parent2));
    let child2 = new Individual(pairChromosomes(parent2)(parent1));

    // change generation
    generation[toHalf] = child1;
    generation[genSize/2 + toHalf] = child2;
  }
}

const newGeneration = () => {
  console.log(++genNumber);
  tournament();
}

// drawing loop (get new generation when first run out of DNA)
var frameControler = 0;
const step = () => {
  if (++framesDrawn >= dnaLength) {
    framesDrawn = 0;
    newGeneration();
    window.requestAnimationFrame(step);
    draw();
    return;
  }
  window.requestAnimationFrame(step);
  draw();
}

// generation of random DNA for first generation
const randomVel = () => {
  return {x:(Math.random()*2-1)*1, y:(Math.random()*2-1)*1};
}
const getDna = () => {
  DNA = [];
  for (let j = 0; j < dnaLength; j++) {
    DNA.push(randomVel());
  }
  return DNA;
}

// start of app
for (let i = 0; i < genSize; i++) {
  
  generation.push(new Individual(getDna()));
}
console.log(genNumber);
draw(); 
requestAnimationFrame(step);