import './Lever.css';
import React, { Component } from 'react';
import { noop } from 'lodash';
import { bemClasses, prefixProperty, onTransitionEnd } from '../utils';

const bem = bemClasses('Lever');
const pullDuration = 2000;
const pullAngle = 75;
const transition = prefixProperty('transition');
const transform = prefixProperty('transform');
const transformKebab = prefixProperty('transform', true);

export default class extends Component {
  static defaultProps = {
    onClick: noop
  }

  state = {
    isPulling: false,
    currentAngle: 0
  }

  render() {
    const currentAngle = this.state.currentAngle;
    const isPullingDown = currentAngle !== 0;

    return <div className={bem()} onClick={this.props.onClick}>
      <div className={bem('base-arm')}/>
      <div className={bem('joint')}/>
      <div
        className={bem('forearm')}
        ref='forearm'
        style={{
          [transform]: `
            rotateZ(18deg)
            rotateX(-${currentAngle}deg)
            translateX(${isPullingDown ? 0.3 : 0}em)
            translateY(${isPullingDown ? 1 : 0}em)
            translateZ(${isPullingDown ? 1 : 0}em)
          `,
          [transition]: `${transformKebab} ${pullDuration / 2}ms linear`
        }}>
        <div
          className={bem('handle')}
          ref='handle'
          style={{
            [transform]: `rotateX(${currentAngle}deg) translateZ(0.3125em)`,
            [transition]: `${transformKebab} ${pullDuration / 2}ms linear`
          }}
        />
      </div>
    </div>;
  }

  async pull() {
    if (this.state.isPulling) { return false; }

    const halfDuration = (pullDuration) / 2;
    const handle = this.refs.handle;

    this.setState({ isPulling: true, currentAngle: pullAngle });
    await onTransitionEnd(handle, halfDuration);
    this.setState({ currentAngle: 0 });
    await onTransitionEnd(handle, halfDuration);
    this.setState({ isPulling: false });
    return true;
  }
}
