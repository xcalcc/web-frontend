import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import i18n from "i18next";

import "./filter-conditions.scss";
const keyValue = (className, key, value) =>
    value && (
        <div className={`${className} key-pair`}>
            <div
                className='field-name'>
                {key}:
            </div>
            <div
                className='field-value'>
                {value}
            </div>
        </div>
    );

const FilterConditions = (props) => {
    const {keyword, filteredRules = [], ruleSetAndStandardNames = ""} = props;

    return (
        <Container className="filter-conditions block" fluid>
            <Row noGutters className="filter-conditions_title">
                <Col md={12}>
                    <h6>{i18n.t("pages.scan-result.pdf.filters.filter-condition")}</h6>
                </Col>
            </Row>
            <Row noGutters>
                <Col className="filter-conditions_content">
                    {keyValue("keyword", i18n.t("pages.scan-result.pdf.filters.keywords"), keyword)}
                    {ruleSetAndStandardNames && keyValue("keyword", i18n.t("pages.scan-result.pdf.filters.rule-standard"), `${ruleSetAndStandardNames}`)}
                    {filteredRules.length > 0 && keyValue(
                        "filtered-rules",
                        i18n.t("pages.scan-result.pdf.filters.types"),
                        filteredRules.join(",  "))}
                </Col>
            </Row>
        </Container>
    );
};

export default FilterConditions;
