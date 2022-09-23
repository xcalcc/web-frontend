import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import * as actions from 'Actions';
import * as utils from "Utils";
import Loader from 'Components/Loader';
import "./style.scss";

const SourceCode = props => {
    let dispatch = useDispatch();
    let params = utils.queryString();

    const [isLoading, setLoading] = useState(true);
    const [sourceCodeText, setSourceCodeText] = useState();

    try {
        let head = document.getElementsByTagName("head")[0];
        let links = head.getElementsByTagName("link");
        links.forEach((link) => {
            if(link.attributes.rel.value === 'stylesheet') {
                head.removeChild(link);
            }
        });
    } catch{ }

    useEffect(() => {
        (async () => {
            let index = 0;
            const response = await dispatch(actions.fetchScanFile({
                scanTaskId: params.scan_task_id, 
                dsrType: params.dsr_type,
                filePath: decodeURIComponent(params.file)
            }));

            setLoading(false);

            if(response.error) {
                setSourceCodeText(utils.getApiMessage(response.error));
                return;
            }

            let text = response.data || '';
            text = (++index) + '\t' +  text;
            text = text.replace(/\n/g, () => {
                return '\n' + (++index) + '\t'
            });
            setSourceCodeText(text);           
        })();
    }, []);

    return (
        <>
            {isLoading && <Loader />}
            <pre className="source-code">
                {sourceCodeText}
            </pre>
        </>
    )
}

export default SourceCode;
