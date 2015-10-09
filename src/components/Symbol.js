import './Symbol.css';
import React, { Component } from 'react';
import bemClasses from '../utils/bemClasses';

const bem = bemClasses('Symbol');

export default class extends Component {
  static defaultProps = {
    image: '',
    displayName: ''
  }

  render() {
    return <img className={bem()} src={`${this.props.image}`}></img>;
  }
}
