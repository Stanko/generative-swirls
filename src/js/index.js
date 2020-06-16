let fs;

import colors from './colors';

const isNode = typeof window === 'undefined';
const isBrowser = !isNode;

if (isNode) {
  fs = require('fs');
} else {
  require('p5');
}

import seedrandom from 'seedrandom';
import Particle from './particle';
import { generateConvexPolygon, drawPolygon } from '../../../generative-utils/polygons'
import { getPointOnLine } from '../../../generative-utils/points';
import { getVectorAngle } from '../../../generative-utils/vectors';
import { scalePolygon } from '../../../generative-utils/polygons/scale-polygon'

let seed = 'seed';

if (isBrowser) {
  const hash = window.location.hash.replace('#', '');

  if (hash) {
    seed = hash;
  } else {
    seed = Math.random().toString(32).substr(2);
    window.location.hash = seed;
  }

  window.addEventListener('hashchange', () => {
    window.location.reload();
  });
}

const rng = seedrandom(seed);
Math.random = rng;

const w = 1500;
const h = 1500;

let particles = [];
let polygon;

function changeColor(h, s, l) {
  h = h + random(-3, 3) % 360;
  s = s + random(-2, 2) % 100;
  l = l + random(-2, 2) % 100;

  h = h < 0 ? 0 : h;
  s = s < 0 ? 0 : s;
  l = l < 0 ? 0 : l;

  return [h, s, l];
}

function prepare(center = { x: 750, y: 750 }) {
  background(240);
  noStroke();

  const particles = [];

  polygon = generateConvexPolygon(Math.round(random(4, 14)), 100, center);

  polygon.forEach((p, index) => {
    let color = colors[Math.round(random(0, colors.length - 1))];
    color = changeColor(...color);

    for (let i = 0; i < 1; i += 0.2) {
      const p2 = polygon[(index + 1) % polygon.length];
      const position = getPointOnLine(p, p2, i);
      // -2 looks nice, leaves a hole in the middle
      const direction = random() > 0.5 ? -2 : 2;

      const angle = getVectorAngle({
        x: p2.x - p.x,
        y: p2.y - p.y,
      }) + Math.PI / direction + Math.PI * random(-0.2, 0.2);

      particles.push(new Particle(
        position,
        angle,
        color,
        random(10, 250),
      ));
    }
  });
  
  return particles;
}

function drawParticles(particles) {
  particles.forEach(p => {
    const newParticles = [];

    while(!p.done) {
      p.draw();
      const newParticle = p.move();
      
      if (newParticle) {
        newParticles.push(newParticle);
      }
    }

    drawParticles(newParticles);
  });
}


function main() {
  particles.forEach(item => {
    const newParticles = [];

    item.forEach(p => {
      p.draw();
      const newParticle = p.move();
      
      if (newParticle) {
        newParticles.push(newParticle);
      }
    });
      
    newParticles.forEach(p => item.push(p));
  });

  // drawParticles(shuffle(particles));
}

if (typeof window === 'undefined') {
  main();
  console.log('Total lines: ', l.lines.length);
  console.log('Removed double lines: ', l.skippedLinesCount);

  const file = fs.openSync(`./svg/{ seed }.svg`, 'w');

  fs.writeSync(
    file, 
    `<svg viewBox="0 0 ${ w } ${ h }" xmlns="http://www.w3.org/2000/svg">\n<g stroke="black">`
  );

  l.lines.forEach(line => {
    fs.writeSync(file, `<path d="M ${ line.x1 }, ${ line.y1 } L ${ line.x2 }, ${ line.y2 }" />\n`);
  });

  fs.writeSync(file, `</g>\n</svg>`);
} else {
  window.setup = function() {
    particles.push(prepare());
    particles.push(prepare({ x: random(300, 500), y: random(300, 500) }));
    particles.push(prepare({ x: random(1000, 1200), y: random(1000, 1200) }));
    particles.push(prepare({ x: random(300, 500), y: random(1000, 1200) }));
    particles.push(prepare({ x: random(1000, 1200), y: random(300, 500) }));
    
    createCanvas(w, h);
    background('#1a2e3e');
    // background(255);
  };

  window.draw = function() {
    if (frameCount > 300) {
      noLoop();

      console.log('--- 300')
    }
    main();
  }
}