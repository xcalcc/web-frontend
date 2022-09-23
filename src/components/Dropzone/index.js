import React, {useMemo, useState, useCallback} from 'react';
import i18n from 'i18next';
import Highlight from 'react-highlight.js';
import {useDropzone} from 'react-dropzone';
import JsonBeautifier from 'json-beautify';
import prettyBytes from 'pretty-bytes';
import '3rdParty/highlight-js/default.css';

const fileAccept = 'application/json';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    cursor: 'pointer'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};
const validateJsonFile = file => {
    const maxLength = 50;
    const maxFileSizeInMb = 10;
    // if(file.type !== fileAccept) {
    //     return {
    //         code: "not-supported-type",
    //         message: i18n.t('common.dropzone.errors.not-supported-type')
    //     };
    // }

    if (file.name.length > maxLength) {
        return {
            code: "name-too-long",
            message: i18n.t('common.dropzone.errors.name-too-long', {
                size: `${maxFileSizeInMb} Mb`,
                nameLength: maxLength
            })
        };
    }
    if (file.size > maxFileSizeInMb * 1024) {
        return {
            code: "file-size-too-large",
            message: i18n.t('common.dropzone.errors.file-too-large', {
                size: `${maxFileSizeInMb} Mb`,
                nameLength: maxLength
            })
        };
    }

    return null
}

const Dropzone = props => {
    const {passFileContent} = props;
    const [acceptedFile, setAcceptedFile] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const onDrop = useCallback(([file]) => {
        setAcceptedFile('');
        setErrorMsg(null);
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            const contents = e.target.result;
            try {
                const parsed = JSON.parse(contents);
                setAcceptedFile({
                    name: file.name,
                    size: prettyBytes(file.size),
                    contents: JsonBeautifier(parsed, null, 4, 5)
                });
                passFileContent(parsed);
            } catch (e) {
                console.error(e);
                setErrorMsg(i18n.t('common.dropzone.errors.bad-json-format'))
            }
        };
        reader.readAsText(file);
    }, []);
    const {
        getRootProps,
        getInputProps,
        fileRejections,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: fileAccept,
        validator: validateJsonFile,
        maxFiles: 1,
        onDrop,
    });
    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    const fileRejectionItems = fileRejections.map(({file, errors}) => {
        return <li key={file.path}>
            {file.path} - {prettyBytes(file.size)}
            <ul>
                {errors.map(e => {
                    if (e.code === 'file-invalid-type') {
                        e.message = i18n.t('common.dropzone.errors.not-supported-type');
                    }
                    return <li key={e.code}>{e.message}</li>;
                })}
            </ul>
        </li>;
    });

    return (
        <section className="container">
            <div {...getRootProps({style})} {...getRootProps({className: 'dropzone'})}>
                <input {...getInputProps()} />
                <p>{i18n.t('common.dropzone.title')}</p>
            </div>

            <aside>
                {
                    fileRejectionItems &&

                    <ul>
                        {fileRejectionItems}
                    </ul>
                }
                {
                    acceptedFile && <>
                        <div>
                            {acceptedFile.name} - {acceptedFile.size}
                        </div>
                        <Highlight language="javascript">
                            {acceptedFile.contents}
                        </Highlight>
                    </>
                }
                <small>{errorMsg}</small>
            </aside>
        </section>
    );
}

export default Dropzone;
