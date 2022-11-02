import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import classNames from 'classnames';
import i18n from 'i18next';
import enums from 'Enums';
import * as utils from 'Utils';
import IssueTable from './_partials/IssueTable';
import ScanLog from './_partials/ScanLog';
import TopIssues from './_partials/TopIssues';
import IssueFilter from './_partials/IssueFilter';

const DetailPage = props => {
    const {
        projectKey,
        projectUuid,
        scanTaskId,
        isIgnoreView,
        setIsIgnoreView,
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
                            <ScanLog isMisraPage={false} projectUuid={projectUuid} projectKey={projectKey} />
                        </Col>
                        <Col xs={4}>
                            <TopIssues isMisraPage={false} isDsrPage={true} scanTaskId={scanTaskId} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <IssueFilter 
                                isDsrPage
                                scanTaskId={scanTaskId} 
                                isIgnoreView={isIgnoreView}
                                setIsIgnoreView={setIsIgnoreView}
                            />
                        </Col>
                    </Row>
                    <div className={classNames({hide: isIgnoreView})}>
                        {dsrTableBlock}
                    </div>
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
}

export default DetailPage;