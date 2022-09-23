import React from 'react'
import {Container, Col, Row, Image} from 'react-bootstrap'
import i18n from 'i18next'
import AssignedIcon from 'Assets/images/svg/pdf_defectsAssigned.svg'

import './assignments-block.scss'
import * as utils from 'Utils'

const AssignmentsBlock = props => {
    let {assigned, assignedPercentage} = props;
    if (isNaN(assignedPercentage)) {
        assignedPercentage = 0;
    }
    if (assignedPercentage > 100) {
        assignedPercentage = 100;
    }
    if (assignedPercentage < 0) {
        assignedPercentage = 0;
    }

    const numberPercentage = utils.formatPercentage(Number(assignedPercentage)).string.slice(0, -1);

    return (
        <Container fluid className='assignments-block-pdf block'>
            <Row noGutters>
                <Col>
                    <h6>
                        {i18n.t('pages.scan-result.pdf.project-summary.defects-assigned')}
                    </h6>
                </Col>
            </Row>
            <Row noGutters>
                <Col>
                    <div className='assigned-data'>
                        <div className='assigned-data_percentage'>
                            {numberPercentage}
                            <span>%</span>
                        </div>
                        <div className='assigned-data_label'>
							<span className='assigned-data_label_icon'>
								<Image src={AssignedIcon}/>
							</span>
                            <span className='assigned-data_label_counts'>{assigned}</span>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default AssignmentsBlock
