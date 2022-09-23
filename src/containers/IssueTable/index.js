import i18n from "i18next";
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import {useHistory} from 'react-router-dom';
import {Col, Row, Table} from "react-bootstrap";
import enums from 'Enums';

import SearchBox from "Components/SearchBox";
import DropDownWithTitle from "Components/DropdownWithTitle";

import TableFooter from './Footer';

import './style.scss';

const IssueTable = props => {
    const history = useHistory();
    const {
        projectId,
        title,
        onSearch,
        dropdownFilter,
        currentFilter,
        tableHeaders,
        tableData,
    } = props;
    const [itemsPerPage, setItemsPerPage] = useState(enums.TABLE_PAGINATION_OPTIONS[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [pageData, setPageData] = useState([]);

    const calculatePages = itemsPerPage => {
        if(tableData.length) {
            const pages = Math.ceil(tableData.length / itemsPerPage);
            setPages(pages);
        } else {
            setPages(0);
        }
    }

    const preparePageData = (pageNumber, itemCountsPerPage=itemsPerPage) => {
        const start = (pageNumber - 1) * itemCountsPerPage;
        const end = pageNumber * itemCountsPerPage;
        const currentPageData = tableData.slice(start, end > tableData.length ? tableData.length : end);
        setPageData(currentPageData);
    }

    const goToIssueDetail = issueId => {
        history.push(`/triage/${projectId}/${issueId}/source-and-sink`);
    }
    const changePage = pageNumber => {
        setCurrentPage(pageNumber);
        preparePageData(pageNumber);
    }
    const changeItemsPerPage = itemCountsPerPage => {
        setCurrentPage(1);
        setItemsPerPage(itemCountsPerPage);
        calculatePages(itemCountsPerPage);
        preparePageData(1, itemCountsPerPage);
    }

    useEffect(() => {
        calculatePages(itemsPerPage);
        preparePageData(1);
    }, [tableData]);

    return <div className="issue-table">
        <div className="issue-table-title">
            <Row noGutters>
                <Col className="title" md={3}>{title}</Col>
                <Col className="search-box-and-filter" md={9}>
                    <Row>
                        <Col className="search-box-container">
                            <SearchBox
                                onChange={onSearch}
                                onSearch={onSearch}
                            />
                        </Col>
                        <Col className="drop-down-filter">
                            <DropDownWithTitle
                                menuGroups={dropdownFilter}
                                label={currentFilter.label}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
        <div className="issue-table-table">
            <Table
                striped
            >
                {
                    tableHeaders &&
                    <thead>
                        <tr>
                            {
                                tableHeaders.map((header, idx) => {
                                    return <th key={idx}>{header.label}</th>
                                })
                            }
                        </tr>
                    </thead>
                }
                {
                    pageData ?
                        <tbody>
                        {
                            pageData.map((row, idx) => {
                                return <tr
                                    key={idx}
                                    onClick={e => {
                                        goToIssueDetail(row['issueId'])
                                    }}
                                >
                                    {
                                        tableHeaders.map((header, idx) => {
                                            let data = '';
                                            switch (header.value) {
                                                case 'definite':
                                                    if (row[header.value] === 'D') {
                                                        data = i18n.t('pages.dsr.issue-table.definite');
                                                    }
                                                    break;
                                                default:
                                                    data = row[header.value];
                                                    break;
                                            }
                                            return <td
                                                key={idx}
                                                className={classNames({
                                                    seq: header.value === 'seq',
                                                    'filePath': header.value === 'filePath',
                                                    'paths': header.value === 'paths',
                                                    'definite': header.value === 'definite',
                                                    'standards': header.value === 'standards',
                                                    'severity': header.value === 'severity',
                                                    'ruleName': header.value === 'ruleName',
                                                })}
                                            >
                                                {
                                                    header.value === 'severity' ?
                                                        <div className={classNames('label-flag',
                                                            {
                                                                high: row.severity === 'HIGH',
                                                                medium: row.severity === 'MEDIUM',
                                                                low: row.severity === 'LOW',
                                                            })}>
                                                            &nbsp;
                                                        </div>
                                                        :
                                                        data && <div className="data">
                                                            <span>{data}</span>
                                                        </div>
                                                }
                                            </td>
                                        })
                                    }
                                </tr>
                            })
                        }
                        </tbody> : ''
                }

            </Table>
        </div>
        <div className="issue-table-footer">
            <TableFooter
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                changePage={changePage}
                changeItemsPerPage={changeItemsPerPage}
                pages={pages}
            />
        </div>
    </div>;
}

IssueTable.propTypes = {
    title: PropTypes.string,
    pagination: PropTypes.bool,
    tableHeaders: PropTypes.array,
    tableData: PropTypes.array,
    pages: PropTypes.number,
}
IssueTable.defaultProps = {
    title: 'Title',
    pagination: true,
    tableHeaders: [
        {
            label: 'header1',
            value: 'header1',
        },
        {
            label: 'header2',
            value: 'header2',
        },
    ],
    tableData: [
        {
            header1: 'header1 row1 data',
            header2: 'header2 row2 data',
        },
    ],
    pages: 5
}

export default IssueTable;
