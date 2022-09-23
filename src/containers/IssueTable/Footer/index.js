import React, {useEffect, useState} from 'react';
import DropDownWithTitle from "Components/DropdownWithTitle";
import {Image} from "react-bootstrap";
import i18n from "i18next";
import enums from 'Enums';
import {Col, Pagination, Row} from "react-bootstrap";
import downArrowImage from 'Assets/images/icon/dropdown-red-icon.png';

import './style.scss';

const PAGE_TYPE = {
    PAGE: 0,
    PREV: 1,
    NEXT: 2,
    JUMP_PREV: 3,
    JUMP_NEXT: 4
};

const TableFooter = props => {
    const {
        currentPage,
        itemsPerPage,
        changePage,
        changeItemsPerPage,
        pages,
    } = props;

    const pageBufferSize = 2;
    const [pageList, setPageList] = useState([]);

    const paginationOptions = enums.TABLE_PAGINATION_OPTIONS.map(option => ({
        label: option,
        value: option,
        onSelect: () => changeItemsPerPage(option),
    }));

    const createPaginationData = () => {
        let _pageList = [];
        let firstPage = 1;
        let lastPage = props.pages;
        let jumpPrev = null;
        let jumpNext = null;
        let prevPage = null;
        let nextPage = null;

        let left = Math.max(1, currentPage - pageBufferSize);
        let right = Math.min(currentPage + pageBufferSize, lastPage);

        if (lastPage - currentPage < pageBufferSize) {
            left = Math.max(1, lastPage - pageBufferSize * 2);
        }

        if(currentPage <= pageBufferSize) {
            right = Math.min(1 + pageBufferSize * 2, lastPage);
        }

        prevPage = Math.max(1, currentPage - 1);
        _pageList.push({
            type: PAGE_TYPE.PREV,
            pageNumber: prevPage
        });

        if(left !== firstPage) {
            _pageList.push({
                type: PAGE_TYPE.PAGE,
                pageNumber: firstPage
            });
        }

        if(left > firstPage + 1) {
            jumpPrev = currentPage - (pageBufferSize * 2 + 1);
            jumpPrev = jumpPrev <= 1 ? 2 : jumpPrev;
            _pageList.push({
                type: PAGE_TYPE.JUMP_PREV,
                pageNumber: jumpPrev
            });
        }

        for(let i = left; i <= right; i++) {
            _pageList.push({
                type: PAGE_TYPE.PAGE,
                pageNumber: i
            });
        }

        if(right < lastPage - 1) {
            jumpNext = currentPage + (pageBufferSize * 2 + 1);
            jumpNext = jumpNext >= lastPage ? lastPage - 1 : jumpNext;
            _pageList.push({
                type: PAGE_TYPE.JUMP_NEXT,
                pageNumber: jumpNext
            });
        }

        if(right !== lastPage) {
            _pageList.push({
                type: PAGE_TYPE.PAGE,
                pageNumber: lastPage
            });
        }

        nextPage = Math.min(lastPage, currentPage + 1);
        _pageList.push({
            type: PAGE_TYPE.NEXT,
            pageNumber: nextPage
        });

        setPageList(_pageList);
    }

    useEffect(() => {
        props.pages > 0 && createPaginationData();
    }, [currentPage, pages]);

    return <Row noGutters className="table-footer">
        <Col></Col>
        <Col className="pagination">
            {
                pageList.map((page, idx) => {
                    let component = null;
                    switch(page.type) {
                        case PAGE_TYPE.PAGE:
                            component = 
                                <Pagination.Item
                                    key={idx}
                                    onClick={() => changePage(page.pageNumber)}
                                    active={page.pageNumber === currentPage}
                                >
                                    {page.pageNumber}
                                </Pagination.Item>
                            break;
                        case PAGE_TYPE.PREV:
                            component = 
                                <Pagination.Prev key={idx} onClick={() => {
                                    currentPage > 1 && changePage(page.pageNumber);
                                }}/>
                            break;
                        case PAGE_TYPE.NEXT:
                            component = 
                                <Pagination.Next key={idx} onClick={() => {
                                    currentPage < props.pages && changePage(page.pageNumber);
                                }}/>
                            break;
                        case PAGE_TYPE.JUMP_PREV:
                        case PAGE_TYPE.JUMP_NEXT:
                            component = 
                                <Pagination.Ellipsis key={idx} onClick={() => changePage(page.pageNumber)}/>
                            break;
                        default:
                            break;
                    }
                    return component;
                })
            }
        </Col>
        <Col className="page-selector">
                    <span>
                        {i18n.t('pages.dsr.issue-table.items-per-page')}
                    </span>
                    <span>
                        <DropDownWithTitle
                            menuGroups={[
                                {
                                    menus: paginationOptions
                                }
                            ]}
                            label={itemsPerPage}
                            icon={<Image src={downArrowImage} className="down-arrow" />}
                        />
                    </span>
        </Col>
    </Row>
}

export default TableFooter;
