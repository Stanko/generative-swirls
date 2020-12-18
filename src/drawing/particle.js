class Particle {
  constructor({
    position, 
    angle = Math.PI * 0.3,
    color = '#25608e',
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
    this.length = length;
    this.color = color;
    this.originalColor = color;

    this.sizeStep = p5.random(0.2, 0.4);

    this.done = false;
  }
  
  draw() {
    if (this.done) {
      return '';
    }
    
    p5.fill(this.color);

    p5.circle(this.position.x, this.position.y, this.size);

    let color = this.color;
    if (typeof color === 'number') {
      color = `#${ color.toString(16) }${ color.toString(16) }${ color.toString(16) }`;
    }
    return `<circle cx="${ this.position.x }" cy="${ this.position.y }" r="${ this.size / 2 }" fill="${ color }" />`
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
    // this.position.x += Math.cos(angle) * this.speed
    // this.position.y += Math.sin(angle) * this.speed

    this.size += (p5.noise((this.seed + this.counter) / 60) * 1.2) - 0.5;
  }
}

export default Particle;

