import React from 'react';
import i18n from 'i18next';
import * as utils from 'Utils';

const Example = ({title, data}) => {

    if(utils.isEmptyObject(data)) return null;

    let exampleData = {};

    // delete empty data
    Object.keys(data).forEach(lang => {
        if(Array.isArray(data[lang])) {
            if(data[lang].find(x => !!x)) {
                exampleData[lang] = data[lang];
            }
        }
    });

    return <div className="rule-example">
        <p className="title">{i18n.t('issueDetail.example')} - {title}</p>
        <div className="example scrollbar">
            {
                Object.keys(exampleData).map(lang => {
                    return <pre key={lang}>
                        <p>{lang}</p >
                        {
                            exampleData[lang].map((code, idx) => 
                                    <code key={idx}>{code}</code>
                            )
                        }
                    </pre>
                })
            }
        </div>
    </div>
}

export default Example;