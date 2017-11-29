var bg_img;
var player;
var left = false;
var right = false;
var jump = false;
var planets = [];
var engrenagem;
var minWorldWidth = 0;
var maxWorldWidth;
var touching = false;


function setup(){
  var canvas = createCanvas(innerWidth,innerHeight);
  maxWorldWidth = width;
  musicaFundo(0);
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

  var nome = getParam("name");
  
  player = new Player (planets[0], nome);

}

function createPlanet(index){

    var x = random(minWorldWidth, maxWorldWidth);
    var y = random(0, height);
    var pos = createVector(x,y);

    planets.push(new Planet(x, y));

    //aumenta o mundo horizontalmente
    minWorldWidth = x + planets[index].r * 3 ;
    maxWorldWidth = x + width;
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
  player.planet.render();

  //se esta na "metade do mundo" cria um novo planeta
  if(player.pos.x >= maxWorldWidth/2){
      createPlanet(planets.length-1);
  }

  if(left) player.rotate(-player.vel);
  if(right) player.rotate(player.vel);

  player.update();
  if(touching){
    var mousePos = createVector(
                          mouseX - (width/2 - player.pos.x),
                          mouseY - (height/2 - player.pos.y));
    var path = player.pos.copy();
    path.sub(mousePos);
    path.normalize();

    var targetAngle = atan2(path.x, path.y);
    var currentAngle = atan2(player.direction.x, player.direction.y);
    var change = currentAngle - targetAngle;
    var absChange = change < 0 ? -change : change;
    var maxRotation = player.vel;

    player.rotate(degrees(
      absChange > maxRotation ? (Math.sign(change) * maxRotation) : change
    ));
  }
  player.render();
  pop();

  //draw score
  image(engrenagem, width/2 -50, 50, 50, 50);
  fill(0, 255, 155);
  textSize(28);
  text("" +player.pieces, width/2, 60);
}

function mousePressed() {
  touching = true;
  player.walk();
}

function mouseReleased() {
  player.stop();
  touching = false;
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

function getParam(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}
