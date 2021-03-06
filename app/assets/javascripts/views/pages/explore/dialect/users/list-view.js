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
import Immutable, {List, Map} from 'immutable';
import classNames from 'classnames';
import provide from 'react-redux-provide';
import selectn from 'selectn';

import PromiseWrapper from 'views/components/Document/PromiseWrapper';

import ProviderHelpers from 'common/ProviderHelpers';
import UIHelpers from 'common/UIHelpers';

import DocumentListView from 'views/components/Document/DocumentListView';

import DataListView from 'views/pages/explore/dialect/learn/base/data-list-view';

import Preview from 'views/components/Editor/Preview';

import GroupAssignmentDialog from 'views/pages/users/group-assignment-dialog';

import withFilter from 'views/hoc/grid-list/with-filter';
import IntlService from 'views/services/intl';

const intl = IntlService.instance;
const DefaultFetcherParams = {filters: {'properties.dc:title': '', 'dialect': ''}};

const FilteredPaginatedMediaList = withFilter(DocumentListView, DefaultFetcherParams);


/**
 * List view for users
 */
@provide
export default class ListView extends DataListView {

    static defaultProps = {
        DISABLED_SORT_COLS: ['state'],
        DEFAULT_PAGE: 1,
        DEFAULT_PAGE_SIZE: 100000,
        DEFAULT_LANGUAGE: 'english',
        DEFAULT_SORT_COL: 'fv:custom_order',
        DEFAULT_SORT_TYPE: 'asc',
        filter: new Map(),
        dialect: null,
        gridListView: false
    }

    static propTypes = {
        properties: PropTypes.object.isRequired,
        windowPath: PropTypes.string.isRequired,
        splitWindowPath: PropTypes.array.isRequired,
        pushWindowPath: PropTypes.func.isRequired,
        computeLogin: PropTypes.object.isRequired,
        fetchDialect2: PropTypes.func.isRequired,
        computeDialect2: PropTypes.object.isRequired,
        dialect: PropTypes.object,
        fetchUser: PropTypes.func.isRequired,
        updateUser: PropTypes.func.isRequired,
        computeUser: PropTypes.object.isRequired,
        userSuggestion: PropTypes.func.isRequired,
        computeUserSuggestion: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired,
        filter: PropTypes.object,
        data: PropTypes.string,
        gridListView: PropTypes.bool,

        DISABLED_SORT_COLS: PropTypes.array,
        DEFAULT_PAGE: PropTypes.number,
        DEFAULT_PAGE_SIZE: PropTypes.number,
        DEFAULT_SORT_COL: PropTypes.string,
        DEFAULT_SORT_TYPE: PropTypes.string
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            columns: [
                {
                    name: 'username',
                    title: intl.trans('views.pages.explore.dialect.users.username', 'Username', 'first')
                },
                {
                    name: 'firstName',
                    title: intl.trans('first_name', 'First Name', 'words')
                },
                {
                    name: 'lastName',
                    title: intl.trans('last_name', 'Last Name', 'words')
                },
                {name: 'email', title: intl.trans('email', 'Email', 'first')}
            ],
            sortInfo: {
                uiSortOrder: [],
                currentSortCols: this.props.DEFAULT_SORT_COL,
                currentSortType: this.props.DEFAULT_SORT_TYPE
            },
            pageInfo: {
                page: this.props.DEFAULT_PAGE,
                pageSize: this.props.DEFAULT_PAGE_SIZE
            },
            fixedCols: true,
            userDialogOpen: false,
            selectedUserName: null,
        };

        // Reduce the number of columns displayed for mobile
        if (UIHelpers.isViewSize('xs')) {
            this.state.columns = this.state.columns.filter((v, k) => ['username', 'email'].indexOf(v.name) != -1);
        }

