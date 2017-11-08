var bg_img;
var player;
var left = false;
var right = false;
var jump = false;
var planets = [];
var engrenagem;

function setup(){
  var canvas = createCanvas(innerWidth,innerHeight);

  //local onde o canvas ira ficar na pagina
  canvas.parent("demo-holder");

  //carrega sprites
  bg_img = loadImage("assets/images/fundo.png");
  engrenagem = loadImage("assets/images/engrenagem.png");

  //cria objetos do jogo
  var initialPosition = 0;
  var finalPosition = width;
  for(var i = 0; i < 5; i++){
    var x = random(initialPosition, finalPosition);
    var y = random(0, height);
    var pos = createVector(x,y);

    planets.push(new Planet(x, y));
    initialPosition += x + planets[i].r ;
    finalPosition += planets[i].r ;
  }

  planets[0].putPieces(5);
  player = new Player (planets[0]);

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
    if(planets[i] != player.plannet)
      planets[i].render();
  }
  player.planet.render();

  player.catchPiece();


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

function mousePressed(){
  for (var i = 0; i < planets.length; i++) {
	// altera a posicao do mouse para que as coordenadas batam com as do jogo
    // em seguida se o planeta clicado nao é o atual vai para elee
	var mousePos = createVector(mouseX - (width/2 - player.pos.x) , mouseY - (height/2 - player.pos.y));
    if(planets[i].pos.dist(mousePos) < planets[i].r){
      if(player.planet != planets[i])
        player.changePlanet(planets[i]);
    }
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
