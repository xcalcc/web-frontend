import React from 'react';
import i18n from 'i18next';
import * as utils from 'Utils';
import NoSourceCode from './NoSourceCode';
import FileTooLarge from './FileTooLarge';
import RealSourceCode from './RealSourceCode/RealSourceCode';

import './SourceCode.scss';

const SourceCode = React.forwardRef(({
                                        nodeIndex,
                                        fileData = {},
                                        heading,
                                        selectedLineNo,
                                        noCodeHeight,
                                        arrowsEnabled,
                                        height,
                                        className,
                                        only15LinesLoaded = false,
                                     }, ref) => {

    const hasSelectedPathNode = !utils.isEmpty(nodeIndex);
    const noCodeHeightStyle = noCodeHeight ? {height: noCodeHeight + 'px'} : {height: height + 'px'};

    let codeComponent;
    if (fileData.isBigFile) {
        codeComponent = <FileTooLarge 
                            heightStyle={noCodeHeightStyle}
                            dsrType={fileData.dsrType}
                            scanTaskId={fileData.scanTaskId}
                            filePath={fileData.file}
                        />;
    } else if (fileData.isSourceCode) {
        codeComponent = hasSelectedPathNode ?
            <RealSourceCode
                fileData={fileData}
                initialHeight={height}
                arrowsEnabled={arrowsEnabled}
                selectedLineNo={selectedLineNo}
                className={className}
                only15LinesLoaded={only15LinesLoaded}
            /> :
            <NoSourceCode 
                heightStyle={noCodeHeightStyle} 
                message={<label className='small'>{i18n.t('issueDetail.no-select-source-code')}</label>}
            />;
    } else if (fileData.noSourceCodeMessage) {
        codeComponent = <NoSourceCode heightStyle={noCodeHeightStyle} message={fileData.noSourceCodeMessage}/>;
    }

    let headingOrPath = heading || (fileData && fileData.file) || '';
    const nodeNumber = hasSelectedPathNode && (nodeIndex + 1);

    return (
        <div
            className="source-code-content"
            ref={ref}
        >
            <h6 className="title">
                <span className="index">{nodeNumber || '-'}</span>
                <strong>{i18n.t('issueDetail.line')} {selectedLineNo}</strong>
                <span>{headingOrPath}</span>
            </h6>
            <div role="tabpanel" className="fade active in show">
                {codeComponent}
            </div>
        </div>
    );
});

export default SourceCode;
