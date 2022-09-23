import React, {useEffect, useState} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import * as utils from 'Utils';
import MarqueeAnimation from '../MarqueeAnimation';

const Item = ({ruleData}) => {
    const [marquee, setMarquee] = useState();

    useEffect(() => {
        const _marquee = new MarqueeAnimation({
            selector: `.marquee_${ruleData.ruleCode}`,
        });
        setMarquee(_marquee);
    }, []);

    return <Container className="rule-static-item" fluid
        onMouseEnter={() => marquee && marquee.play()}
        onMouseLeave={() => marquee && marquee.stop()}
    >
        <Row noGutters>
            <Col xs={3} className="rule-code">{ruleData.ruleCode || ruleData.csvCodes.join(',')}</Col>
            <Col xs={7} className="rule-name">
                <div className={"marquee marquee_" + ruleData.ruleCode}>
                    <p>{ruleData.ruleName}</p>
                </div>
            </Col>
            <Col xs={2} className="rule-count">{utils.formatNumber(ruleData.issueCount)}</Col>
        </Row>
    </Container>;
}

export default Item;