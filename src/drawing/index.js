import p5constructor from 'p5';
import setMainSeed from '../utils/set-main-seed';
import { generateConvexPolygon } from '../../../generative-utils/polygons';
import { getPointOnLine } from '../../../generative-utils/points';
import { getVectorAngle } from '../../../generative-utils/vectors';
import Particle, { SCALE } from './particle';
import seedrandom from 'seedrandom';
import random from '../utils/random';
import { saveAs } from 'file-saver';
import * as clipperLib from 'js-angusj-clipper';

let sketchInstance;

const sketchWrapperElement = document.querySelector('.sketch');
const svgSketchWrapperElement = document.querySelector('.svg-sketch');

// Add SVG
const svgElement = document.querySelector('.svg');
const svgDownloadButton = document.querySelector('.svg-download');

svgDownloadButton.addEventListener('click', () => {
  const name =
    'swirl-' +
    window.location.hash.replace('#/', '').replace(/\//g, '-') +
    '.svg';
  saveAs(
    `data:application/octet-stream;base64,${btoa(svgElement.outerHTML)}`,
    name
  );
});

let polygon;

function getColor(rng, startColor, colorRange) {
  return `hsl(${random(startColor, startColor + colorRange, rng, 0)}, ${random(
    60,
    90,
    rng,
    0
  )}%, ${random(30, 80, rng, 0)}%)`;
}

function prepare(options) {
  const center = {
    x: options.width / 2,
    y: options.height / 2,
  };
  const particles = [];

  polygon = generateConvexPolygon(Math.round(p5.random(4, 14)), 100, center);

  const colorRNG = seedrandom(options.colorSeed);
  const startColor = random(0, 360 - options.colorRange, colorRNG, 0);

  const REVERSE_DENSITY = 0.205; // max + min density
  const densityStep = REVERSE_DENSITY - options.lineDensity;

  polygon.forEach((p, index) => {
    for (let i = 0; i < 1; i += densityStep) {
      const p2 = polygon[(index + 1) % polygon.length];
      const position = getPointOnLine(p, p2, i);
      // -2 looks nice, leaves a hole in the middle
      const directionMap = {
        circular: p5.random() > 0.5 ? -1 : 1,
        interlaced: p5.random() > 0.5 ? -2 : 2,
      };
      const direction = directionMap[options.direction];

      const angle =
        getVectorAngle({
          x: p2.x - p.x,
          y: p2.y - p.y,
        }) +
        Math.PI / direction +
        Math.PI * p5.random(-0.2, 0.2);

      const color = options.grayscale
        ? Math.round(p5.random(30, 240))
        : getColor(colorRNG, startColor, options.colorRange);

      particles.push(
        new Particle({
          position,
          angle,
          color,
          length: random(options.minLength, options.maxLength, null, 0),
          size: random(options.minStartingSize, options.maxStartingSize),
          speed: random(2, 3),
        })
      );
    }
  });

  return p5.shuffle(particles);
}

function getSvgPolygon(polygon, color) {
  const paths = polygon.map((part) => {
    const l = part
      .map((point) => {
        return `${point.x / SCALE} ${point.y / SCALE}`;
      })
      .join(' L ');

    return `<path d="${`M ${l} Z`}" fill="none"  stroke="${color}" />`;
  });

  return paths.join('\n');
}

export default async function drawing(options) {
  if (!window.clipper) {
    // create an instance of the library (usually only do this once in your app)
    window.clipper = await clipperLib.loadNativeClipperLibInstanceAsync(
      // let it autodetect which one to use, but also available WasmOnly and AsmJsOnly
      clipperLib.NativeClipperLibRequestedFormat.WasmWithAsmJsFallback
    );
  }

  const { width, height, mainSeed, renderSvg } = options;

  // Swap Math.random for a seeded rng
  setMainSeed(mainSeed);

  // --------- SVG
  svgElement.style.display = renderSvg ? 'block' : 'none';
  svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);

  let svgContent = '';

  // --------- P5
  // Destroy p5 sketch
  if (sketchInstance) {
    sketchInstance.remove();
  }

  sketchInstance = new p5constructor((p5) => {
    window.p5 = p5;

    let particles;
    svgElement.innerHTML = '';

    if (renderSvg) {
      svgSketchWrapperElement.style.display = 'block';
    } else {
      svgSketchWrapperElement.style.display = 'none';
    }

    p5.setup = () => {
      p5.createCanvas(width, height);

      particles = prepare(options);
    };

    p5.draw = () => {
      p5.noFill();
      p5.noStroke();

      if (p5.frameCount > options.maxLength) {
        svgContent = '';
        let circles = '';

        particles.forEach((p) => {
          circles += p.draw(true);
          svgContent += getSvgPolygon(p.polygon, p.color);
        });

        svgContent += circles;

        p5.noLoop();

        if (renderSvg) {
          svgElement.innerHTML = svgContent;
        }
      } else {
        particles.forEach((p) => {
          p.draw();
          // svgContent += p.draw();
          p.move();
        });
      }
    };
  }, sketchWrapperElement);
}
