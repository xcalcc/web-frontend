import React, {
    useState,
    useEffect,
} from "react";
import enums from 'Enums';
import * as utils from "Utils";
import {Row, Col} from 'react-bootstrap';
import ProjectTile from 'Components/ProjectTile';
import './block-list.scss';

export default props => {
    const {
        searchQueryList,
        sorting,
        isLoading,
        onProjectClick,
        onGotoDsrPage,
    } = props;
    const [sortedData, setSortedData] = useState(searchQueryList);
    const selectedRuleSetId = enums.RULE_SET.ALL;

    useEffect(() => {
        if (searchQueryList) {
            if (sorting.sortField === 'name') {
                const direction = sorting.sortDirection;
                const sortedByName = utils.sort.sortByName(searchQueryList, 'name', direction);
                setSortedData(sortedByName);
            } else if (sorting.sortField === 'scanTime') {
                const direction = sorting.sortDirection;
                const sortedByScanTime = utils.sort.sortByScanTime(searchQueryList, 'scanTime', direction);
                setSortedData(sortedByScanTime);
            } else if (sorting.sortField === 'issuesCount') {
                const direction = sorting.sortDirection;
                const sortedByIssueCount = utils.sort.sortByIssueCount(searchQueryList, 'issuesCount', direction, selectedRuleSetId);
                setSortedData(sortedByIssueCount);
            } else {
                setSortedData(searchQueryList);
            }
        }
    }, [sorting, searchQueryList]);

    return (
        <div className="block-list">
            {!isLoading && <Row className="inner-list" noGutters>
                {
                    ((sortedData && sortedData.length &&
                        sortedData.map((data, idx) => {
                            return data && <Col xs={2} key={idx}>
                                <ProjectTile
                                    {...props}
                                    data={data}
                                    hasDsr={data.hasDsr}
                                    onProjectClick={onProjectClick}
                                    onGotoDsrPage={onGotoDsrPage}
                                />
                            </Col>
                        })) || "")
                }
            </Row>}
        </div>
    )
}
