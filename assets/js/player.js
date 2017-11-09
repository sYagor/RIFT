class Player{
  constructor(planet){
    this.planet = planet;												//planeta target
    this.planet.visited = true;
    this.pos = planet.pos.copy();										// posicao
    this.direction = p5.Vector.fromAngle(radians(90));
    this.vel = 1.8;														//aceleracao do mesmo
    this.width = 30;
    this.height = 40;
    this.animationStatus = 0;											// controlador da animacao
    this.walking = false;												//se true está andando
    this.changing = false;												//se true é foguete
    this.animation = [loadImage("assets/images/player.png"),
                      loadImage("assets/images/player-left.png"),
                      loadImage("assets/images/player-right.png")];
	  this.rocket = new Rocket(this.pos, this.direction);
    this.visible = true;
    this.pieces = 0;
  }

  /**
  * desenha o personagem na tela
  */
  render(){
    push();
  	//rotaciona a imagem para a mesma direcao do personagem
    translate(this.pos.x, this.pos.y);

  	//se nao estiver trocando de planeta entao usa sprites do personagem
  	//senao usa o foguete
  	if(this.visible){
      var angleToRotate = atan2(this.direction.x, this.direction.y);
      rotate(-angleToRotate + radians(180));
		  image(this.animation[ int(this.animationStatus / 10)], 0, 0, this.width, this.height);
  	}else{
      this.rocket.render();
    }
    pop();
  }

  /**
  * altera o controlador da animacao
  */
  animate(){
    this.animationStatus++;
    if(this.animationStatus / 10 >= this.animation.length){
      this.animationStatus = 1;
    }
  }

  update(){

    if(this.changing && this.pos.dist(this.planet.pos) < this.planet.raura){
      var path = this.pos.copy();
      path.sub(this.planet.pos);
      var angleToRotate = this.direction.angleBetween(path);
      this.direction.rotate(angleToRotate);
    }

  	if(this.walking){
      this.animate();
    }

    //valida posicao
    var temp = this.pos.copy();
    temp.sub(this.direction.copy().mult(this.vel));

    if(this.pos.y < -180){
      this.direction.rotate(radians(15));
    }
    if(this.pos.y > height + 180){
      this.direction.rotate(radians(-15));
    }

    if(this.walking && temp.dist(this.planet.pos) < this.planet.r - this.width/2
        || this.changing){
      this.pos.sub(this.direction.copy().mult(this.vel));
    }
  }

  /**
  * anda
  */
  walk(){
    this.walking = true;
  }

  /**
  * para de andar
  */
  stop(){
    this.walking = false;
    this.animationStatus = 0;
  }

  getInsideRocket(){
    this.visible = false;
    this.changing = true;
    this.rocket.visible = true;
  }

  getOutsideRocket(){
    this.visible = true;
    this.rocket.visible = false;
  }

  rotate(direction){
    this.direction.rotate(radians(direction));
  }

  /**
  *se o planeta alvo nao for o anterior e vc esta dentro dele
  *muda para ele e desce da nave
  */
  changePlanet(planet){
    if(this.planet != planet &&
        this.pos.dist(planet.pos) < planet.r - this.width/2){
      this.changing = false;
      planet.putPieces(5);
      this.planet = planet;
      this.getOutsideRocket();
      this.planet.visited = true;
      return true;
    }
    return false;
  }


  catchPiece(){
    for (var i = 0; i < this.planet.pieces.length; i++) {
      var piece = this.planet.pieces[i];
      if(this.pos.dist(piece.pos) < piece.r){
        this.planet.pieces.pop(piece);
        this.pieces++;
      }
    }
    //se nao tem pecas entra na nave
    if(this.planet.pieces.length <= 0){
      this.getInsideRocket();
    }
  }
}
