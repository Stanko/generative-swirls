import generateRandomString from '../utils/generate-random-string';
import random from '../utils/random';

export const knobTypes = {
  BOOL: 'checkbox',
  RANGE: 'range',
  SEED: 'text',
  RADIO: 'radio',
};

export const knobDefaultValues = {
  [knobTypes.BOOL]: () => true,
  [knobTypes.SEED]: generateRandomString,
  [knobTypes.RANGE]: () => 0,
  [knobTypes.RADIO]: ({ options }) => options[0],
};

export const knobParsers = {
  [knobTypes.BOOL]: value => value === 'true',
  [knobTypes.RANGE]: value => parseFloat(value),
};

export const knobRandomValueGenerators = {
  [knobTypes.BOOL]: () => Math.random() > 0.5 ? true : false,
  [knobTypes.SEED]: generateRandomString,
  [knobTypes.RANGE]: ({ min, max, step = 1 }) => {
    const decimalPlaces = step % 1 === 0 ? 0 : 2;

    return random(min, max, null, decimalPlaces);
  },
  [knobTypes.RADIO]: ({ options }) => {
    const index = random(0, options.length - 1, null, 0);
    return options[index];
  },
};

export const knobInputGenerator = {
  [knobTypes.BOOL]: (knob, value, handler) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.checked = value;
    input.addEventListener('change', () => handler(knob.name, input.checked));

    return input;
  },
  [knobTypes.SEED]: (knob, value, handler) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('value', value);
    input.addEventListener('change', () => handler(knob.name, input.value));

    return input;
  },
  [knobTypes.RANGE]: (knob, value, handler) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'range');
    input.setAttribute('min', knob.min);
    input.setAttribute('max', knob.max);
    input.setAttribute('step', knob.step);
    input.setAttribute('value', value);
    input.addEventListener('change', () => handler(knob.name, input.value));

    return input;
  },
  [knobTypes.RADIO]: (knob, value, handler) => {
    const input = document.createElement('div');
    input.className = 'radio-options'

    knob.options.forEach((optionValue) => {
      const label = document.createElement('label');
      
      const span = document.createElement('span');
      span.innerHTML = optionValue;

      const radio = document.createElement('input');
      radio.setAttribute('type', 'radio');
      radio.setAttribute('name', knob.name);
      radio.setAttribute('value', optionValue);

      if (value === optionValue) {
        radio.setAttribute('checked', true);
      }

      radio.addEventListener('change', () => handler(knob.name, optionValue));

      label.appendChild(radio);
      label.appendChild(span);

      input.appendChild(label);
    });

    return input;
  },
};