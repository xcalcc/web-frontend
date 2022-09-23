import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useRouteMatch} from 'react-router-dom';
import * as actions from 'Actions';
import SearchBox from 'Components/SearchBox';
import * as utils from 'Utils';
import SearchSuggest from './suggest';
import './style.scss';

const IssueSearchBox = ({isDsrPage, isMisraPage, scanTaskId}) => {
    const dispatch = useDispatch();
    const routeMatch = useRouteMatch();

    const projectKey = routeMatch.params.projectKey;
    const currentFilter = useSelector(state => state.page.scanResult.filter);

    const [searchValue, setSearchValue] = useState('');
    const [isShowSuggest, setIsShowSuggest] = useState(false);

    const showSuggest = () => {
        setIsShowSuggest(true);
    }
    const hideSuggest = () => {
        setIsShowSuggest(false);
    }

    const handleSearch = searchValue => {
        hideSuggest();
        const filterData = {
            ...currentFilter,
            searchValue: searchValue.trim()
        };
        dispatch(actions.getPageActions('scanResult').setIssueFilter(filterData));
        utils.scanResultHelper.cacheIssueFilterData({
            projectKey, 
            filterData, 
            isDsrPage, 
            isMisraPage
        });
        utils.scanResultHelper.updateCacheForIssueSearchKeyword({
            projectKey, 
            keyword: searchValue, 
            isUpdateFavorite: false, 
            isDelete: false,
            isMisraPage
        });
    }

    const handleChange = searchValue => {
        showSuggest();
        setSearchValue(searchValue);
    }
    const handleFocus = (event) => {
        showSuggest();
    }
    const handleClear = () => {
        setSearchValue('');
        handleSearch('');
    }
    const handleSelect = (event, keyword) => {
        hideSuggest();
        setSearchValue(keyword);
        handleSearch(keyword);
    }

    useEffect(() => {
        setSearchValue(currentFilter.searchValue);
    }, [currentFilter.searchValue]);

    return <div className="issue-search-box">
        <SearchBox
            onSearch={handleSearch}
            onChange={handleChange}
            onFocus={handleFocus}
            onClear={handleClear}
            value={searchValue}
        />
        {
            isShowSuggest && 
            <SearchSuggest 
                scanTaskId={scanTaskId}
                projectKey={projectKey} 
                searchValue={searchValue}
                isMisraPage={isMisraPage}
                hideSuggest={hideSuggest}
                onSelect={handleSelect} 
                
            />
        }
    </div>;
}

export default IssueSearchBox;