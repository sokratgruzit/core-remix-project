// eslint-disable-next-line no-use-before-define
import React from "react";
import { EnvironmentProps } from "../types";
import { CustomTooltip } from "@remix-ui/helper";

export function EnvironmentUI(props: EnvironmentProps) {
  const handleChangeExEnv = () => {
    const provider = props.providers.providerList[0];
    const fork = provider.fork; // can be undefined if connected to an external source (External Http Provider / injected)
    let context = provider.value;

    context = context.startsWith("vm") ? "vm" : context;

    props.setExecutionContext({ context, fork });
  };

  const currentProvider = props.providers.providerList[0];

  return (
    <div className="udapp_crow">
      <div className="d-flex justify-content-between pb-2">
        <label
          onClick={() => {
            handleChangeExEnv();
          }}
          id="selectExEnv"
          className="udapp_settingsLabel font-14 text-white "
        >
          Environment
        </label>
        <div className="d-flex align-center">
          <span
            onClick={() => {
              handleChangeExEnv();
            }}
            className="connectButton cursor-pointer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.74984 13.3334H11.2498C13.3332 13.3334 14.5832 11.8334 14.5832 10.0001V5.75842C14.5832 4.88342 13.8665 4.16675 12.9915 4.16675H7.01652C6.14152 4.16675 5.42485 4.88342 5.42485 5.75842V10.0001C5.41651 11.8334 6.6665 13.3334 8.74984 13.3334Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.91699 1.66675V4.16675"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.083 1.66675V4.16675"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 18.3333V13.3333"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <CustomTooltip
            placement={"bottom-start"}
            tooltipClasses="text-wrap cursor-pointer"
            tooltipId="runAndDeployAddresstooltip"
            tooltipText={"Click for docs about Environment"}
          >
            <a
              href="https://remix-ide.readthedocs.io/en/latest/run.html#environment"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 6.45825V10.8333"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.5665 7.15011V12.8501C17.5665 13.7834 17.0665 14.6501 16.2582 15.1251L11.3082 17.9834C10.4998 18.4501 9.49981 18.4501 8.68315 17.9834L3.73314 15.1251C2.92481 14.6584 2.4248 13.7917 2.4248 12.8501V7.15011C2.4248 6.21678 2.92481 5.35008 3.73314 4.87508L8.68315 2.01675C9.49148 1.55008 10.4915 1.55008 11.3082 2.01675L16.2582 4.87508C17.0665 5.35008 17.5665 6.20844 17.5665 7.15011Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 13.5V13.5833"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </CustomTooltip>
        </div>
      </div>
      <div className="udapp_environment">
        <div
          id="selectExEnvOptions"
          data-id="settingsSelectEnvOptions"
          className="udapp_selectExEnvOptions"
        >
          <div
            id="dropdown-custom-components"
            className="btn w-100 d-inline-block form-control connectToENV"
          >
            {currentProvider && currentProvider.content}
          </div>
        </div>
      </div>
    </div>
  );
}
