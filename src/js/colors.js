import { rgbToHsluv } from 'hsluv';

function rgb(r, g, b) {
  return rgbToHsluv([r / 255, g / 255, b / 255]);
}


const colors = [
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
];

export default colors;