import colors from './colors';
import PoissonDiskSampling from 'poisson-disk-sampling';

import 'p5';

import Particle from './particle';
import { generateConvexPolygon } from '../../../generative-utils/polygons';
import { getPointOnLine } from '../../../generative-utils/points';
import { getVectorAngle } from '../../../generative-utils/vectors';
import { chaikin } from './chaikin';

window.$fxhashFeatures = window.$fxhashFeatures || {};

const rng = fxrand;

Math.random = rng;

const w = 1500;
const h = 1500;

// const backgroundColor = [207, 41, 5];
const backgroundColor = [
  Math.round(Math.random() * 120) + 200,
  Math.round(Math.random() * 20) + 30,
  Math.round(Math.random() * 10) + 5,
];

function hsl(color) {
  return `hsl(${color[0]},${color[1]}%,${color[2]}%)`;
}

let particles = [];
let polygon;

const pds1 = new PoissonDiskSampling({
  shape: [w, h],
  minDistance: w * 0.005,
  maxDistance: w,
  tries: 10,
});

const pds2 = new PoissonDiskSampling({
  shape: [w, h],
  minDistance: w * 0.003,
  maxDistance: w,
  tries: 10,
});

const points1 = pds1.fill();
const points2 = pds2.fill();

function changeColor(h, s, l) {
  h = h + (random(-3, 3) % 360);
  s = s + (random(-2, 2) % 100);
  l = l + (random(-2, 2) % 100);

  h = h < 0 ? 0 : h;
  s = s < 0 ? 0 : s;
  l = l < 0 ? 0 : l;

  return [h, s, l];
}

function createRoot(center = { x: w / 2, y: h / 2 }) {
  background(240);

  const particles = [];

  polygon = generateConvexPolygon(Math.round(random(4, 14)), 100, center);

  polygon.forEach((p, index) => {
    let color = random(colors);
    color = changeColor(...color);

    for (let i = 0; i < 1; i += random(0.25, 0.5)) {
      const p2 = polygon[(index + 1) % polygon.length];
      const position = getPointOnLine(p, p2, i);
      // -2 looks nice, leaves a hole in the middle
      const direction = random() > 0.5 ? -2 : 2;

      const angle =
        getVectorAngle({
          x: p2.x - p.x,
          y: p2.y - p.y,
        }) +
        Math.PI / direction +
        Math.PI * random(-0.2, 0.2);

      particles.push(new Particle(position, angle, color, random(10, 250)));
    }
  });

  return particles;
}

function drawParticles(particles) {
  particles.forEach((p) => {
    const newParticles = [];

    while (!p.done) {
      p.draw();
      const newParticle = p.move();

      if (newParticle) {
        newParticles.push(newParticle);
      }
    }

    drawParticles(newParticles);
  });
}

function drawBackground() {
  const bgSections = Math.round(random(8, 15));
  const step = h / bgSections;

  const bg = [...backgroundColor];
  const sign = Math.random() > 0.5 ? -1 : 1;

  background(hsl(backgroundColor));

  for (let i = 0; i < bgSections; i++) {
    bg[0] = Math.round(bg[0] + sign * random(5, 10) + 360) % 360;
    bg[1] = Math.round(bg[1] + random(-5, 5));
    bg[2] = Math.round(bg[2] + random(0.75, 1.5));

    if (bg[1] < 0) {
      bg[1] = 0;
    }
    if (bg[2] < 0) {
      bg[2] = 0;
    }
    if (bg[1] > 100) {
      bg[1] = 100;
    }
    if (bg[2] > 100) {
      bg[2] = 100;
    }

    const y1 = (i + 1) * step;
    const y2 = y1 - step;

    let line = [];
    const linePointsCount = Math.round(random(8, 20));
    const lineStep = w / linePointsCount;
    for (let j = 0; j <= linePointsCount; j++) {
      line.push({
        x: j * lineStep,
        y: y2 + noise(i * 10000 + j) * (step * 1),
      });
    }

    line = chaikin(line, 2, false, 0.25);

    fill(hsl(bg));

    // rect(0, i * step, w, step);
    beginShape();
    vertex(0, y1 + step);
    line.forEach((p) => {
      vertex(p.x, p.y);
    });
    vertex(w, y1 + step);
    endShape(CLOSE);
  }

  points1.forEach((p) => {
    const c = color(hsl(bg));
    c.setAlpha(Math.round(random(100, 250)));
    fill(c);
    circle(...p, random(1, 4));
  });
  points2.forEach((p) => {
    const c = color(hsl(backgroundColor));
    c.setAlpha(Math.round(random(50, 100)));
    fill(c);
    circle(...p, random(1, 3));
  });
}

function main() {
  particles.forEach((item) => {
    const newParticles = [];

    item.forEach((p) => {
      p.draw();
      const newParticle = p.move();

      if (newParticle) {
        newParticles.push(newParticle);
      }
    });

    newParticles.forEach((p) => item.push(p));
  });

  // drawParticles(shuffle(particles));
}

window.setup = function () {
  function addRoot() {
    return createRoot({
      x: random(w * 0.2, w * 0.8),
      y: random(w * 0.2, w * 0.8),
    });
  }

  const maxRoots = Math.round(random(4, 8));

  for (let i = 0; i < maxRoots; i++) {
    particles.push(addRoot());
  }

  window.$fxhashFeatures.roots = maxRoots;
  window.$fxhashFeatures.seeds = particles.flat().length;

  createCanvas(w, h);
  noStroke();

  drawBackground();
};

window.draw = function () {
  if (frameCount > 320) {
    noLoop();

    console.log('Done');
    fxpreview();
  }
  main();
};

// Convert canvas to image
window.addEventListener('keydown', function (e) {
  if (e.key === 's') {
    e.preventDefault();
    const canvas = document.querySelector('canvas');
    const dataURL = canvas.toDataURL('image/png');

    downloadImage(dataURL, fxhash + '.png');
  }
});

// Save | Download image
function downloadImage(data, filename) {
  var a = document.createElement('a');
  a.href = data;
  a.download = filename;
  a.click();
}
