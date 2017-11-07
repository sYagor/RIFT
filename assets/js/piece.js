class Piece{
  constructor(x, y){
    this.pos = createVector(x,y);
    this.r = random(10, 20);
    this.sprite = loadImage("assets/images/pecas/" + int(random(1,4)) + ".png");
  }

  render(){
    image(this.sprite, this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}
