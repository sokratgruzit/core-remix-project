/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext } from "react";
import { CornerDecor } from "@remix-ui/helper";

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
        className="btn  d-flex flex-column  text-nowrap justify-content-center align-items-center remixui_home_workspaceTemplate"
        data-id={"landingPageStart" + gsID}
        style={{ position: "relative", padding: "20px", marginRight: "20px" }}
        onClick={() => callback()}
      >
        <CornerDecor />
        <div className="w-100  h-100 align-items-start d-flex flex-column">
          <label className="text-uppercase remixui_home_cursorStyle">
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
