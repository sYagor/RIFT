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
    var angleToRotate = atan2(this.direction.x, this.direction.y);
    rotate(-angleToRotate);
    image(
      this.sprite,
      0,
      0,
      this.width,
      this.height
    );
  }


}
