class SourceCodeDataAdapter {

    getDataForFullPath = (issueTracePathNodes=[]) => {
        const adaptedSourcesData = [];

        let previousPathNode;

        issueTracePathNodes.forEach(pathNode => {
            const fileDataInData = this._getFileFromData(adaptedSourcesData, pathNode.file);

            if (fileDataInData) {
                this._updateArrowsAndLines(fileDataInData, pathNode, previousPathNode);
            } else {
                adaptedSourcesData.push(this._createSourceFileData(pathNode));
            }

            previousPathNode = pathNode;
        });

        return adaptedSourcesData;
    };


    getDataForCertainPathItems = pathItems => {
        return pathItems.map(pathNode => {
            return this._createSourceFileData(pathNode);
        });
    };


    _getFileFromData = (adaptedSourcesData, file) => {
        return adaptedSourcesData.find(sourceCodeData => sourceCodeData.file === file);
    };


    _updateArrowsAndLines = (fileData, currentPathNode, previousPathNode) => {
        fileData.lines.push({
            seq: currentPathNode.seq,
            lineNo: currentPathNode.lineNo,
            message: currentPathNode.message
        });

        if (currentPathNode.scanFilePath === previousPathNode.scanFilePath) {
            fileData.arrows.push({
                from: previousPathNode.lineNo - 1,
                to: currentPathNode.lineNo - 1
            });
        }
    };


    _createSourceFileData = pathNode => ({
        file: pathNode.file,
        fullPath: pathNode.file,
        relativePath: pathNode.file,
        isSourceCode: pathNode.isExistSourceCode,
        noSourceCodeMessage: pathNode.noSourceCodeMessage,
        isBigFile: pathNode.isBigFile,
        sourceCode: pathNode.sourceCodeText,
        lines: [{
            seq: pathNode.seq,
            lineNo: pathNode.lineNo,
            message: pathNode.message
        }],
        arrows: [],
        scanTaskId: pathNode.scanTaskId,
    });
}

export default SourceCodeDataAdapter;