        // Bind methods to 'this'
        ['_onNavigateRequest', '_onUserSelected', '_handleRefetch', '_handleSortChange', '_handleColumnOrderChange', '_resetColumns', '_handleClose', '_saveMethod', '_fetcher'].forEach((method => this[method] = this[method].bind(this)));
    }

    fetchData(newProps) {

        if (newProps.dialect == null && !this.getDialect(newProps)) {
            newProps.fetchDialect2(newProps.routeParams.dialect_path);
        }

        this._fetchListViewData(newProps, newProps.DEFAULT_PAGE, newProps.DEFAULT_PAGE_SIZE, newProps.DEFAULT_SORT_TYPE, newProps.DEFAULT_SORT_COL);
    }

    _onUserSelected(user) {
        this.props.fetchUser(user.username);
        this.setState({userDialogOpen: true, selectedUserName: user.username});
    }

    _handleClose() {
        this.setState({open: false, userDialogOpen: false, selectedUserName: null});
    }

    _saveMethod(properties, userObj) {

        let whoWhen = '[' + new Date().toLocaleString() + '] ' + selectn("response.properties.username", this.props.computeLogin);

        this.props.updateUser({
            'entity-type': 'user',
            'id': properties.id,
            'properties': {
                'groups': properties.group || [],
                'contributors': (selectn('properties.contributors', userObj) || '') + '\n' + whoWhen
            }
        }, null, intl.trans('views.pages.explore.dialect.users.user_updated_successfully', 'User updated successfully.', 'first'));

        this.setState({
            selectedUserName: null,
            userDialogOpen: false
        });
    }

    _fetchListViewData(props, pageIndex, pageSize, sortOrder, sortBy) {
        this._fetcher();
    }

    _fetcher(filters = {}) {
        this.props.userSuggestion(this.props.routeParams.dialect_path, {
            displayEmailInSuggestion: true,
            searchType: 'USER_TYPE',
            groupRestriction: selectn('filters.group.appliedFilter', filters) || '',
            hideAdminGroups: true,
            searchTerm: selectn('filters.searchTerm.appliedFilter', filters) || '',
        });
    }

    getDialect(props = this.props) {
        return ProviderHelpers.getEntry(props.computeDialect2, props.routeParams.dialect_path);
    }

    render() {

        const computeEntities = Immutable.fromJS([{
            'id': this.props.routeParams.dialect_path,
            'entity': this.props.computeUserSuggestion
        }, {
            'id': this.props.routeParams.dialect_path,
            'entity': this.props.computeDialect2
        }])

        const computeUserSuggestion = ProviderHelpers.getEntry(this.props.computeUserSuggestion, this.props.routeParams.dialect_path);
        const computeDialect2 = this.props.dialect || this.getDialect();
        const computeUser = ProviderHelpers.getEntry(this.props.computeUser, this.state.selectedUserName);

        let normalizedComputeUserSuggestion = {
            response: {
                entries: (selectn('response', computeUserSuggestion) || []).filter((user) => ['Administrator', 'Guest'].indexOf(user.username)),
                totalSize: selectn('response.length', computeUserSuggestion)
            }
        };

        return <PromiseWrapper hideFetch={true} renderOnError={true} computeEntities={computeEntities}>
            <FilteredPaginatedMediaList
                objectDescriptions="users"
                type="FVUser"
                filterOptionsKey="User"
                data={normalizedComputeUserSuggestion}
                gridListView={this.props.gridListView}
                refetcher={this._handleRefetch}
                onSortChange={this._handleSortChange}
                onSelectionChange={this._onUserSelected}
                page={this.state.pageInfo.page}
                pagination={false}
                fetcher={this._fetcher}
                pageSize={this.state.pageInfo.pageSize}
                onColumnOrderChange={this._handleColumnOrderChange}
                columns={this.state.columns}
                fixedCols={this.state.fixedCols}
                sortInfo={this.state.sortInfo.uiSortOrder}
                className="browseDataGrid"
                dialect={selectn('response', computeDialect2)}/>

            <GroupAssignmentDialog
                title={intl.trans('assign', 'Assign', 'first')}
                open={this.state.userDialogOpen}
                saveMethod={this._saveMethod}
                closeMethod={this._handleClose}
                fieldMapping={{
                    id: 'id',
                    title: 'properties.username',
                    groups: 'properties.groups'
                }}
                selectedItem={selectn('response', computeUser)}
                dialect={computeDialect2}/>

        </PromiseWrapper>
    }
}