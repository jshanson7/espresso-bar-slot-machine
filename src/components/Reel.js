import './Reel.css';
import React, { Component } from 'react';
import { debounce, bind, map } from 'lodash';
import {
  bemClasses,
  prefixProperty,
  onTransitionEnd,
  delay,
  eventsForElement
} from '../utils';
import Symbol from './Symbol';

const bem = bemClasses('Reel');
const transition = prefixProperty('transition');
const transform = prefixProperty('transform');
const transformKebab = prefixProperty('transform', true);
const { on, off } = eventsForElement(window);

export default class extends Component {
  static defaultProps = {
    symbols: [],
    defaultSpinDelay: 0,
    defaultNumberOfRotations: 10,
    spinDuration: 4000,
    initialSymbol: null
  }

  state = {
    height: 115,
    currentRotationIndex: 0,
    isSpinning: false
  }

  render() {
    const symbolCount = this.props.symbols.length;
    const degreesBetween = 360 / symbolCount;
    const height = this.state.height;
    const radius = Math.round((height / 2) / Math.tan(Math.PI / symbolCount)) * 1.8;

    return <div className={bem()} {...this.props} ref='wrapper'>
      <ul
        className={bem('symbols')}
        style={{
          [transform]: `rotateX(-${this.state.currentRotationIndex * degreesBetween}deg)`,
          [transition]: `${transformKebab} ${this.props.spinDuration}ms cubic-bezier(.45,-0.2,.53,1.1)`
        }}
        ref='symbols'
      >{
        map(this.props.symbols, (symbol, i) =>
          <li
            className={bem('symbol-wrapper')}
            key={i}
            style={{
              [transform]: `rotateX(${i * degreesBetween}deg) translateZ(${radius}px)`
            }}>
            <Symbol
              image={symbol.image}
              displayName={symbol.displayName}
            />
          </li>
        )
      }</ul>
    </div>;
  }

  async spinTo({symbol, spinDelay, numberOfRotations}) {
    if (this.state.isSpinning) { return false; }

    const rotations = numberOfRotations || this.props.defaultNumberOfRotations;
    const symbolIndex = this.props.symbols.indexOf(symbol);
    const currentRotationIndex = this.state.currentRotationIndex;
    const numberOfSymbols = this.props.symbols.length;
    const currentSymbolIndex = currentRotationIndex % numberOfSymbols;
    const diff = symbolIndex - currentSymbolIndex;
    const newRotationIndex = currentRotationIndex + (rotations * numberOfSymbols) + diff;

    this.setState({ isSpinning: true });
    await delay(spinDelay || this.props.defaultSpinDelay);
    this.setState({ currentRotationIndex: newRotationIndex });
    await onTransitionEnd(this.refs.symbols, this.props.spinDuration);
    this.setState({ isSpinning: false });

    return true;
  }

  componentWillMount() {
    if (this.props.initialSymbol) {
      this.setState({ currentRotationIndex: this.props.symbols.indexOf(this.props.initialSymbol) });
    }
  }

  componentDidMount() {
    this._onResize = debounce(bind(this._onResize, this), 200);
    this._onResize();
    on('resize', this._onResize);
  }

  componentWillUnmount() {
    off('resize', this._onResize);
  }

  _onResize() {
    const height = this.refs.wrapper.offsetHeight;
    this.setState({height});
  }
}
