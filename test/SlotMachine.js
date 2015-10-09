import assert from 'assert';
import { isEqual } from 'lodash';
import SlotMachine from '../src/models/SlotMachine';

const [Bar, Cherry, Seven] = ['bar', 'cherry', 'seven'];
const seed = 1;
const makeSlotMachine = () => new SlotMachine({
  seed,
  reels: [
    { symbols: [Bar, Cherry, Seven] },
    { symbols: [Bar, Cherry, Seven] },
    { symbols: [Bar, Cherry, Seven] }
  ],
  payouts: [
    { reward: '$1', symbols: [Cherry, Cherry, Seven] },
    { reward: '$10', symbols: [Cherry, Seven, Seven] },
    { reward: '$100', symbols: [Cherry, Cherry, Cherry] },
    { reward: '$1000', symbols: [Seven, Seven, Seven] }
  ],
  currentPayline: [Bar, Bar, Bar]
});

describe('SlotMachine', () => {
  describe('#isCurrentlyWinning()', () => {
    const slotMachine = makeSlotMachine();
    it('should be winning when payline matches a payout', () => {
      slotMachine.currentPayline = [Seven, Seven, Seven];
      assert(slotMachine.isCurrentlyWinning());
    });
    it('should not be winning when payline does not match a payout', () => {
      slotMachine.currentPayline = [Seven, Seven, Bar];
      assert(!slotMachine.isCurrentlyWinning());
    });
  });

  describe('#getCurrentReward()', () => {
    const slotMachine = makeSlotMachine();
    it('gets correct reward', () => {
      slotMachine.currentPayline = [Seven, Seven, Seven];
      assert(slotMachine.getCurrentReward() === '$1000');
      slotMachine.currentPayline = [Seven, Bar, Seven];
      assert(slotMachine.getCurrentReward() === undefined);
    });
  });

  describe('#pullLever()', () => {
    it('sets the payline', () => {
      const slotMachine = makeSlotMachine();
      slotMachine.currentPayline = [];
      slotMachine.pullLever();
      assert(slotMachine.currentPayline.length === slotMachine.reels.length);
    });
    it('randomly changes the payline', () => {
      const slotMachine = makeSlotMachine();
      // pre-tested results from a seed of '1'
      assert(isEqual(slotMachine.pullLever().currentPayline, [Cherry, Seven, Seven]));
      assert(isEqual(slotMachine.pullLever().currentPayline, [Seven, Bar, Bar]));
      assert(isEqual(slotMachine.pullLever().currentPayline, [Bar, Seven, Bar]));
    });
  });
});
