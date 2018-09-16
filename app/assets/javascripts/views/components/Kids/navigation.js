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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import selectn from 'selectn';

import ConfGlobal from 'conf/local.json';

import provide from 'react-redux-provide';

import ProviderHelpers from 'common/ProviderHelpers';
import NavigationHelpers from 'common/NavigationHelpers';

import AppBar from '@material-ui/core/AppBar';

import Avatar from '@material-ui/core/Avatar';
import IconMenu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import HomeIcon from '@material-ui/icons/Home';
import AppsIcon from '@material-ui/icons/Apps';
import ClearIcon from '@material-ui/icons/Clear';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import NotificationsIcon from '@material-ui/icons/Notifications';

import Login from 'views/components/Navigation/Login';
import AppLeftNav from 'views/components/Navigation/AppLeftNav';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
@provide
export default class Navigation extends Component {

    static propTypes = {
        pushWindowPath: PropTypes.func.isRequired,
        replaceWindowPath: PropTypes.func.isRequired,
        splitWindowPath: PropTypes.array.isRequired,
        toggleMenuAction: PropTypes.func.isRequired,
        fetchUserTasks: PropTypes.func.isRequired,
        properties: PropTypes.object.isRequired,
        computeLogin: PropTypes.object.isRequired,
        computeUserTasks: PropTypes.object.isRequired,
        computePortal: PropTypes.object,
        routeParams: PropTypes.object,
        frontpage: PropTypes.bool
    };

    /*static childContextTypes = {
      client: PropTypes.object,
      muiTheme: PropTypes.object,
      siteProps: PropTypes.object
    };

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
        siteProps: PropTypes.object.isRequired
    };

    getChildContext() {
      return {
        //client: this.props.clientStore.client,
        muiTheme: this.context.muiTheme,
        siteProps: this.context.siteProps
      };
    }*/

    constructor(props, context) {
        super(props, context);

        this.state = {
            hintTextSearch: intl.trans('search_site', 'Search Site', 'words') + ":"
        };

        this._handleMenuToggle = this._handleMenuToggle.bind(this);
        this.handleChangeRequestLeftNav = this.handleChangeRequestLeftNav.bind(this);
        this.handleRequestChangeList = this.handleRequestChangeList.bind(this);
        this._handleNavigationSearchSubmit = this._handleNavigationSearchSubmit.bind(this);
        //this._test = this._test.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.computeLogin != this.props.computeLogin) {
            this.props.fetchUserTasks(selectn('response.id', newProps.computeLogin));
        }
    }

    _handleMenuToggle(event) {
        //console.log(event);

        //const test = this.props.toggle("helloworld");
        //console.log(test);

        /*this.setState({
          leftNavOpen: !this.state.leftNavOpen,
        });*/
    }

    _onNavigateRequest(path) {
        this.props.pushWindowPath(path);
    }

    handleChangeRequestLeftNav(open) {
        console.log('ok2!');
        this.setState({
            leftNavOpen: open,
        });
    }

    handleRequestChangeList(event, value) {
        console.log('ok!');
        //this.context.router.push(value);
        this.setState({
            leftNavOpen: false,
        });
    }

    _handleNavigationSearchSubmit() {
        let searchQueryParam = this.refs.navigationSearchField.getValue();
        let path = "/" + this.props.splitWindowPath.join("/");
        let queryPath = "";

        // Do a global search in either the workspace or section
        if (path.includes("/explore/FV/Workspaces/Data")) {
            queryPath = "/explore/FV/Workspaces/Data"
        }
        else if (path.includes("/explore/FV/sections/Data")) {
            queryPath = "/explore/FV/sections/Data"
        }
        else {
            queryPath = "/explore/FV/sections/Data"
        }

        // Clear out the input field
        this.refs.navigationSearchField.setValue("");
        this.props.replaceWindowPath(queryPath + '/search/' + searchQueryParam);
    }

    render() {

        const computeUserTasks = ProviderHelpers.getEntry(this.props.computeUserTasks, selectn('response.id', this.props.computeLogin));
        const computePortal = ProviderHelpers.getEntry(this.props.computePortal, this.props.routeParams.dialect_path + '/Portal');

        const userTaskCount = selectn('response.length', computeUserTasks) || 0;

        let portalLogo = selectn('response.contextParameters.portal.fv-portal:logo.path', computePortal);

        const avatar = (portalLogo) ?
            <Avatar src={ConfGlobal.baseURL + portalLogo} size={50} style={{marginRight: '10px'}}/> : '';

        return <div>
            <AppBar
                position="static"
                iconClassNameRight="muidocs-icon-navigation-expand-more"
                showMenuIconButton={false}
                onRightIconButtonClick={() => this.props.toggleMenuAction("AppLeftNav")}>

                <Toolbar style={{alignItems: 'center', backgroundColor:'inherit'}}>
                    <Typography variant="title" noWrap style={{flexGrow: 1}}>
                        <a style={{textDecoration: 'none', color: '#fff'}}
                            onClick={this._onNavigateRequest.bind(this, (!this.props.routeParams.dialect_path) ? '/kids' : '/kids' + this.props.routeParams.dialect_path)}>
                            {avatar}
                    <span
                        className="hidden-xs">{(selectn('response.contextParameters.ancestry.dialect.dc:title', computePortal) || this.props.properties.title) + ' ' + intl.trans('views.pages.explore.dialect.for_kids', 'for Kids')}
                        </span></a>
                    </Typography>
                    <Tooltip title={intl.trans('back', 'Back', 'first')} placement="bottem-end">
                        <IconButton className={classNames({'hidden': this.props.frontpage})}
                                    onClick={(e) => NavigationHelpers.navigateBack()}
                                    tooltipPosition="bottom-left"
                                    >
                            <KeyboardBackspaceIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={intl.trans('home', 'Home', 'first')} placement="bottom-end">
                        <IconButton
                            onClick={this._onNavigateRequest.bind(this, '/kids' + (this.props.routeParams.dialect_path ? this.props.routeParams.dialect_path : ''))}
                            >
                            <HomeIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={intl.trans('choose_lang', 'Choose a Language', 'first')} placement="bottom-end">
                        <IconButton onClick={this._onNavigateRequest.bind(this, '/kids/FV/Workspaces/Data')}
                                    >
                                <AppsIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={intl.trans('back_to_main_site', 'Back to Main Site', 'words')} placment="bottom-end">
                        <IconButton onClick={this._onNavigateRequest.bind(this, '/')}
                                    >
                                <ClearIcon />
                        </IconButton>
                    </Tooltip>
                    
                </Toolbar>

            </AppBar>
        </div>;
    }
}
