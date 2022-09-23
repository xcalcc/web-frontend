import React, {useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Container, Row, Col} from 'react-bootstrap';
import i18n from 'i18next';
import * as utils from 'Utils';
import * as actions from 'Actions';
import Example from './Example';
import Standard from './Standard';

import './style.scss';

const RuleView = props => {
    const dispatch = useDispatch();
    const issueGroup = useSelector(state => state.issues.issueGroup);
    const standardMap = useSelector(state => state.rule.standardMap) || {};

    const ruleInfo = useMemo(() => {
        return dispatch(actions.getRuleInfoByCsvCode(issueGroup.ruleCode))
    }, [issueGroup]);

    let abstract, explanation;
    if(ruleInfo.details) {
        let details = ruleInfo.details;
        details = details.replace(/\r\n/g, '');

        if(utils.isEnglish()) {
            details = details.replace(/#+\s*Abstract\s*#*/, '');
            details = details.split(/#+\s*Explanation\s*#*/);
        } else {
            details = details.replace(/#+\s*概要\s*#*/, '');
            details = details.split(/#+\s*解释\s*#*/);
        }

        abstract = details[0];
        explanation = details[1];
    }

    const standardList = useMemo(() => {
        let _standardList = [], 
            currStandardCodeList, 
            standard;

        let alias = ruleInfo.alias || {};
        let standards = ruleInfo.standards || {};
        standards = {...standards, ...alias};

        Object.keys(standards).forEach(type => {
            currStandardCodeList = (standards[type] || []).sort((a, b) => {
                let aMatch = a.match(/\d+/) || [];
                let bMatch = b.match(/\d+/) || [];
                return Number(aMatch[0]) > Number(bMatch[0]) ? 1 : -1;
            });
            currStandardCodeList.forEach(code => {
                standard = (standardMap[type] && standardMap[type][code]) || {};
                standard.type = type;
                standard.code = code;
                _standardList.push(standard);
            });
        });
        return _standardList;
    }, [standardMap, ruleInfo]);

    return <Container className="rule-view" fluid>
        <Row>
            <Col xs={5} className="rule-view-type">
                <p className="title">{i18n.t('issueDetail.type')} - {ruleInfo.code}</p>
                <p className="text">{ruleInfo.name}</p>
            </Col>
            <Col>
                <p className="title">{i18n.t('issueDetail.abstract')}</p>
                <p className="text">{abstract}</p>
            </Col>
        </Row>
        <Row>
            <Col>
                <p className="title">{i18n.t('issueDetail.explanation')}</p>
                <p className="text">{explanation}</p>
            </Col>
        </Row>
        <Row>
            <Col><div className="divider"></div></Col>
        </Row>
        <Row>
            <Col xs={9} className="rule-example-wrap">
                <Row>
                    <Col xs={6}>
                        <Example
                            title={i18n.t('issueDetail.avoid')}
                            data={ruleInfo.examples && ruleInfo.examples['bad']}
                        />
                    </Col>
                    <Col xs={6}>
                        <Example
                            title={i18n.t('issueDetail.prefer')}
                            data={ruleInfo.examples && ruleInfo.examples['good']}
                        />
                    </Col>
                </Row>
            </Col>
            <Col xs={3} className="rule-standard-wrap">
                <Standard standardList={standardList} />
            </Col>
        </Row>
    </Container>
}

export default RuleView;