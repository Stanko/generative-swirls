import {
  knobDefaultValues,
  knobParsers,
  knobRandomValueGenerators,
  knobInputGenerator,
  knobTypes,
} from './constants';
import generateRandomString from '../utils/generate-random-string';

import KNOBS from '../drawing/knobs';

const defaultValues = {};
const knobInputs = {};

KNOBS.forEach((knob) => {
  const hasUserDefaultValue = typeof knob.default !== 'undefined';

  defaultValues[knob.name] = hasUserDefaultValue
    ? knob.default
    : knobDefaultValues[knob.type](knob);
});

function getStateFromHash() {
  const params = window.location.hash.replace('#', '').split('/');
  params.shift();

  const state = {};

  if (params.length !== KNOBS.length) {
    // Hash is invalid
    return null;
  }

  for (let index = 0; index < KNOBS.length; index++) {
    const knob = KNOBS[index];
    const key = knob.name;
    const value = params[index];

    const hasValue = typeof value !== 'undefined';
    const parser = knobParsers[knob.type];

    if (hasValue) {
      state[key] = parser ? parser(value) : value;
    } else {
      // Hash is invalid
      return null;
    }
  }

  return state;
}

function setHash(hashState = {}) {
  window.location.hash = KNOBS.reduce((hash, item) => {
    const key = item.name;
    return (hash += `/${hashState[key]}`);
  }, '');
};

function buildUI() {
  const container = document.querySelector('.knobs');
  const currentValues = getStateFromHash();

  function handler(name, value) {
    const newValues = getStateFromHash();
    newValues[name] = value;
    
    setHash(newValues);
  }

  KNOBS.forEach(knob => {
    const input = knobInputGenerator[knob.type](knob, currentValues[knob.name], handler);
    knobInputs[knob.name] = input;

    const knobElement = document.createElement('div');
    knobElement.className = 'knob';
    const label = document.createElement('label');
    label.innerHTML = knob.name;

    label.appendChild(input);
    knobElement.appendChild(label);

    if (knob.type === knobTypes.SEED) {
      const reloadButton = document.createElement('button');
      reloadButton.innerHTML += '↻';
      reloadButton.addEventListener('click', () => handler(knob.name, generateRandomString()));
      
      knobElement.appendChild(reloadButton);
    }

    container.appendChild(knobElement);
  });
}

function updateUI() {
  const currentValues = getStateFromHash();

  Object.keys(knobInputs).forEach(key => {
    const input = knobInputs[key];
    const value = currentValues[key];
    
    if (input.type === 'checkbox') {
      input.checked = value;
    } if (input.className === 'radio-options') {
      document.querySelector(`input[name=${ key }][value=${ value }]`).checked = true;
    } else {
      input.value = value;  
    }
  });
}



export function randomize() {
  const randomValues = {};
  const currentValues = getStateFromHash();

  KNOBS.forEach((knob) => {
    if (!knob.disableRandomization) {
      randomValues[knob.name] = knobRandomValueGenerators[knob.type](knob);
    } else {
      randomValues[knob.name] = currentValues[knob.name];
    }
  });

  setHash(randomValues);
}

export default function knobs(callback) {
  const state = getStateFromHash();
  const isValidHash = state !== null;

  const options = {
    ...defaultValues,
    ...state,
  };

  if (isValidHash) {
    callback(options);
  } else {
    setHash(options);
  }

  buildUI();

  window.addEventListener('hashchange', () => {
    const state = getStateFromHash();
  
    const options = {
      ...defaultValues,
      ...state,
    };

    updateUI();

    callback(options);
  });
}
