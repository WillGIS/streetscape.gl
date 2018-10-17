// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/* global document */
/* eslint-disable no-console */
import 'xviz-config';

import React, {PureComponent} from 'react';
import {render} from 'react-dom';

import {
  XVIZFileLoader,
  LogViewer,
  PlaybackControl,
  StreamSettingsPanel,
  // XvizPanel,
  // VideoPanel,
  VIEW_MODES
} from 'streetscape.gl';
// import {Form} from 'monochrome-ui';

import {MAPBOX_TOKEN, MAP_STYLE, XVIZ_STYLE, CAR} from './constants';

import './main.scss';

class Example extends PureComponent {
  state = {
    log: new XVIZFileLoader({
      numberOfFrames: 155,
      getFilePath: index => `/kitti/2011_09_26/2011_09_26_drive_0005_sync/${index + 1}-frame.glb`,
      worker: require.resolve('./stream-data-worker'),
      maxConcurrency: 4
    }).on('error', console.error), // eslint-disable-line

    settings: {
      viewMode: 'PERSPECTIVE'
    }
  };

  componentDidMount() {
    this.state.log.connect();
  }

  _onSettingsChange = changedSettings => {
    this.setState({
      settings: {...this.state.settings, ...changedSettings}
    });
  };

  render() {
    const {log, settings} = this.state;

    return (
      <div id="container">
        <div id="map-view">
          <LogViewer
            log={log}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            mapStyle={MAP_STYLE}
            car={CAR}
            xvizStyles={XVIZ_STYLE}
            viewMode={VIEW_MODES[settings.viewMode]}
          />
        </div>
        <div id="timeline">
          <PlaybackControl
            width="100%"
            log={log}
            formatTimestamp={x => new Date(x).toUTCString()}
          />
        </div>
        <div id="control-panel">
          <StreamSettingsPanel log={log} />
        </div>
      </div>
    );
  }
}

const root = document.createElement('div');
document.body.appendChild(root);

render(<Example />, root);