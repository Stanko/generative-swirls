class Particle {
  constructor({
    position, 
    angle = Math.PI * 0.3,
    color = '#667788',
    length = 200,
    size = 5,
    seed = p5.random(0, 9999),
    speed = 2,
  }) {
    this.position = position || {
      x: 100,
      y: 100,
    };
    this.size = size;
    this.angle = angle || p5.random(0, 2 * Math.PI);
    this.seed = seed;
    this.speed = speed;
    this.counter = 0;
    this.length = Math.round(length);
    this.color = color;
    this.originalColor = color;

    
    if (typeof this.color === 'number') {
      this.color = `#${ this.color.toString(16) }${ this.color.toString(16) }${ this.color.toString(16) }`;
    }

    this.sizeStep = p5.random(0.2, 0.4);

    this.done = false;
  }
  
  draw(isLastStep) {
    p5.fill(this.color);
    p5.circle(this.position.x, this.position.y, this.size);

    if (isLastStep || !this.done) {
      return `<circle cx="${ this.position.x.toFixed(1) }" cy="${ this.position.y.toFixed(1) }" r="${ this.size / 2 }" fill="${ this.color }" />`
    }

    return '';
  }

  move() {
    if (this.done || this.counter > this.length) {
      this.done = true;
      return;
    }

    const angle = this.angle + (p5.noise(this.seed / 40) * 2 - 1) * Math.PI / 2;
    this.seed++;
    this.counter++;

    const movement = Math.max(this.size / 40, 1);

    this.position.x += Math.cos(angle) * movement; 
    this.position.y += Math.sin(angle) * movement; 

    this.size += (p5.noise((this.seed + this.counter) / 60) * 1.2) - 0.5;
  }
}

export default Particle;

