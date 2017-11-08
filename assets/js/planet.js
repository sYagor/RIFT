class Planet{
  constructor(x, y){
    this.pieces = [];
    this.pos = createVector(x, y);

	//o raio e um valor aleatorio entre 60 e 90
    this.r = random(90, 180);

	//o raio da aura (gravidade) é 20% maior que o raio do planeta
    this.raura = this.r * 1.2;
    this.aura = loadImage("assets/images/planets/gravidade.png");

	//carrega um sprite aleatorio entre 1 e 7
    this.sprite = loadImage("assets/images/planets/" + int(random(1,7))+ ".png");
  }

  render(){
    image(this.aura, this.pos.x, this.pos.y, this.raura * 2, this.raura * 2);
    image(this.sprite, this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    //desenha as pecas no planeta
	for (var i = 0; i < this.pieces.length; i++) {
     this.pieces[i].render();
    }
  }

  putPieces(qtd){
    for(var i = 0; i < qtd; i++ ){
      this.pieces.push(
        new Piece(
          random(this.pos.x - this.r + 40, this.pos.x + this.r -40),
          random(this.pos.y - this.r + 40, this.pos.y + this.r - 40)));
    }
  }

}
