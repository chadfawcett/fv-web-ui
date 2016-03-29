/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, { Component, PropTypes } from 'react';
import provide from 'react-redux-provide';

import AppFrontController from './AppFrontController';

// Components & Themes
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import ThemeDecorator from 'material-ui/lib/styles/theme-decorator';

import FirstVoicesTheme from 'views/themes/FirstVoicesTheme.js';
import Navigation from 'views/components/Navigation';
import Footer from 'views/components/Navigation/Footer';

@ThemeDecorator(ThemeManager.getMuiTheme(FirstVoicesTheme))
@provide
export default class AppWrapper extends Component {

  static propTypes = {
    connect: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired
  };

  static childContextTypes = {
    muiTheme: React.PropTypes.object
  };

  /**
  * Pass essential context to all children
  */
  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(FirstVoicesTheme)
    };
  }

  constructor(props, context) {
    super(props, context);

    // Connect to Nuxeo
    this.props.connect();
    this.props.getUser();
  }

  render() {
    return <div>
      <Navigation />
      <div className="main">
        <AppFrontController />
      </div>
      <Footer />
    </div>;
  }
}