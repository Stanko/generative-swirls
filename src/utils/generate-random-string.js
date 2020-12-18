import randomWords from 'random-words';
import { originalRandom } from './set-main-seed';

export default function generateRandomString() {
  const index = Math.floor(originalRandom() * (randomWords.wordList.length - 1));
  return randomWords.wordList[index];
}
