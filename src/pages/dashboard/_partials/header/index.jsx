import React, {useState} from 'react';
// import classNames from 'classnames';
import {Container, Row, Col} from 'react-bootstrap';
import i18n from 'i18next';
// import enums from 'Enums';
import SearchBox from 'Components/SearchBox';
// import ProjectViewIcon from 'Icons/project_view_icon.svg';
// import ProjectViewList from 'Icons/project_view_list.svg';

import './style.scss';

const Header = props => {
    const {
        // tableView,
        onSearch,
        // onSelectViewMode
    } = props;

    const [keyword, setKeyword] = useState('');

    const handleSearchBoxOnChange = searchValue => {
        onSearch(searchValue);
        setKeyword(searchValue);
    }

    const handleClearSearchValue = () => {
        onSearch('');
        setKeyword('');
    }

    return <Container fluid className="dashboard-header noPadding">
        <Row>
            <Col xs={4} className="left-area">
                {i18n.t('dashboard.my-projects')}
            </Col>
            <Col xs={8} className="right-area">
                <SearchBox
                    onSearch={onSearch}
                    onChange={handleSearchBoxOnChange}
                    onClear={handleClearSearchValue}
                    value={keyword}
                    placeHolder={i18n.t('dashboard.search-project')}
                />
                {/* <div 
                    className={classNames('view-by', {
                            active: tableView === enums.TABLE_VIEW_TYPE.BLOCK
                        }
                    )}
                    onClick={() => onSelectViewMode(enums.TABLE_VIEW_TYPE.BLOCK)}
                >
                    <Image src={ProjectViewIcon} />
                </div>
                <div
                    className={classNames('view-by', {
                        active: tableView === enums.TABLE_VIEW_TYPE.LIST
                        }
                    )}
                    onClick={() => onSelectViewMode(enums.TABLE_VIEW_TYPE.LIST)}
                >
                    <Image src={ProjectViewList} />
                </div> */}
            </Col>
        </Row>
    </Container>
}

export default Header;