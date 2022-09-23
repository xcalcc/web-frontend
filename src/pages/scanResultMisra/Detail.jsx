import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import i18n from 'i18next';
import enums from 'Enums';
import IssueTable from './_partials/IssueTable';
import ScanLog from '../scanResult/_partials/ScanLog';
import TopIssues from './_partials/TopIssues';
import IssueFilter from './_partials/IssueFilter';

const DetailPage = props => {
    const {
        projectKey,
        projectUuid,
        scanTaskId,
    } = props;

    const dsrTableBlock = 
        <>
            <Row>
                <Col>
                    <IssueTable
                        isDsrPage
                        title={i18n.t('pages.dsr.new-defects')}
                        projectKey={projectKey}
                        scanTaskId={scanTaskId}
                        issueGroupType={enums.ISSUE_GROUP_TYPE.DSR_NEW}
                        dsrType={enums.DSR_TYPE.NEW}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <IssueTable
                        isDsrPage
                        title={i18n.t('pages.dsr.outstanding-defects')}
                        projectKey={projectKey}
                        scanTaskId={scanTaskId}
                        issueGroupType={enums.ISSUE_GROUP_TYPE.DSR_OUTSTANDING}
                        dsrType={enums.DSR_TYPE.OUTSTANDING_ALL}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <IssueTable
                        isDsrPage
                        title={i18n.t('pages.dsr.fixed-defects')}
                        projectKey={projectKey}
                        scanTaskId={scanTaskId}
                        issueGroupType={enums.ISSUE_GROUP_TYPE.DSR_FIXED}
                        dsrType={enums.DSR_TYPE.FIXED}
                    />
                </Col>
            </Row>
        </>;

    return <Row>
            <Col>
                <Container fluid className="noPadding">
                    <Row className="statistics-block">
                        <Col xs={8}>
                            <ScanLog isMisraPage projectUuid={projectUuid} projectKey={projectKey} />
                        </Col>
                        <Col xs={4}>
                            <TopIssues isDsrPage scanTaskId={scanTaskId} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <IssueFilter 
                                isDsrPage
                                scanTaskId={scanTaskId} 
                            />
                        </Col>
                    </Row>
                    {dsrTableBlock}
                </Container>
            </Col>
        </Row>
}

export default DetailPage;