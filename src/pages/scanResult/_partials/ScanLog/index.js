import React, {useState, useEffect, useRef, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import DatePicker from 'react-multi-date-picker';
import moment from 'moment';
import {Container, Row, Col} from 'react-bootstrap';
import i18n from 'i18next';
import enums from 'Enums';
import * as utils from 'Utils';
import * as actions from 'Actions';
import Dropdown from 'Components/Dropdown';
import SearchBox from 'Components/SearchBox';
import LogTable from './LogTable';

import './style.scss';
import './date-picker.scss';

const ScanLog = props => {
    const {
        isMisraPage,
        projectUuid,
        projectKey
    } = props;

    const repoActionAllOption = {
        value: '',
        label: i18n.t('pages.dsr.repo-action-all')
    };

    const repoActionOptions = [
        repoActionAllOption,
        {
            value: enums.REPO_ACTION.CI,
            label: i18n.t(`pages.dsr.repo-action-${enums.REPO_ACTION.CI}`)
        },
        {
            value: enums.REPO_ACTION.CD,
            label: i18n.t(`pages.dsr.repo-action-${enums.REPO_ACTION.CD}`)
        }
    ];

    const dispatch = useDispatch();

    const datePickerRef = useRef(null);
    const [searchCommitId, setSearchCommitId] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedRepoAction, setSelectedRepoAction] = useState(repoActionAllOption);
    const scanResultActions = actions.getPageActions('scanResult');
    const scanLog = useSelector(state => state.page.scanResult.scanLog);

    const onSearchByCommitId = value => {
        setSelectedDate('');
        dispatch(scanResultActions.setScanLogFilter({
            ...scanLog.filter,
            commitId: String(value).trim(),
            targetStartDate: null,
            targetEndDate: null
        }));
    }

    const onChangeCommitSearchBox = value => {
        setSearchCommitId(value);
    }

    const onScanLogScrollToBottom = scrollValues => {
        const contentHeight = scrollValues.contentScrollHeight;
        const scrollTop = scrollValues.scrollTop + scrollValues.clientHeight;
        if(contentHeight - scrollTop < 120) {

            const totalPages = scanLog.totalPages;
            const currentPage = scanLog.paging.currentPage;

            if(currentPage < totalPages) {
                dispatch(scanResultActions.setScanLogPaging({
                    ...scanLog.paging,
                    currentPage: currentPage + 1
                }));
            }
        }
    }

    const onSearchByDate = selectedDate => {
        setSelectedDate(selectedDate);
        if(!selectedDate[0] || !selectedDate[1]) return;

        let startDate, endDate;
        try{
            const date1 = `${selectedDate[0].year}/${selectedDate[0].month.number}/${selectedDate[0].day}`;
            const date2 = `${selectedDate[1].year}/${selectedDate[1].month.number}/${selectedDate[1].day}`;
            startDate = moment(date1 + ' 00:00:00').valueOf();
            endDate = moment(date2 + ' 23:59:59').valueOf();
        } catch {}

        setSearchCommitId('');
        dispatch(scanResultActions.setScanLogFilter({
            ...scanLog.filter,
            commitId: null,
            targetStartDate: startDate,
            targetEndDate: endDate
        }));
        datePickerRef.current && datePickerRef.current.closeCalendar && datePickerRef.current.closeCalendar();
    }

    const onSelectRepoAction = option => {
        setSelectedRepoAction(option);
        dispatch(scanResultActions.setScanLogFilter({
            ...scanLog.filter,
            repoActions: option.value ? [option.value] : undefined
        }));
    }

    useMemo(() => {
        // clear scan log
        dispatch(scanResultActions.setScanLogFilter({}));
    }, []);

    const useDidUpdateEffect = (fn, inputs) => {
        const didMountRef = useRef(false);
        useEffect(() => {
            if (didMountRef.current) {
                fn();
            } else {
                didMountRef.current = true;
            }
        }, inputs);
    }

    useDidUpdateEffect(() => {
        const ruleSets = isMisraPage ? enums.MISRA_RULE_SETS : enums.BUILTIN_RULE_SETS;
        dispatch(scanResultActions.fetchScanLogs({
            ruleSets,
            projectUuid: projectUuid,
            targetRangeStartDate: scanLog.filter.targetStartDate,
            targetRangeEndDate: scanLog.filter.targetEndDate,
            commitIdPattern: scanLog.filter.commitId,
            repoActions: scanLog.filter.repoActions,
            page: scanLog.paging.currentPage,
            size: scanLog.paging.pageSize
        }));
    }, [scanLog.filter, scanLog.paging]);

    useEffect(() => {
        datePickerRef.current && datePickerRef.current.addEventListener("keyup", (event) => {
            switch(event.keyCode) {
                case 8: 
                    setSelectedDate('');
                    break;
                case 13:
                    selectedDate === '' && onSearchByCommitId('');
                    break;
                default:
                    break;
            }
        });

        // FIX: In Safari, the calendar always popup automatically after the page is loaded.
        datePickerRef.current && datePickerRef.current.closeCalendar && datePickerRef.current.closeCalendar();
    }, []);

    return <Container className="scan-log noPadding" fluid>
        <Row noGutters>
            <Col md={2} className="title">{i18n.t('pages.dsr.scan-log')}</Col>
            <Col md={10} className="right-items">
                <div className="repo-action-dropdown">
                    <span className="name">{i18n.t('pages.dsr.repo-action')}</span>
                    <div className="divider"></div>
                    <Dropdown
                        alignment='right'
                        arrowStyle='line'
                        label={selectedRepoAction.label}
                        selectedValue={selectedRepoAction.value}
                        options={repoActionOptions}
                        onSelect={data => onSelectRepoAction(data)}
                    />
                </div>
                <div className="search-box">
                    <SearchBox
                        placeHolder={i18n.t('pages.dsr.search-commit-id')}
                        value={searchCommitId}
                        onSearch={onSearchByCommitId}
                        onChange={onChangeCommitSearchBox}
                    />
                </div>
                <div className="date-picker">
                    <DatePicker
                        ref={datePickerRef}
                        className="multi-date-picker"
                        range
                        value={selectedDate}
                        onChange={onSearchByDate}
                        format={utils.isEnglish() ? 'DD/MM/YYYY' : 'YYYY/MM/DD'}
                        type="input-icon"
                        arrow={false}
                        weekDays={[
                            "S",
                            "M",
                            "T",
                            "W",
                            "T",
                            "F",
                            "S"
                        ]}
                    />
                </div>
            </Col>
        </Row>
        <Row>
            <Col>
                <LogTable
                    isMisraPage={isMisraPage}
                    projectKey={projectKey}
                    projectUuid={projectUuid}
                    scanLog={scanLog}
                    isExistFilter={!!scanLog.filter.commitId || !!scanLog.filter.targetStartDate}
                    onScrollStop={onScanLogScrollToBottom}
                />
            </Col>
        </Row>

    </Container>;
}

export default ScanLog;
