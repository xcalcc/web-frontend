import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import * as utils from "Utils";
import Loader from 'Components/Loader';
import Pagination from "Components/Pagination";
import './sorting-table.scss';

/**
 * Pure component accept header and data,
 * sorting depends on the sortFn set in header data
 * @param props
 * @returns {*}
 * @constructor
 */
const SortingTable = props => {
    const {
        tablePaging,
        handlePageChange,
        headerData,
        tableData,
        currentSorting,
        handlePageSizeChange
    } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [sortDirection, setSortDirection] = useState(currentSorting && currentSorting.sortDirection);
    const [sortedData, setSortedData] = useState(tableData);
    const [sortField, setSortField] = useState('');

    useEffect(() => {
        if (currentSorting && (currentSorting.sortField !== sortField || currentSorting.sortDirection !== sortDirection)) {
            const header = headerData.find(data => currentSorting.sortField === data.field);
            setSortDirection(currentSorting && currentSorting.sortDirection);

            sort(tableData, header && header.sortFn, currentSorting.sortField);
        } else {
            setSortedData(tableData);
        }
    }, [tableData, currentSorting]);

    const getTotalPages = () => {
        const projectTotal = (tableData && tableData.length) || 0;
        let totalPages = Math.ceil(projectTotal / tablePaging.pageSize);
        return totalPages;
    }

    let currentPageDataList = [];
    const totalPages = !!tablePaging && getTotalPages();

    if (totalPages > 1 && sortedData) {
        if (tablePaging.currentPage > totalPages) {
            tablePaging.currentPage = totalPages;
        }

        let startIndex = (tablePaging.currentPage - 1) * tablePaging.pageSize;
        let endIndex = tablePaging.currentPage * tablePaging.pageSize;
        currentPageDataList = sortedData.filter((item, i) => {
            return i >= startIndex && i < endIndex;
        });
    } else {
        currentPageDataList = sortedData;
    }

    const sort = (data, sortFn, field) => {
        if (data && sortFn) {
            setIsLoading(true);
            const sortingDirection = -1 * sortDirection;
            setSortDirection(sortingDirection);
            setSortField(field);
            setSortedData(sortFn(data, field, sortingDirection));
            setIsLoading(false);
        }
    };

    return (
        <div className={classNames('sorting-table project-table', props.className)}>
            {
                isLoading && <Loader/>
            }
            <table className="table">
                {
                    headerData &&
                    <thead>
                    <tr>
                        {headerData.map((row, index) => {
                            return (
                                <th
                                    key={index}
                                    onClick={() => sort(tableData, row.sortFn, row.field)}
                                    className={row.className}
                                    style={{
                                        width: row.width || props.headerWidth
                                    }}
                                >
                                    <span className="header-label" dangerouslySetInnerHTML={{__html: row.label}}></span>
                                    {
                                        row.sortFn &&
                                        <a className={classNames('sort-label', {
                                            up: sortField === row.field && sortDirection === 1,
                                            down: sortField === row.field && sortDirection === -1
                                        })}/>
                                    }
                                    {
                                        row.subHeader
                                    }
                                </th>
                            )
                        })}
                    </tr>
                    </thead>
                }


                {
                    (sortedData && sortedData.length === 0 && (
                        <tbody className="scroll" id="clickable">
                        <tr className="no-data">
                            <td>{utils.language("Search result not found")}</td>
                        </tr>
                        </tbody>
                    ))
                }


                {
                    !!tablePaging ?
                        currentPageDataList && currentPageDataList.length &&
                        <tbody className="scroll" id="clickable">
                        {
                            props.renderTable(currentPageDataList)
                        }
                        </tbody>
                        :
                        sortedData && sortedData.length &&
                        <tbody className="scroll" id="clickable">{props.renderTable(sortedData)}</tbody>
                }
            </table>
            {
                !!tablePaging &&
                <div className="table-pagination">
                    {
                        totalPages > 0 &&
                        <Pagination
                            totalPages={totalPages}
                            currentPage={tablePaging.currentPage}
                            pageSize={tablePaging.pageSize}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                        />
                    }
                </div>
            }
        </div>
    );
}

SortingTable.propTypes = {
    headerData: PropTypes.array,
    pagination: PropTypes.bool,
    renderTable: PropTypes.func,
    headerWidth: PropTypes.string,
}

SortingTable.defaultProps = {
    headerData: null,
    pagination: false,
    renderTable: () => '',
    headerWidth: '',
}

export default SortingTable;
