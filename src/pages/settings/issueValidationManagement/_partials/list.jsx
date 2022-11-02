import React from 'react';
import i18n from 'i18next';
import moment from 'moment';
import {Container, Row, Col} from 'react-bootstrap';
import * as utils from 'Utils';
import Section from 'Components/Section';
import Pagination from 'Components/Pagination';
import TrashIcon from 'Icons/trash.svg';

const List = props => {
    const {
        totalPages,
        tablePaging,
        filterList,
        onDelete,
        onSetTablePaging
    } = props;

    const dateFormat = utils.isChinese() ? 'YYYY/MM/DD' : 'DD/MM/YYYY';

    const onPageChange = (pageNumber) => {
        const paging = {...tablePaging};
        paging.currentPage = pageNumber;

        onSetTablePaging(paging);
    }

    const onPageSizeChange = (pageSize) => {
        const paging = {
            pageSize: pageSize,
            currentPage: 1
        };

        onSetTablePaging(paging);
    }

    return <Section>
        <Container fluid className="settings-content noPadding">
            <Row noGutters>
                <Col className="table-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>{i18n.t('pages.issue-filters.table.rule-code')}</th>
                                <th>{i18n.t('pages.issue-filters.table.file-path')}</th>
                                <th>{i18n.t('pages.issue-filters.table.function-name')}</th>
                                <th>{i18n.t('pages.issue-filters.table.variable-name')}</th>
                                <th>{i18n.t('pages.issue-filters.table.validation')}</th>
                                <th>{i18n.t('pages.issue-filters.table.created')}</th>
                                <th>{i18n.t('common.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filterList && filterList.map(filter => (
                                    <tr key={filter.id}>
                                        <td className="type">{utils.scanResultHelper.getRuleInfo(filter.ruleCode).code}</td>
                                        <td className="file"><p>{filter.filePath}</p></td>
                                        <td className="function"><p>{filter.functionName}</p></td>
                                        <td className="variable"><p>{filter.variableName}</p></td>
                                        <td className="validation">
                                            <span className={filter.action}>
                                                {i18n.t(`pages.scan-result.validation.${filter.action}`)}
                                            </span>
                                        </td>
                                        <td className="created">{moment(filter.createdOn).format(dateFormat)}</td>
                                        <td className="action">
                                            <span
                                                className="link"
                                                onClick={() => onDelete(filter.id)}
                                            >
                                                <img src={TrashIcon} />
                                                {i18n.t('common.delete')}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {
                        filterList && filterList.length === 0 &&
                        <p className="norecord">{i18n.t('common.table-no-data')}</p>
                    }
                </Col>
            </Row>
            <Row noGutters>
                <Col>
                    {
                        totalPages > 0 && 
                        <Pagination 
                            totalPages={totalPages}
                            currentPage={tablePaging.currentPage}
                            pageSize={tablePaging.pageSize}
                            onPageChange={onPageChange}
                            onPageSizeChange={onPageSizeChange}
                        />
                    }
                </Col>
            </Row>
        </Container>
    </Section>
}

export default List;