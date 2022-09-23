import React, {useCallback, useEffect, useRef, useState} from 'react';
import AceEditor from "react-ace";
import "brace/mode/java";
import "brace/theme/xcode";

import {ACE_EDITOR_DEFAULT_PROPS, SOURCE_CODE_LINE_HEIGHT} from "../constants";

import './ResizableAceEditor.scss';

const ResizableAceEditor = ({height, heightChanged, tracePathMarkers, sourceCode, filePath, focusedLine, onAceScroll, only15LinesLoaded}) => {
    const ace = useRef(null);

    const [sourceCodeValue, setSourceCodeValue] = useState(sourceCode);

    useEffect(() => {
        const editor = ace.current.editor;
        let lineForAceToFocus = focusedLine;
        let _sourceCode = sourceCode;

        if (only15LinesLoaded) {
            const firstLineNumber = focusedLine > 8 ? focusedLine - 7 : 1;
            editor.setOption("firstLineNumber", firstLineNumber);

            lineForAceToFocus = focusedLine > 8 ? 8 : focusedLine;

            // cut last new line
            if (sourceCode.split('\n').length > 15 && sourceCode[sourceCode.length - 1] === '\n') {
                _sourceCode = sourceCode.substring(0, sourceCode.length - 1);
            }
        }

        setSourceCodeValue(_sourceCode);

        // focus on focusedLine
        setTimeout(() => {
            editor.gotoLine(lineForAceToFocus);
            editor.focus();
        }, 100);
    }, [filePath, focusedLine]);


    useEffect(() => {
        const session = ace.current.editor.session;

        const callback = () => {
            const newScrollTop = session.getScrollTop();

            onAceScroll(newScrollTop);
        };

        session.on("changeScrollTop", callback);

        return () => {
            session.off("changeScrollTop", callback)
        };
    }, []);


    const resizeHeightOnMousemove = useCallback(event => {
        const {top: editorViewportY} = ace.current.refEditor.getBoundingClientRect();

        const editor = ace.current.editor;

        const firstVisibleRowNumber = editor.renderer.layerConfig.firstRow;
        const lastVisibleRowNumber = editor.renderer.layerConfig.lastRow;

        const expectedHeight = (lastVisibleRowNumber - firstVisibleRowNumber) * SOURCE_CODE_LINE_HEIGHT;

        const newEditorHeight = event.clientY - editorViewportY;

        if (expectedHeight + 20 > newEditorHeight) {
            heightChanged(newEditorHeight);
        }
    }, [ace.current]);

    const startResizing = useCallback(() => {
        document.body.classList.add('select-disabled');

        document.addEventListener("mousemove", resizeHeightOnMousemove);
        document.addEventListener("mouseup", stopResizing);
    }, []);

    const stopResizing = useCallback(() => {
        document.removeEventListener('mousemove', resizeHeightOnMousemove);
        document.removeEventListener('mouseup', stopResizing);

        document.body.classList.remove('select-disabled');
    }, []);

    useEffect(() => stopResizing, []);

    return (
        <div className="ace-editor-wrapper">
            <AceEditor
                ref={ace}
                {...ACE_EDITOR_DEFAULT_PROPS}
                style={{lineHeight: SOURCE_CODE_LINE_HEIGHT + 'px'}}
                height={height ? height + 'px' : '100%'}
                markers={tracePathMarkers}
                value={sourceCodeValue}
            />

            {
                !only15LinesLoaded &&
                <div className="resizing-button" onMouseDown={startResizing} />
            }
        </div>
    );
};

export default ResizableAceEditor;