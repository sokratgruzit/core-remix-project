// eslint-disable-next-line no-use-before-define
import React, { useRef, useState, useEffect } from "react";
import { RecorderProps } from "../types";
import { CustomTooltip } from "@remix-ui/helper";

export function RecorderUI(props: RecorderProps) {
  const inputLive = useRef<HTMLInputElement>();
  const [toggleExpander, setToggleExpander] = useState<boolean>(false);
  const [enableRunButton, setEnableRunButton] = useState<boolean>(true);
  const triggerRecordButton = () => {
    props.storeScenario(props.scenarioPrompt);
  };

  const handleClickRunButton = () => {
    const liveMode = inputLive.current ? inputLive.current.checked : false;
    props.runCurrentScenario(
      liveMode,
      props.gasEstimationPrompt,
      props.passphrasePrompt,
      props.mainnetPrompt
    );
  };

  useEffect(() => {
    if (props.currentFile && props.currentFile.endsWith(".json"))
      setEnableRunButton(false);
    else setEnableRunButton(true);
  }, [props.currentFile]);

  const toggleClass = () => {
    setToggleExpander(!toggleExpander);
  };

  return (
    <div className="udapp_cardContainer list-group-item border border-bottom">
      <div
        className="udapp_recorderSection d-flex justify-content-between"
        onClick={toggleClass}
      >
        <div className="d-flex justify-content-center align-items-center">
          <CustomTooltip
            placement={"right"}
            tooltipClasses="text-wrap"
            tooltipId="info-recorder"
            tooltipText="Save transactions (deployed contracts and function executions) and replay them in another environment e.g Transactions created in Remix VM can be replayed in the Injected Provider."
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
          </CustomTooltip>
          <label className="udapp_recorderSectionLabel font-12 text-dark">
            Transactions recorded
          </label>
          <CustomTooltip
            placement={"right"}
            tooltipClasses="text-nowrap"
            tooltipId="recordedTransactionsCounttooltip"
            tooltipText={"The number of recorded transactions"}
          >
            <div
              className="ml-2 text-center"
              style={{ color: "#FF7152" }}
              data-title="The number of recorded transactions"
            >
              ({props.count})
            </div>
          </CustomTooltip>
        </div>
        <div className="p-3">
          <span data-id="udappRecorderTitleExpander" onClick={toggleClass}>
            <i
              className={
                !toggleExpander ? "fas fa-angle-right" : "fas fa-angle-down"
              }
              aria-hidden="true"
            ></i>
          </span>
        </div>
      </div>
      <div className={`flex-column ${toggleExpander ? "d-flex" : "d-none"}`}>
        <div className="mb-1 mt-1 fmt-2 custom-control custom-checkbox mb-1">
          <input
            ref={inputLive}
            type="checkbox"
            id="livemode-recorder"
            className="custom-control-input custom-select"
            name="input-livemode"
          />
          <CustomTooltip
            placement={"right"}
            tooltipClasses="text-wrap"
            tooltipId="tooltip-livemode-recorder"
            tooltipText="If contracts are updated after recording transactions, checking this box will run recorded transactions with the latest copy of the compiled contracts"
          >
            <label
              className="form-check-label custom-control-label"
              data-id="runtabLivemodeInput"
              htmlFor="livemode-recorder"
            >
              Run transactions using the latest compilation result
            </label>
          </CustomTooltip>
        </div>
        <div className="mb-1 mt-1 udapp_transactionActions">
          <CustomTooltip
            placement={"bottom-start"}
            tooltipClasses="text-nowrap"
            tooltipId="remixUdappTransactionSavetooltip"
            tooltipText={
              props.count === 0
                ? "No transactions to save"
                : props.count === 1
                ? `Save ${props.count} transaction as scenario file`
                : `Save ${props.count} transactions as scenario file`
            }
          >
            <span>
              <button
                className="btn btn-sm btn-info savetransaction udapp_recorder"
                disabled={props.count === 0 ? true : false}
                onClick={triggerRecordButton}
                style={{ pointerEvents: props.count === 0 ? "none" : "auto" }}
              >
                Save
              </button>
            </span>
          </CustomTooltip>
          <CustomTooltip
            placement={"right"}
            tooltipClasses="text-nowrap"
            tooltipId="tooltip-run-recorder"
            tooltipText="Run transaction(s) from the current scenario file"
          >
            <span>
              <button
                className="btn btn-sm btn-info runtransaction udapp_runTxs"
                data-id="runtransaction"
                disabled={enableRunButton}
                onClick={handleClickRunButton}
                style={{ pointerEvents: enableRunButton ? "none" : "auto" }}
              >
                Run
              </button>
            </span>
          </CustomTooltip>
        </div>
      </div>
    </div>
  );
}
