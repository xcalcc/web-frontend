import React from "react";
import {Card} from "react-bootstrap";
import classNames from "classnames";

import './style.scss';

export default props => <div className={classNames("section", props.className)}>
    <div className="title">
        {props.title}
    </div>
    <Card>
        <Card.Body>
            {props.children}
        </Card.Body>
    </Card>
</div>;
