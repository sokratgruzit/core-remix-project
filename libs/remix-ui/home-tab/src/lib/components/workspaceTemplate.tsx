/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext } from "react";
import CornerDecor from "../../../../app/src/lib/remix-app/components/CornerDecor/CornerDecor";
interface WorkspaceTemplateProps {
  gsID: string;
  workspaceTitle: string;
  callback: any;
  description: string;
}

function WorkspaceTemplate({
  gsID,
  workspaceTitle,
  description,
  callback,
}: WorkspaceTemplateProps) {
  return (
    <div className="d-flex remixui_home_workspaceTemplate">
      <button
        className="btn p-1 d-flex flex-column  text-nowrap justify-content-center align-items-center mr-2 remixui_home_workspaceTemplate"
        data-id={"landingPageStart" + gsID}
        style={{ position: "relative" }}
        onClick={() => callback()}
      >
        <CornerDecor />
        <div className="mb-2 w-100 p-2 h-100 align-items-start d-flex flex-column">
          <label className="h6 pb-1 text-uppercase remixui_home_cursorStyle">
            {workspaceTitle}
          </label>
          <div
            className="remixui_home_gtDescription"
            style={{ color: "#808287" }}
          >
            {description}
          </div>
        </div>
      </button>
    </div>
  );
}

export default WorkspaceTemplate;
