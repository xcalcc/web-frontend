import React, {useMemo} from 'react';
import i18n from 'i18next';
import {useHistory} from 'react-router-dom';
import {Container, Row, Col, Image, Nav} from 'react-bootstrap';
import BreadCrumbs from 'Components/BreadCrumbs';
import DownloadReport from './_partials/DownloadReport';
import MoreMenu from './_partials/MoreMenu';

import ListIcon from 'Icons/list.svg';
import TriangleIcon from 'Icons/triangle.svg';
import './style.scss';

const Header = props => {
    const {
        isDsrPage,
        projectKey,
        projectUuid,
        scanTaskId,
        projectName,
        scanMode,
        hasDsr
    } = props;

    const history = useHistory();

    const breadcrumbs = useMemo(() => {
        let data = [
            {
                title: `${i18n.t('common.project')}:`,
                path: undefined
            }
        ];
        if(isDsrPage) {
            data.push({
                title: `${projectName}`,
                path: `/project/${projectKey}`
            });
            data.push({
                title: i18n.t('pages.scan-result.right-nav.delta-view'),
                path: undefined,
                current: true
            });
        } else {
            data.push({
                title: `${projectName}`,
                path: undefined,
                current: true
            });
        }
        return data;
    }, [projectName]);

    return <Container fluid className="scan-result-header">
        <Row>
            <Col xs={6}>
                <BreadCrumbs data={breadcrumbs} />
            </Col>
            <Col xs={6} className="right-area text-right">
                <Nav>
                    <Nav.Item>
                        <Nav.Link
                            active={!isDsrPage}
                            onClick={() => history.push(`/project/${projectKey}`)}
                        >
                            <Image src={ListIcon}/>
                            {i18n.t('pages.scan-result.right-nav.latest-view')}
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                {
                    hasDsr &&
                    <Nav>
                        <Nav.Item>
                            <Nav.Link
                                active={isDsrPage}
                                onClick={() => history.push(`/project/${projectKey}/scans`)}
                            >
                                <Image src={TriangleIcon}/>
                                {i18n.t('pages.scan-result.right-nav.delta-view')}
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                }
                <DownloadReport
                    isDsrPage={isDsrPage}
                    scanTaskId={scanTaskId}
                    projectUuid={projectUuid}
                    projectName={projectName}
                    scanMode={scanMode}
                />
                <Nav>
                    <Nav.Item>
                        <MoreMenu
                            projectUuid={projectUuid}
                        />
                    </Nav.Item>
                </Nav>
            </Col>
        </Row>
    </Container>
}

export default Header;