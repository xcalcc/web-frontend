import React from "react";
import * as utils from "Utils";

const FileTooLarge = ({scanTaskId, dsrType, filePath, heightStyle}) => (
    <div>
      <div className="no-sourcecode" style={heightStyle}>
        <div className="small">
          <p>{utils.language("source_code_file_too_large")}</p>
          <p>
            <a href={`/source-code?scan_task_id=${scanTaskId}&dsr_type=${dsrType}&file=${encodeURIComponent(filePath)}`} target="_blank">
              {utils.language("open_source_code_file")}
            </a>
          </p>
        </div>
      </div>
    </div>
);

export default FileTooLarge;