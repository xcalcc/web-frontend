import React from 'react';
import i18n from 'i18next';
import * as utils from 'Utils';

export class SourceCodeProvider {
    constructor(props) {
        this.props = props;
    }

    provide = async ({scanTaskId, dsrType, tracePathNodes, codeDisplayLines}) => {
        const filePathList = [];
        tracePathNodes.forEach(item => {
            if (utils.isEmpty(item.file)) {
                item.sourceCodeText = '';
                item.isExistSourceCode = false;
            } else if (!filePathList.includes(item.file)) {
                filePathList.push(item.file);
            }
        });

        const promises = filePathList.map(filePath => this._getSourceCode(scanTaskId, dsrType, filePath, codeDisplayLines));
        const results = await Promise.all(promises);

        results.forEach(result => {
            result = result || {};
            tracePathNodes.forEach(item => {
                if (item.file === result.filePath) {
                    item.dsrType = dsrType;
                    item.scanTaskId = scanTaskId;
                    item.isBigFile = result.isBigFile;
                    item.sourceCodeText = result.sourceCodeText;
                    item.isExistSourceCode = result.isExistSourceCode;
                    item.noSourceCodeMessage = result.noSourceCodeMessage;
                }
            });
        });

        return tracePathNodes;
    };

    async _getSourceCode(scanTaskId, dsrType, filePath, codeDisplayLines) {
        const payload = {
            dsrType,
            scanTaskId,
            filePath
        };

        if(Number(codeDisplayLines) > 0) {
            payload.linesLimit = Number(codeDisplayLines);
        }

        const response = await this.props.fetchSourceCode(payload);
        if(response.error) {
            return {
                filePath,
                sourceCodeText: '',
                isExistSourceCode: false,
                noSourceCodeMessage: <p>{i18n.t('issueDetail.no-source-code')}</p>
            }
        }

        return {
            filePath,
            sourceCodeText: response.data || '',
            isExistSourceCode: true,
            isBigFile: response.status === 204
        }
    }
}