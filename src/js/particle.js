import { rgbToHsluv, hsluvToRgb } from 'hsluv';

class Particle {
  constructor(
    position,
    angle = Math.PI * 0.3,
    color = '#25608e',
    length = 200,
    size = 5,
    seed = random(0, 99999)
  ) {
    this.position = position || {
      x: 100,
      y: 100,
    };
    this.size = size;
    this.angle = angle || random(0, 2 * Math.PI);
    this.seed = seed;
    this.speed = 2;
    this.counter = 0;
    this.length = length;
    this.color = color;
    this.originalColor = color;

    this.prob = 0.95;
    this.done = false;
  }

  draw() {
    if (this.done) {
      return;
    }

    const size = noise(this.counter / 30) * 30 + 1;

    fill(...hsluvToRgb(this.color).map((n) => n * 255));
    // stroke(...hsluvToRgb(this.darken(15)).map((n) => n * 255));

    circle(this.position.x, this.position.y, size);

    // fill(...hsluvToRgb(this.darken(15)).map((n) => n * 255));
    // stroke(...hsluvToRgb(this.darken(25)).map((n) => n * 255));

    // circle(
    //   this.position.x + size * 0.3,
    //   this.position.y + size * 0.3,
    //   size / 2
    // );

    // fill(...hsluvToRgb(this.darken(30)).map((n) => n * 255));
    // stroke(...hsluvToRgb(this.darken(40)).map((n) => n * 255));

    // circle(
    //   this.position.x + size * 0.6,
    //   this.position.y + size * 0.6,
    //   size / 4
    // );
  }

  changeColor() {
    let h = this.color[0] + (random(-0.3, 0.3) % 360);
    let s = this.color[1] + (random(-1, 1) % 100);
    let l = this.color[2] + (random(-1, 1) % 100);

    h = h < 0 ? 0 : h;
    s = s < 0 ? 0 : s;
    l = l < 0 ? 0 : l;

    this.color = [h, s, l];
  }

  darken(n) {
    let l = this.color[2] - n;

    l = l < 0 ? 0 : l;

    return [this.color[0], this.color[1], l];
  }

  move() {
    if (this.done || this.counter > this.length) {
      this.done = true;
      return;
    }

    const angle = this.angle + ((noise(this.seed / 40) * 2 - 1) * Math.PI) / 2;
    this.seed++;
    this.counter++;
    // this.position.x += Math.cos(angle) * this.size / 10;
    // this.position.y += Math.sin(angle) * this.size / 10;
    this.position.x += Math.cos(angle) * this.speed;
    this.position.y += Math.sin(angle) * this.speed;
    this.size += noise((this.seed + 300) / 40) * 3 - 1.5;

    // if (this.size < 2) {
    //   this.size = 2;
    // }

    this.changeColor();

    if (random() > this.prob) {
      this.prob += this.prob * 0.015;

      return new Particle(
        { ...this.position },
        this.angle + (Math.PI / 3) * (random() * 2 - 1),
        this.color,
        this.length / 2,
        this.size,
        this.seed
      );
    }
  }
}

export default Particle;
