import './EspressoBarSlotMachine.css';
import React, { Component } from 'react';
import { bind, debounce } from 'lodash';
import { bemClasses, eventsForElement } from '../utils';
import { reels, payouts, symbols } from '../constants';
import { EspressoMachine, Slots, Lever, RewardSequence } from './';
import SlotMachine from '../models/SlotMachine';

const { CoffeeMaker, TeaStrainer, GroundEspressoBeans } = symbols;
const initialPayline = [CoffeeMaker, TeaStrainer, GroundEspressoBeans];
const bem = bemClasses('EspressoBarSlotMachine');
const { on, off } = eventsForElement(window);

export default class extends Component {
  state = {
    isSpinning: false,
    isShowingReward: false,
    height: 730,
    width: 570
  }

  slotMachine = new SlotMachine({ reels, payouts, currentPayline: initialPayline })

  render() {
    const slots = <Slots reels={reels} initialPayline={initialPayline} ref={'slots'}/>;
    const dimensions = { width: this.state.width, height: this.state.height };
    const modifier = this.state.isSpinning ? 'spinning' :
      this.state.isShowingReward ? 'reward' :
      null;

    return <div className={bem(null, modifier)} ref='el'>
      <EspressoMachine panelContent={slots} {...dimensions}>
        <div className={bem('lever-wrapper')}>
          <Lever ref='lever' onClick={bind(this.pullLever, this)}/>
        </div>
        <div className={bem('reward-sequence-wrapper')}>
          <RewardSequence ref='rewardSequence'/>
        </div>
      </EspressoMachine>
    </div>;
  }

  async pullLever() {
    if (this._isBusy()) { return false; }
    const slotMachine = this.slotMachine;

    this.setState({ isSpinning: true });
    await* [
      this.refs.lever.pull(),
      this.refs.slots.spinToPayline(slotMachine.pullLever().currentPayline)
    ];
    this.setState({ isSpinning: false });

    return slotMachine.isCurrentlyWinning() ?
      await this.showReward(slotMachine.getCurrentReward()) :
      true;
  }

  async showReward(reward) {
    this.setState({ isShowingReward: true });
    await this.refs.rewardSequence.show(reward);
    this.setState({ isShowingReward: false });
    return true;
  }

  componentDidMount() {
    this._onResize();
    this._onResize = debounce(bind(this._onResize, this), 100);
    on('resize', this._onResize);
  }

  componentWillUnmount() {
    off('resize', this._onResize);
  }

  _isBusy() {
    return this.state.isSpinning || this.state.isShowingReward;
  }

  _onResize() {
    const el = this.refs.el;
    this.setState({
      width: el.offsetWidth,
      height: el.offsetHeight
    });
  }
}
