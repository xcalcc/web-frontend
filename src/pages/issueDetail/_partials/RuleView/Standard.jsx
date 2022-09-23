import React from 'react';
import {Badge, Image} from 'react-bootstrap';
import i18n from 'i18next';

import linkIcon from 'Icons/link.svg';

const Standard = ({standardList}) => {
    if(!standardList) return null;

    const typeList = Array.from(new Set(standardList.map(x => x.type)));

    return <>
        <p className="title">{i18n.t('issueDetail.rule-standard')}</p>
        <div className="rule-standard scrollbar">
            
            {
                standardList.length === 0 && '-'
            }
            {
                typeList.map(type => {
                    return <div className="items" key={type}>
                        <p className="title">{type.toUpperCase()}</p>
                        {
                            standardList.filter(x => x.type === type).map(std => {
                                return <p className="link" key={std.code}>
                                    <Badge variant="secondary">{std.code}</Badge>
                                    {std.name}
                                    <a target="_blank" title={std.url} href={std.url}>
                                        <Image src={linkIcon} />
                                    </a>
                                </p>
                            })
                        }
                    </div>
                })
            }
        </div>
    </>
}

export default Standard;