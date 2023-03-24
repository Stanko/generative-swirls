import simplify from 'simplify-js';
import random from '../utils/random';

export const SCALE = 1000;
const SIMPLIFY_TOLERANCE = 0.35;

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

    this.polygon = [];
    this.circles = [];

    if (typeof this.color === 'number') {
      this.color = `#${this.color.toString(16)}${this.color.toString(
        16
      )}${this.color.toString(16)}`;
    }

    const colors = ['#f1c40f', '#3498db', '#e74c3c'];

    this.color = colors[random(0, colors.length - 1, null, 0)];

    this.sizeStep = p5.random(0.2, 0.4);

    this.done = false;
  }

  getCircle() {
    const x = this.position.x;
    const y = this.position.y;
    const r = this.size / 2;

    const SIDES = 32;
    const angleStep = (Math.PI * 2) / SIDES;
    const circle = [];

    for (let i = 0; i < SIDES; i++) {
      circle.push({
        x: (x + Math.cos(angleStep * i) * r) * SCALE,
        y: (y + Math.sin(angleStep * i) * r) * SCALE,
      });
    }

    return circle;
  }

  createPolygon() {
    const clipper = window.clipper;
    this.polygon = clipper
      .clipToPaths({
        clipType: 'union',
        subjectFillType: 'positive',
        subjectInputs: this.circles.map((circle) => {
          return {
            data: circle,
            closed: true,
          };
        }),
      })
      .map((part) => {
        return simplify(part, SIMPLIFY_TOLERANCE * SCALE);
      });
  }

  draw(isLastStep) {
    p5.fill(this.color);
    p5.circle(this.position.x, this.position.y, this.size);

    const x = this.position.x.toFixed(1);
    const y = this.position.y.toFixed(1);
    const r = this.size / 2;

    this.circles.push(this.getCircle());

    if (isLastStep) {
      this.createPolygon();
    }

    if (isLastStep || !this.done) {
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="${this.color}" />`;
    }

    return '';
  }

  move() {
    if (this.done || this.counter > this.length) {
      this.done = true;
      return;
    }

    const angle =
      this.angle + ((p5.noise(this.seed / 40) * 2 - 1) * Math.PI) / 2;
    this.seed++;
    this.counter++;

    const movement = Math.max(this.size / 40, 1);

    this.position.x += Math.cos(angle) * movement;
    this.position.y += Math.sin(angle) * movement;

    this.size += p5.noise((this.seed + this.counter) / 60) * 1.2 - 0.5;

    if (this.size < 2) {
      this.size = 2;
    }
  }
}

export default Particle;
