var bg_img;
var player;
var left = false;
var right = false;
var jump = false;
var planets = [];
var engrenagem;
var minWorldWidth = 0;
var maxWorldWidth;

function setup(){
  var canvas = createCanvas(innerWidth,innerHeight);
  maxWorldWidth = width;
  //local onde o canvas ira ficar na pagina
  canvas.parent("demo-holder");

  //carrega sprites
  bg_img = loadImage("assets/images/fundo.png");
  engrenagem = loadImage("assets/images/engrenagem.png");

  //cria objetos do jogo
  for(var i = 0; i < 5; i++){
    createPlanet(i);
  }

  planets[0].putPieces(5);
  player = new Player (planets[0]);

}

function createPlanet(index){

    var x = random(minWorldWidth, maxWorldWidth);
    var y = random(0, height);
    var pos = createVector(x,y);

    planets.push(new Planet(x, y));

    //aumenta o mundo horizontalmente
    minWorldWidth = x + planets[index].r * 2 ;
    maxWorldWidth = x + width/2;
}

function draw(){
  //desenha plano de fundo
  imageMode(CORNER);
  image(bg_img, 0, 0, width, height);
  imageMode(CENTER);

  push();

  //centraliza o player na tela
  translate(width/2 - player.pos.x, height/2 - player.pos.y);

  //desenha os objetos na tela
  for(var i = 0; i < planets.length; i++){
    planets[i].render();

    player.changePlanet(planets[i]);
  }
  player.catchPiece();
  player.planet.render();

  //se esta na "metade do mundo" cria um novo planeta
  if(player.pos.x >= maxWorldWidth/2){
      createPlanet(planets.length-1);
  }

  if(left) player.rotate(-player.vel);
  if(right) player.rotate(player.vel);

  player.update();
  player.render();
  pop();

  //draw score
  image(engrenagem, width/2 -50, 50, 50, 50);
  fill(0, 255, 155);
  textSize(28);
  text("" +player.pieces, width/2, 60);
}

function keyPressed(){
  switch (keyCode) {
    case 65:
      left = true;
      right = false;
      break;
    case 68:
      right = true;
      left= false;
        break;
    case 87:
      player.walk();
      break;
    case 81:

      break;
    default:

  }
}

function keyReleased(){
  switch (keyCode) {
    case 65:
      left = false;
      break;
    case 68:
      right = false;
      break;
    case 87:
      player.stop();
      break;
    case 83:

        break;
    default:

  }
}
