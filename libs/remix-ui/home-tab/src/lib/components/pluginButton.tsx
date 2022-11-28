/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext } from "react";
import { ThemeContext } from "../themeContext";
import { CustomTooltip } from "@remix-ui/helper";
import { CornerDecor } from "@remix-ui/helper";
import { inherits } from "util";
interface PluginButtonProps {
  imgPath: string;
  envID: string;
  envText: string;
  callback: any;
  l2?: boolean;
  description: string;
  remixMaintained?: boolean;
  width: number | undefined;
}

function PluginButton({
  imgPath,
  envID,
  envText,
  callback,
  l2,
  description,
  remixMaintained,
  width,
}: PluginButtonProps) {
  const themeFilter = useContext(ThemeContext);

  return (
    <div
      className={`d-flex remixui_home_envButton ${
        remixMaintained && "solidityPluginItem"
      } ${remixMaintained && width < 840 && "smlSolidityPluginItem"}`}
      style={{ width: width < 440 && "100%" }}
    >
      <CornerDecor />
      {remixMaintained && (
        <img
          src={"assets/img/pluginsSolidity.webp"}
          style={{
            flex: "1",
            height: "100%",
            width: "100%",
            position: "absolute",
            zIndex: "0",
          }}
          alt=""
        ></img>
      )}

      <button
        className="btn d-flex flex-column  pb-2 text-nowrap justify-content-center align-items-center remixui_home_envButton"
        data-id={"landingPageStart" + envText}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          padding: "20px",
        }}
        onClick={() => callback()}
      >
        <img
          className="px-2 mb-3  remixui_home_envLogo"
          id={envID}
          src={imgPath}
          alt=""
          style={{ filter: themeFilter.filter }}
        />
        <div className="mb-3 h-100 w-100 d-flex flex-column">
          <label className="text-uppercase remixui_home_cursorStyle">
            {envText}
          </label>
          <div className="remixui_home_envLogoDescription">{description}</div>
        </div>
      </button>
      {l2 && (
        <label className="bg-light mx-1 px-1 mb-0 mx-2 position-absolute remixui_home_l2Label">
          L2
        </label>
      )}
      {remixMaintained && (
        <CustomTooltip
          placement="bottom"
          tooltipId="overlay-tooltip-run-script"
          tooltipText={"Maintained by Remix"}
        >
          <i className="bg-light text-success mx-1 px-1 mb-0 mx-2 position-absolute remixui_home_maintainedLabel fas fa-check"></i>
        </CustomTooltip>
      )}
    </div>
  );
}

export default PluginButton;
