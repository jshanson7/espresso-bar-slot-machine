import './EspressoMachine.css';
import React, { Component } from 'react';
import { defer } from 'lodash';
import { bemClasses } from '../utils';

const widthBasis = 570;
const heightBasis = 730;
const aspectRatio = widthBasis / heightBasis;
const bem = bemClasses('EspressoMachine');

export default class extends Component {
  static defaultProps = {
    panelContent: '',
    children: '',
    width: 570,
    height: 730
  }

  state = {
    prerendering: true
  }

  render() {
    const zoom = this._getZoomForDimensions(this.props.width, this.props.height);
    const fontSize = zoom + 'em';
    const modifier = this.state.prerendering ? 'prerender' : '';

    return <div className={bem(null, modifier)} style={{fontSize}}>
      <div className={bem('head-wrapper')}>
        <div className={bem('head')}>{this.props.panelContent}</div>
      </div>
      <div className={bem('body-wrapper')}>
        <div className={bem('body')}/>
      </div>
      <div className={bem('filter-spout-wrapper')}>
        <div className={bem('spout-wrapper')}>
          <div className={bem('spout')}/>
        </div>
        <div className={bem('filter-wrapper')}>
          <div className={bem('filter')}/>
        </div>
        <div className={bem('filter-handle-wrapper')}>
          <div className={bem('filter-handle')}/>
        </div>
      </div>
      <div className={bem('base-wrapper')}>
        <div className={bem('base')}>
          <div className={bem('base-metal-wrapper')}>
            <div className={bem('base-metal')}>
              <div className={bem('base-metal-overlay')}/>
            </div>
          </div>
        </div>
      </div>
      <div className={bem('children-wrapper')}>
        {this.props.children}
      </div>
    </div>;
  }

  componentDidMount() {
    defer(() => this.setState({ prerendering: false }));
  }

  _getZoomForDimensions(width, height) {
    return aspectRatio * height <= width ?
      // pillarbox
      height / heightBasis :
      // letterbox
      width / widthBasis;
  }
}
