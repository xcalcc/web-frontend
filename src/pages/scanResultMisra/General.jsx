import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import enums from 'Enums';
import IssueTable from './_partials/IssueTable';
import IssueFilter from './_partials/IssueFilter';
import TopIssues from './_partials/TopIssues';
import Assignee from './_partials/Assignee';

const General = props => {
    const {
        projectKey,
        projectUuid,
        scanTaskId,
    } = props;

    return <>
        <Row>
            <Col>
                <Container fluid className="noPadding">
                    <Row className="statistics-block">
                        <Col xs={8}>
                            <TopIssues scanTaskId={scanTaskId} isDsrPage={false}/>
                        </Col>
                        <Col xs={4}>
                            <Assignee 
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
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <IssueTable
                                projectKey={projectKey}
                                scanTaskId={scanTaskId}
                                issueGroupType={enums.ISSUE_GROUP_TYPE.GENERAL}
                            />
                        </Col>
                    </Row>
                </Container>
            </Col>
        </Row>
    </>
}

export default General;