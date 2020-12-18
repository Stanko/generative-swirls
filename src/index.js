import knobs, { randomize } from './knobs';
import drawing from './drawing/index'


function main(options) {
  console.log(options);
  drawing(options);
}

knobs(main);

document.querySelector('.randomize').addEventListener('click', randomize);