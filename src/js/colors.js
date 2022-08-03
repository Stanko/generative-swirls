import { rgbToHsluv } from 'hsluv';

function rgb(r, g, b) {
  return rgbToHsluv([r / 255, g / 255, b / 255]);
}

export function generateRandomColor() {
  let h = parseInt((fxrand() * 360 + 220) % 360, 10);
  let s = Math.round(fxrand() * 20) + 60;
  let l = Math.round(fxrand() * 30) + 40;

  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return [255 * f(0), 255 * f(8), 255 * f(4)];
}

const palettes = [
  [
    // --- https://colorpalettes.net/color-palette-4519/
    rgb(229, 142, 0),
    rgb(255, 188, 3),
    rgb(39, 175, 201),
    rgb(176, 166, 165),
    rgb(109, 92, 85),
  ],
  [
    // --- https://colorhunt.co/palette/5132527a4069ca4e79ffc18e
    rgb(81, 50, 82),
    rgb(122, 64, 105),
    rgb(202, 78, 121),
    rgb(255, 193, 142),
  ],
  [
    // --- Original
    // blue
    rgb(3, 43, 67),
    rgb(40, 100, 147),
    rgb(170, 202, 228),
    // yellow
    rgb(254, 184, 8),
    // red
    rgb(193, 3, 5),
    // orange
    rgb(229, 85, 4),
  ],
  [
    // amber
    rgb(255, 190, 11),
    // orange-pantone
    rgb(251, 86, 7),
    // winter-sky
    rgb(255, 0, 110),
    // blue-violet
    rgb(131, 56, 236),
    // azure
    rgb(58, 134, 255),
  ],
  [
    // red-salsa
    rgb(249, 65, 68),
    // orange-red
    rgb(243, 114, 44),
    // yellow-orange-color-wheel
    rgb(248, 150, 30),
    // mango-tango
    rgb(249, 132, 74),
    // maize-crayola
    rgb(249, 199, 79),
    // pistachio
    rgb(144, 190, 109),
    // jungle-green
    rgb(67, 170, 139),
    // steel-teal
    rgb(77, 144, 142),
    // queen-blue
    rgb(87, 117, 144),
    // celadon-blue
    rgb(39, 125, 161),
  ],
  [
    // xiketic
    rgb(3, 7, 30),
    // dark-sienna
    rgb(55, 6, 23),
    // rosewood
    rgb(106, 4, 15),
    // dark-red
    rgb(157, 2, 8),
    // rosso-corsa
    rgb(208, 0, 0),
    // vermilion
    rgb(220, 47, 2),
    // persimmon
    rgb(232, 93, 4),
    // tangerine
    rgb(244, 140, 6),
    // orange-web
    rgb(250, 163, 7),
    // selective-yellow
    rgb(255, 186, 8),
  ],
  [
    // french-violet
    rgb(111, 45, 189),
    // amethyst
    rgb(166, 99, 204),
    // wisteria
    rgb(178, 152, 220),
    // light-steel-blue
    rgb(184, 208, 235),
    // celeste
    rgb(185, 250, 248),
  ],
  [
    // blue-sapphire
    rgb(5, 102, 141),
    // metallic-seaweed
    rgb(2, 128, 144),
    // persian-green
    rgb(0, 168, 150),
    // mountain-meadow
    rgb(2, 195, 154),
    // pale-spring-bu:
    rgb(240, 243, 189),
  ],
  [
    // y-in-mn-blue:
    rgb(53, 80, 112),
    // chinese-violet:
    rgb(109, 89, 122),
    // cinnamon-satin:
    rgb(181, 101, 118),
    // candy-pink:
    rgb(229, 107, 111),
    // tumbleweed:
    rgb(234, 172, 139),
  ],
  [
    rgb(...generateRandomColor()),
    rgb(...generateRandomColor()),
    rgb(...generateRandomColor()),
    rgb(...generateRandomColor()),
    rgb(...generateRandomColor()),
  ],
];

const paletteIndex = Math.floor((fxrand() * palettes.length) % palettes.length);

let p = paletteIndex;

if (paletteIndex === palettes.length - 1) {
  p = 'random';
}

window.$fxhashFeatures = window.$fxhashFeatures || {};

window.$fxhashFeatures.palette = p;

export default palettes[paletteIndex];
