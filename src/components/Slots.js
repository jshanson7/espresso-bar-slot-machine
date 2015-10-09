import './Slots.css';
import React, { Component } from 'react';
import { map, debounce, bind, zip } from 'lodash';
import { bemClasses, eventsForElement } from '../utils';
import Reel from './Reel';

const bem = bemClasses('Slots');
const { on, off } = eventsForElement(window);

export default class extends Component {
  static defaultProps = {
    reels: [],
    initialPayline: [],
    delayBetweenSpins: 175
  }

  render() {
    const initialPayline = this.props.initialPayline;
    return <div className={bem()}>
      <div className={bem('reels-wrapper')} ref='wrapper'>
        <ul className={bem('reels')}>{
          map(this.props.reels, (reel, i) =>
            <Reel
              key={i}
              symbols={reel.symbols}
              initialSymbol={initialPayline[i]}
              ref={c => reel.component = c}
              />
          )
        }</ul>
        <div className={bem('slots-glass')}></div>
      </div>
    </div>;
  }

  async spinToPayline(payline) {
    const reels = this.props.reels;
    const delay = this.props.delayBetweenSpins;
    return await* map(zip(payline, reels), ([symbol, reel], i) =>
      reel.component.spinTo({symbol, spinDelay: i * delay})
    );
  }

  componentDidMount() {
    this._onResize();
    this._onResize = debounce(bind(this._onResize, this), 100);
    on('resize', this._onResize);
  }

  componentWillUnmount() {
    off('resize', this._onResize);
  }

  _onResize() {
    // hack -- trick safari into rendering overflow correctly
    const wrapper = this.refs.wrapper;
    wrapper.style.overflow = 'visible';
    wrapper.style.overflow = 'hidden';
  }

}
