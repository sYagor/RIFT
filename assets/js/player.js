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
    this.flying = false;												//se true é foguete
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


  	if(this.walking){
      this.animate();
    }

    //valida posicao
    var temp = this.pos.copy();
    temp.sub(this.direction.copy().mult(this.vel));

    if(this.pos.y < -360){
      this.direction.rotate(radians(1));
    }
    if(this.pos.y > height + 360){
      this.direction.rotate(radians(-1));
    }

    if(this.walking && temp.dist(this.planet.pos) < this.planet.r - this.width/2
        || this.flying){
      this.pos.sub(this.direction.copy().mult(this.vel));
    }

    this.catchPiece();
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
    this.flying = true;
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
    if(this.planet != planet){
      // orbita, faz a gravidade puxar a nave
      if(this.flying && this.pos.dist(planet.pos) < planet.raura + this.rocket.height){
          var path = this.pos.copy();
          path.sub(planet.pos);
          path.normalize();
          var angle = path.angleBetween(this.direction);
          var ondeDegree = PI / 180;

          //aqui temos um bug
          //gravidade as vezes empurra ao invez de puxar
          if(this.pos.y > planet.pos.y && this.pos.x < planet.pos.x ||
             this.pos.x > planet.pos.x && this.pos.y < planet.pos.y )
            this.direction.rotate(angle > ondeDegree ? -ondeDegree : -angle);
          else
            this.direction.rotate(angle > ondeDegree ? ondeDegree : angle);
      }

      if(this.pos.dist(planet.pos) < planet.r - this.width/2){
        this.flying = false;
        planet.putPieces(5);
        this.planet = planet;
        this.getOutsideRocket();
        this.planet.visited = true;
        return true;
      }
    }
    return false;
  }


  catchPiece(){
    var pieces = this.planet.pieces;
    for (var i = 0; i < pieces.length; i++) {
      if(this.pos.dist(pieces[i].pos) < this.width){
        pieces.splice(i, 1);
        this.pieces++;
      }
    }
    //se nao tem pecas entra na nave
    if(this.planet.pieces.length <= 0){
      this.getInsideRocket();
    }
  }
}
