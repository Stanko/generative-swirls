import { rgbToHsluv, hsluvToRgb } from 'hsluv';


class Particle {
  constructor(
    position, 
    angle = Math.PI * 0.3,
    color = '#25608e',
    length = 200,
    size = 5,
    seed = random(0, 9999),
  ) {
    this.position = position || {
      x: 100,
      y: 100,
    };
    this.size = size;
    this.angle = angle || random(0, 2 * Math.PI);
    this.seed = seed;
    this.speed = 3;
    this.counter = 0;
    this.length = length;
    this.color = color;
    this.originalColor = color;

    this.sizeStep = random(0.2, 0.4);

    this.done = false;
  }
  
  draw() {
    if (this.done) {
      return;
    }
    
    const size = noise(this.counter / 30) * 30 + 1;

    fill(this.color);

    circle(this.position.x, this.position.y, this.size);
    // circle(this.position.x, this.position.y, this.size);
  }

  move() {
    if (this.done || this.counter > this.length) {
      this.done = true;
      return;
    }
    
    const angle = this.angle + (noise(this.seed / 40) * 2 - 1) * Math.PI / 2;
    this.seed++;
    this.counter++;
    // this.position.x += Math.cos(angle) * this.size / 10; 
    // this.position.y += Math.sin(angle) * this.size / 10; 
    this.position.x += Math.cos(angle) * this.speed
    this.position.y += Math.sin(angle) * this.speed
    this.size += this.sizeStep

    // if (random() > this.prob) {
    //   this.prob += this.prob * 0.015;
      
    //   return new Particle(
    //     { ...this.position }, 
    //     this.angle + Math.PI / 3 * (random() * 2 - 1),
    //     this.color,
    //     this.length / 2,
    //     this.size,
    //     this.seed,
    //   );  
    // }
  }
}

export default Particle;

