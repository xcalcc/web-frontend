import i18n from "i18next";
import React, {useState, useMemo} from "react";
import classNames from "classnames";
import {Container, Row, Col} from "react-bootstrap";
import Dropdown from "Components/Dropdown";

import './tool-bar.scss';

const SORT_BY_OPTIONS = [
    {label: i18n.t('dashboard.sort-by-field.date-scanned'), value: 'scanTime'},
    {label: i18n.t('dashboard.sort-by-field.name'), value: 'name'},
    {label: i18n.t('dashboard.sort-by-field.defects-found'), value: 'issuesCount'}
];

const ToolBarItem = props => <div className={classNames('toolbar-item', props.className)}>
    <div className="toolbar-item-title">{props.title}</div>
    <div className="toolbar-item-content">{props.children}</div>
</div>;

const ToolBar = props => {
    const {
        projectCount,
        sorting,
        onSort,
    } = props;

    const [currentSorting, setCurrentSorting] = useState(sorting);

    const handleSorting = sortingMethod => {
        const nextSortingStatus = {
            sortField: sortingMethod,
            sortDirection: -1 * currentSorting.sortDirection
        };
        setCurrentSorting(nextSortingStatus);
        onSort(nextSortingStatus.sortField, nextSortingStatus.sortDirection);
    }

    const selectedLabel = useMemo(() => {
        const option = SORT_BY_OPTIONS.find(x => x.value === sorting.sortField) || {};
        return option.label || SORT_BY_OPTIONS[0].label;
    }, [sorting.sortField]);

    return <Container fluid className="toolbar">
        <Row className="toolbar-row">
            <Col xs="auto">
                <p className="project-total">
                    {projectCount} &nbsp;
                    {i18n.t('dashboard.projects')}
                </p>
            </Col>
            <Col xs="auto">
                <ToolBarItem title={i18n.t('dashboard.sort-by')}>
                    <Dropdown
                        label={selectedLabel}
                        options={SORT_BY_OPTIONS}
                        onSelect={(data) => handleSorting(data.value)}
                    />
                </ToolBarItem>
            </Col>
        </Row>
    </Container>
}

export default ToolBar;
