import { CopyToClipboard } from "@remix-ui/clipboard";
import { CustomTooltip } from "@remix-ui/helper";
import React, { useEffect, useState } from "react";
import { EtherscanSettingsProps } from "../types";
import {
  etherscanTokenTitle,
  etherscanAccessTokenText,
  etherscanTokenLink,
} from "./constants";

export function EtherscanSettings(props: EtherscanSettingsProps) {
  const [etherscanToken, setEtherscanToken] = useState<string>("");

  useEffect(() => {
    if (props.config) {
      const etherscanToken =
        props.config.get("settings/etherscan-access-token") || "";
      setEtherscanToken(etherscanToken);
    }
  }, [props.config]);

  const handleChangeTokenState = (event) => {
    setEtherscanToken(event.target.value);
  };

  // api key settings
  const saveEtherscanToken = () => {
    props.saveToken(etherscanToken);
  };

  const removeToken = () => {
    setEtherscanToken("");
    props.removeToken();
  };

  return (
    <div className="border-top">
      <div className="card-body pt-3 pb-2">
        <h6 className="card-title">{etherscanTokenTitle}</h6>
        <p className="mb-1">{etherscanAccessTokenText}</p>
        <p className="">
          <a
            className="outsideLinks mb-1"
            target="_blank"
            href={etherscanTokenLink}
          >
            Go to Etherscan api key page
          </a>
          &nbsp;to create a new api key and save it in Remix.
        </p>
        <div>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="mb-0 pb-0 font-14 text-white">TOKEN:</label>
            <div className="input-group-append">
              <CopyToClipboard
                content={etherscanToken}
                data-id="copyToClipboardCopyIcon"
                direction={"top"}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.3346 10.7501V14.2501C13.3346 17.1667 12.168 18.3334 9.2513 18.3334H5.7513C2.83464 18.3334 1.66797 17.1667 1.66797 14.2501V10.7501C1.66797 7.83341 2.83464 6.66675 5.7513 6.66675H9.2513C12.168 6.66675 13.3346 7.83341 13.3346 10.7501Z"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.3346 5.75008V9.25008C18.3346 12.1667 17.168 13.3334 14.2513 13.3334H13.3346V10.7501C13.3346 7.83341 12.168 6.66675 9.2513 6.66675H6.66797V5.75008C6.66797 2.83341 7.83464 1.66675 10.7513 1.66675H14.2513C17.168 1.66675 18.3346 2.83341 18.3346 5.75008Z"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </CopyToClipboard>
            </div>
          </div>
          <div className="input-group text-secondary mb-0 h6">
            <input
              id="etherscanAccessToken"
              data-id="settingsTabEtherscanAccessToken"
              type="password"
              className="form-control"
              onChange={(e) => handleChangeTokenState(e)}
              value={etherscanToken}
            />
          </div>
        </div>
        <div>
          <div className="text-secondary mb-0 h6">
            <div className="d-flex pt-2" style={{ gap: "13px" }}>
              <input
                className="btn btn-sm btn-primary w-50"
                id="saveetherscantoken"
                data-id="settingsTabSaveEtherscanToken"
                onClick={saveEtherscanToken}
                value="Save"
                type="button"
                disabled={etherscanToken === ""}
              ></input>
              <CustomTooltip
                tooltipText="Delete Etherscan token"
                tooltipClasses="text-nowrap"
                tooltipId="removeetherscantokenTooltip"
                placement="left-start"
              >
                <button
                  className="btn btn-sm btn-secondary w-50"
                  id="removeetherscantoken"
                  data-id="settingsTabRemoveEtherscanToken"
                  title="Delete Etherscan token"
                  onClick={removeToken}
                >
                  Remove
                </button>
              </CustomTooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
