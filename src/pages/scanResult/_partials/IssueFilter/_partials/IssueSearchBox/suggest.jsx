import React, {useState, useEffect, useMemo} from 'react';
import {useDispatch} from 'react-redux';
import classNames from 'classnames';
import enums from 'Enums';
import * as utils from 'Utils';
import * as actions from 'Actions';

import StarIcon from 'Icons/star.svg';
import StarFillIcon from 'Icons/star-fill.svg';
import ClockIcon from 'Icons/clock.svg';
import CloseIcon from 'Icons/close.svg';

let isClickedDelete = false;
const SearchSuggest = ({scanTaskId, projectKey, isMisraPage, hideSuggest, searchValue, onSelect}) => {
    const dispatch = useDispatch();
    const [keywordList, setKeywordList] = useState([]);
    const [suggestList, setSuggestList] = useState([]);

    const getKeywords = (_searchValue) => {
        const cacheData = utils.localStore.getDataRow(enums.SCAN_RESULT_CACHE_ID) || {};
        const allKeywords = (isMisraPage ? cacheData['misraSearchKeyword'] : cacheData['searchKeyword']) || {};
        let keywords = allKeywords[projectKey] || [];
        if(_searchValue) {
            keywords = keywords.filter(x => x.keyword.indexOf(_searchValue) > -1);
        }

        keywords.sort((a, b) => b.date - a.date);
        keywords.sort((a, b) => b.isFavorite - a.isFavorite);

        return keywords;
    }

    const onClickFavorite = (event, data) => {
        event && event.stopPropagation && event.stopPropagation();
        utils.scanResultHelper.updateCacheForIssueSearchKeyword({
            projectKey, 
            keyword: data.keyword, 
            isUpdateFavorite: true, 
            isDelete: false,
            isMisraPage
        });

        const current = keywordList.find(x => x.keyword === data.keyword);
        current.isFavorite = !current.isFavorite;
        setKeywordList([...keywordList]);
    }

    const onDeleteKeyword = (event, data) => {
        isClickedDelete = true;
        event && event.stopPropagation && event.stopPropagation();
        utils.scanResultHelper.updateCacheForIssueSearchKeyword({
            projectKey, 
            keyword: data.keyword, 
            isUpdateFavorite: false, 
            isDelete: true,
            isMisraPage
        });

        const keywords = keywordList.filter(x => x.keyword !== data.keyword);
        setKeywordList(keywords);
    }

    const onSelectKeyword = (event, data) => {
        onSelect && onSelect(event, data.keyword);
    }

    const onSelectSuggest = (event, data) => {
        onSelect && onSelect(event, data.searchResult);
    }

    const updateSuggestList = async (_searchValue) => {
        const data = await dispatch(actions.fetchSearchSuggest({
            filter: {
                ruleSets: isMisraPage ? enums.MISRA_RULE_SETS : enums.BUILTIN_RULE_SETS,
                scanTaskId,
                searchValue: _searchValue.trim()
            },
            page: 1,
            size: 20
        }));

        const list = data.content || [];
        setSuggestList(list);
    }

    const debounceWithUpdateSuggestList = useMemo(() => {
        return utils.debounce(updateSuggestList, 500);
    }, []);

    const documentClick = (e) => {
        const clickableAreaClassName = 'issue-search-box';
        const isClickOnMyself = utils.isExistClassNameInEvent(e, clickableAreaClassName);
        // when the DOM is deleted, the DOM trace path will break, so need to use isClickedDelete
        if(!isClickOnMyself && !isClickedDelete) {
            hideSuggest();
        } 
        isClickedDelete = false;
    };

    useEffect(() => {
        const keywords = getKeywords(searchValue);
        setKeywordList(keywords);

        if(searchValue) {
            debounceWithUpdateSuggestList(searchValue);
        } else {
            setSuggestList([]);
        }
    }, [searchValue]);

    useEffect(() => {
        document.addEventListener('click', documentClick);
        return () => document.removeEventListener('click', documentClick);
    }, []);

    return <div className="search-suggest">
        <div className="search-suggest-content scrollbar">
            <ul>
                {
                    keywordList.map(data => 
                        <li key={data.keyword} onClick={(event) => onSelectKeyword(event, data)}>
                            <div className="data-item">
                                <span 
                                    className={classNames('icon-button icon-button-favorite', {
                                        favorited: data.isFavorite
                                    })}
                                    onClick={(event) => onClickFavorite(event, data)}
                                >
                                    <img src={data.isFavorite ? StarFillIcon : ClockIcon} />
                                    <img src={StarIcon} />
                                </span>
                                <span className="text">{data.keyword}</span>
                                <span 
                                    className="icon-button icon-button-delete"
                                    onClick={(event) => onDeleteKeyword(event, data)}
                                >
                                    <img src={CloseIcon} />
                                </span>
                            </div>
                        </li>
                    )
                }
                {
                    suggestList.map(data => 
                        <li key={data.searchResult} onClick={(event) => onSelectSuggest(event, data)}>
                            <div className="data-item">
                                <span className="icon-button icon-button-favorite"></span>
                                <span className="text">{data.searchResult}</span>
                                <span className="icon-button icon-button-delete"></span>
                            </div>
                        </li>
                    )
                }
            </ul>
        </div>
    </div>
}

export default SearchSuggest;