import { assign, map, find, result, bind } from 'lodash';
import Chance from 'chance';

// example symbols -- can be anything, and of any type
// const [Bar, Cherry, Seven] = ['bar', 'cherry', 'seven'];

export default class SlotMachine {
  reels = [
    // example reels
    // { symbols: [Bar, Cherry, Seven] },
    // { symbols: [Bar, Cherry, Seven] },
    // { symbols: [Bar, Cherry, Seven] }
  ]

  payouts = [
    // example payouts
    // { reward: '$1', symbols: [Cherry, Cherry, Seven] },
    // { reward: '$10', symbols: [Cherry, Seven, Seven] },
    // { reward: '$100', symbols: [Cherry, Cherry, Cherry] },
    // { reward: '$1000', symbols: [Seven, Seven, Seven] }
  ]

  currentPayline = [
    // example payline
    // Bar, Bar, Bar
  ]

  seed = undefined

  pullLever() {
    this.currentPayline = map(this.reels, reel => this._sample(reel.symbols));
    return this;
  }

  isCurrentlyWinning() {
    return this.getCurrentReward() !== undefined;
  }

  // returns 'undefined' if no reward
  getCurrentReward() {
    const currentPayline = this.currentPayline;

    return result(
      find(this.payouts, payout =>
        payout.symbols.every((symbol, i) => currentPayline[i] === symbol)
      ),
      'reward'
    );
  }

  _sample = null

  constructor(options) {
    assign(this, options);

    const seed = this.seed;
    const chance = seed === undefined ?
      new Chance() :
      new Chance(seed);

    this._sample = bind(chance.pick, chance);
  }
}
