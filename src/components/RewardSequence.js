import './RewardSequence.css';
import React, { Component } from 'react';
import { bind, noop } from 'lodash';
import { bemClasses, onTransitionEnd, prefixProperty, delay } from '../utils';

const initialState = {
  isShowing: false,
  rewardId: null,
  displayName: null,
  onCupClick: null,
  isDone: false,
  showMessage: false,
  cupX: -200,
  cupZ: 4.5,
  liquidY: 0,
  liquidHeight: 20
};
const bem = bemClasses('RewardSequence');
const cupTransitionDuration = 800;
const liquidTransitionDuration = 1250;
const messageTransitionDuration = 1000;
const liquidFallDistance = 10;
const cupZoomTo = 45;
const transition = prefixProperty('transition');
const transform = prefixProperty('transform');
const transformKebab = prefixProperty('transform', true);

export default class extends Component {
  state = initialState

  render() {
    const isShowing = this.state.isShowing;
    const rewardId = this.state.rewardId;
    const showMessage = this.state.showMessage;
    const modifier = this.state.isDone ? 'done' : isShowing ? 'show' : null;

    return <div className={bem(null, modifier)}>
      <div
        className={bem('liquid', rewardId)}
        style={{
          [transform]: `translateY(${this.state.liquidY}em)`,
          [transition]: `${transformKebab} ${liquidTransitionDuration}ms, height ${liquidTransitionDuration}ms`,
          height: `${this.state.liquidHeight}em`
        }}
        ref='liquid'
      />
      <div
        className={bem('cup', rewardId)}
        style={{
          [transform]: `translateX(${this.state.cupX}em) translateZ(${this.state.cupZ}em)`,
          [transition]: `${transformKebab} ${cupTransitionDuration}ms`
        }}
        onClick={bind(this.state.onCupClick || noop, this)}
        ref='cup'
      >
        <div className={bem('cup-handle')}/>
      </div>
      <div className={bem('message')}>
        <span
            className={bem('message-text')}
            style={{
              [transition]: `opacity ${messageTransitionDuration}ms`,
              opacity: showMessage ? '1' : '0.1'
            }}
            ref='message'
          >
          {showMessage ? `enjoy a ${this.state.displayName}` : ''}
        </span>
      </div>
    </div>;
  }

  async show({rewardId, displayName}) {
    this.setState({ isShowing: true, rewardId, displayName });
    await delay(50);
    await this._placeCup();
    await this._pour();
    await this._zoomCup();
    await this._showMessage();
    return await this._waitForCupClick();
  }

  async _placeCup() {
    this.setState({ cupX: 0 });
    return await onTransitionEnd(this.refs.cup, cupTransitionDuration);
  }

  async _pour() {
    const liquid = this.refs.liquid;
    this.setState({ liquidY: liquidFallDistance });
    await onTransitionEnd(liquid, liquidTransitionDuration);
    await delay(1000);
    this.setState({
      liquidHeight: 0,
      liquidY: liquidFallDistance + initialState.liquidHeight
    });
    return await onTransitionEnd(liquid, liquidTransitionDuration);
  }

  async _zoomCup() {
    this.setState({ cupZ: cupZoomTo });
    return await onTransitionEnd(this.refs.cup, cupTransitionDuration);
  }

  async _showMessage() {
    this.setState({ showMessage: true });
    return await onTransitionEnd(this.refs.message, messageTransitionDuration);
  }

  async _waitForCupClick() {
    return await new Promise(resolve =>
      this.setState({
        isDone: true,
        onCupClick: () => {
          this.setState(initialState);
          resolve();
        }
      })
    );
  }
}
