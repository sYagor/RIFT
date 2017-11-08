class Rocket {
  constructor(position, direction) {
    this.sprite = loadImage("assets/images/rocket.png");
    //posicao e direcao sao as mesmas do player 
    this.pos = position;
    this.direction = direction;
    this.width = 30;
    this.height =40;
    this.visible = false;
  }

  render(){
	rotate(radians(this.direction-90));
    image(
      this.sprite,
      0,
      0,
      this.width,
      this.height
    );
  }


}
