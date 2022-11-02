import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import classNames from 'classnames';
import enums from 'Enums';
import * as utils from 'Utils';
import IssueTable from './_partials/IssueTable';
import IssueFilter from './_partials/IssueFilter';
import TopIssues from '../scanResult/_partials/TopIssues';
import Assignee from '../scanResult/_partials/Assignee';

const General = props => {
    const {
        projectKey,
        projectUuid,
        scanTaskId,
        isIgnoreView,
        setIsIgnoreView,
    } = props;

    return <>
        <Row>
            <Col>
                <Container fluid className="noPadding">
                    <Row className="statistics-block">
                        <Col xs={8}>
                            <TopIssues isMisraPage={true} isDsrPage={false} scanTaskId={scanTaskId}/>
                        </Col>
                        <Col xs={4}>
                            <Assignee
                                isMisraPage={true}
                                projectUuid={projectUuid}
                                scanTaskId={scanTaskId} 
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <IssueFilter 
                                isDsrPage={false}
                                scanTaskId={scanTaskId} 
                                isIgnoreView={isIgnoreView}
                                setIsIgnoreView={setIsIgnoreView}
                            />
                        </Col>
                    </Row>
                    <Row className={classNames({hide: isIgnoreView})}>
                        <Col>
                            <IssueTable
                                projectKey={projectKey}
                                scanTaskId={scanTaskId}
                                issueGroupType={enums.ISSUE_GROUP_TYPE.GENERAL}
                            />
                        </Col>
                    </Row>
                    {
                        utils.isEnableDevModeOption(enums.DEV_MODE_OPTION.validation) && 
                        <Row className={classNames({hide: !isIgnoreView})}>
                            <Col>
                                <IssueTable
                                    projectKey={projectKey}
                                    scanTaskId={scanTaskId}
                                    issueGroupType={enums.ISSUE_GROUP_TYPE.IGNORE}
                                />
                            </Col>
                        </Row>
                    }
                </Container>
            </Col>
        </Row>
    </>
}

export default General;