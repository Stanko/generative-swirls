import {
  knobTypes,
} from '../knobs/constants';

const KNOBS = [
  {
    name: 'mainSeed',
    type: knobTypes.SEED,
  },
  {
    name: 'renderSvg',
    type: knobTypes.BOOL,
    default: false,
    disableRandomization: true,
  },
  {
    name: 'grayscale',
    type: knobTypes.BOOL,
    default: true,
    disableRandomization: true,
  },
  {
    name: 'colorSeed',
    type: knobTypes.SEED,
  },
  {
    name: 'colorRange',
    type: knobTypes.RANGE,
    min: 5,
    max: 100,
    step: 5,
    default: 30,
  },
  {
    name: 'width',
    type: knobTypes.RANGE,
    disableRandomization: true,
    min: 500,
    max: 2000,
    step: 50,
    default: 1000,
  },
  {
    name: 'height',
    type: knobTypes.RANGE,
    disableRandomization: true,
    min: 500,
    max: 2000,
    step: 50,
    default: 1000,
  },
  {
    name: 'minLength',
    type: knobTypes.RANGE,
    min: 10,
    max: 500,
    step: 1,
    default: 100,
  },
  {
    name: 'maxLength',
    type: knobTypes.RANGE,
    min: 10,
    max: 500,
    step: 1,
    default: 250,
  },
  {
    name: 'minStartingSize',
    type: knobTypes.RANGE,
    min: 1,
    max: 20,
    step: 1,
    default: 1,
  },
  {
    name: 'maxStartingSize',
    type: knobTypes.RANGE,
    min: 1,
    max: 50,
    step: 1,
    default: 10,
  },
  {
    name: 'lineDensity',
    type: knobTypes.RANGE,
    min: 0.05,
    max: 0.2,
    step: 0.01,
    default: 0.1,
  },
  {
    name: 'direction',
    type: knobTypes.RADIO,
    options: [
      'circular',
      'interlaced',
    ],
    default: 'interlaced',
  },
];

export default KNOBS;
