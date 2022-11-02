import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container, Row, Col, Image} from 'react-bootstrap';
import {PersonCircle} from 'react-bootstrap-icons';
import Scrollbar from 'react-scrollbars-custom';
import Proptypes from 'prop-types';
import i18n from 'i18next';
import * as utils from 'Utils';
import enums from 'Enums';
import * as actions from 'Actions';
import DoughnutChart from 'Components/DoughnutNumber';
import PersonIcon from 'Icons/person.svg';
import './style.scss';

const AssigneeItem = props => {
    const profilePic = props.name ? <PersonCircle/> : <Image src={PersonIcon} />
    return <Container className="assignee-item" fluid>
        <Row noGutters>
            <Col className="user">
                <span className="circle-icon">{profilePic}</span>
                <span className="text">{props.name || i18n.t('pages.scan-result.statistic-view.unassigned')}</span>
            </Col>
            <Col className="count">{utils.formatNumber(props.count)}</Col>
        </Row>
    </Container>;
}

const Assignee = props => {
    const {
        isMisraPage,
        projectUuid,
        scanTaskId
    } = props;

    const dispatch = useDispatch();
    const assigneeList = useSelector(state => state.user.assigneeList) || [];

    const unassignedIssueCount = (assigneeList.find(x => !x.user) || {}).count || 0;
    const issueTotal = assigneeList.reduce((accumulator, currentValue) => (Number(currentValue.count) + accumulator) || 0, 0);
    const percentage = issueTotal > 0 
        ? utils.formatPercentage((issueTotal - unassignedIssueCount) / issueTotal * 100).string
        : 0;

    useEffect(() => {
        dispatch(actions.fetchAssigneeList({
            projectUuid, 
            scanTaskId,
            dsrType: [enums.DSR_TYPE.NEW, ...enums.DSR_TYPE.OUTSTANDING_ALL],
            ruleSets: isMisraPage ? enums.MISRA_RULE_SETS : enums.BUILTIN_RULE_SETS
        }));
    }, []);

    return <Container className="assignee noPadding" fluid>
        <Row><Col className="header">{i18n.t('pages.scan-result.statistic-view.defects-assigned')}</Col></Row>
        <Row>
            <Col xs={4} className="assignee-chart">
                <DoughnutChart
                    label={i18n.t('pages.scan-result.statistic-view.total-assigned')}
                    percentage={percentage}
                    data={
                        {
                            previous: issueTotal - unassignedIssueCount,
                            current: unassignedIssueCount
                        }
                    }
                    width={140}
                    height={140}
                />
            </Col>
            <Col xs={8} className='assignee-list'>
                <Scrollbar noScrollX>
                    {
                        assigneeList.map((assignee, idx) => (<AssigneeItem
                            key={idx}
                            name={assignee.user && assignee.user.displayName}
                            count={assignee.count}
                        />))
                    }
                </Scrollbar>
            </Col>
        </Row>
    </Container>
}
Assignee.propType = {
    assigneeList: Proptypes.arrayOf(Proptypes.shape({
        name: Proptypes.string,
        count: Proptypes.number,
    })),
}
Assignee.defaultProps = {
    assigneeList: [
    ]
}
export default Assignee;
