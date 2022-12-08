// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState, useRef } from "react";
import { CopyToClipboard } from "@remix-ui/clipboard";
import { AccountProps } from "../types";
import { PassphrasePrompt } from "./passphrase";
import { CustomTooltip } from "@remix-ui/helper";

export function AccountUI(props: AccountProps) {
  const { selectedAccount, loadedAccounts } = props.accounts;
  const accounts = Object.keys(loadedAccounts);
  const [plusOpt, setPlusOpt] = useState({
    classList: "",
    title: "",
  });
  const messageRef = useRef("");

  useEffect(() => {
    if (!selectedAccount && accounts.length > 0) props.setAccount(accounts[0]);
  }, [accounts, selectedAccount]);

  useEffect(() => {
    switch (props.selectExEnv) {
      case "injected":
        setPlusOpt({
          classList: "udapp_disableMouseEvents",
          title:
            "Unfortunately it's not possible to create an account using injected provider. Please create the account directly from your provider (i.e metamask or other of the same type).",
        });
        break;

      case "vm-london":
        setPlusOpt({
          classList: "",
          title: "Create a new account",
        });
        break;

      case "vm-berlin":
        setPlusOpt({
          classList: "",
          title: "Create a new account",
        });
        break;

      case "web3":
        if (!props.personalMode) {
          setPlusOpt({
            classList: "disableMouseEvents",
            title:
              "Creating an account is possible only in Personal mode. Please go to Settings to enable it.",
          });
        } else {
          setPlusOpt({
            classList: "",
            title: "Create a new account",
          });
        }
        break;

      default:
        setPlusOpt({
          classList: "disableMouseEvents",
          title: `Unfortunately it's not possible to create an account using an external wallet (${props.selectExEnv}).`,
        });
    }
    // this._deps.config.get('settings/personal-mode')
  }, [props.selectExEnv, props.personalMode]);

  const newAccount = () => {
    props.createNewBlockchainAccount(passphraseCreationPrompt());
  };

  const signMessage = () => {
    if (!accounts[0]) {
      return props.tooltip(
        "Account list is empty, please make sure the current provider is properly connected to remix"
      );
    }

    if (
      props.selectExEnv !== "vm-london" &&
      props.selectExEnv !== "vm-berlin" &&
      props.selectExEnv !== "injected"
    ) {
      return props.modal(
        "Passphrase to sign a message",
        <PassphrasePrompt
          message="Enter your passphrase for this account to sign the message"
          setPassphrase={props.setPassphrase}
        />,
        "OK",
        () => {
          props.modal(
            "Sign a message",
            signMessagePrompt(),
            "OK",
            () => {
              props.signMessageWithAddress(
                selectedAccount,
                messageRef.current,
                signedMessagePrompt,
                props.passphrase
              );
              props.setPassphrase("");
            },
            "Cancel",
            null
          );
        },
        "Cancel",
        () => {
          props.setPassphrase("");
        }
      );
    }

    props.modal(
      "Sign a message",
      signMessagePrompt(),
      "OK",
      () => {
        props.signMessageWithAddress(
          selectedAccount,
          messageRef.current,
          signedMessagePrompt
        );
      },
      "Cancel",
      null
    );
  };

  const handlePassphrase = (e) => {
    props.setPassphrase(e.target.value);
  };

  const handleMatchPassphrase = (e) => {
    props.setMatchPassphrase(e.target.value);
  };

  const handleMessageInput = (e) => {
    messageRef.current = e.target.value;
  };

  const passphraseCreationPrompt = () => {
    return (
      <div>
        {" "}
        Please provide a Passphrase for the account creation
        <div>
          <input
            id="prompt1"
            type="password"
            name="prompt_text"
            style={{ width: "100%" }}
            onInput={handlePassphrase}
          />
          <br />
          <br />
          <input
            id="prompt2"
            type="password"
            name="prompt_text"
            style={{ width: "100%" }}
            onInput={handleMatchPassphrase}
          />
        </div>
      </div>
    );
  };

  const signMessagePrompt = () => {
    return (
      <div>
        {" "}
        Enter a message to sign
        <div>
          <textarea
            id="prompt_text"
            data-id="signMessageTextarea"
            style={{ width: "100%" }}
            rows={4}
            cols={50}
            onInput={handleMessageInput}
            defaultValue={messageRef.current}
          ></textarea>
        </div>
      </div>
    );
  };

  const signedMessagePrompt = (msgHash: string, signedData: string) => {
    return (
      <div>
        <b>hash:</b>
        <br />
        <span id="remixRunSignMsgHash" data-id="settingsRemixRunSignMsgHash">
          {msgHash}
        </span>
        <br />
        <b>signature:</b>
        <br />
        <span
          id="remixRunSignMsgSignature"
          data-id="settingsRemixRunSignMsgSignature"
        >
          {signedData}
        </span>
      </div>
    );
  };

  return (
    <div className="udapp_crow">
      <div
        className="d-flex align-items-center justify-content-between"
        style={{ paddingBottom: "4px" }}
      >
        <label className="udapp_settingsLabel font-14 text-white mb-0">
          Account
        </label>
        <div className="d-flex align-items-center">
          <CustomTooltip
            placement={"top-start"}
            tooltipClasses="text-wrap"
            tooltipId="remixPlusWrapperTooltip"
            tooltipText={plusOpt.title}
          >
            <span id="remixRunPlusWraper" className="connectButton">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
                className={`fas fa-plus-circle udapp_icon ${plusOpt.classList}`}
                id="remixRunPlus"
                aria-hidden="true"
                onClick={newAccount}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 3.25C8.20979 3.25 6.4929 3.96116 5.22703 5.22703C3.96116 6.4929 3.25 8.20979 3.25 10C3.25 10.8864 3.42459 11.7642 3.76381 12.5831C4.10303 13.4021 4.60023 14.1462 5.22703 14.773C5.85382 15.3998 6.59794 15.897 7.41689 16.2362C8.23583 16.5754 9.11358 16.75 10 16.75C10.8864 16.75 11.7642 16.5754 12.5831 16.2362C13.4021 15.897 14.1462 15.3998 14.773 14.773C15.3998 14.1462 15.897 13.4021 16.2362 12.5831C16.5754 11.7642 16.75 10.8864 16.75 10C16.75 8.20979 16.0388 6.4929 14.773 5.22703C13.5071 3.96116 11.7902 3.25 10 3.25ZM4.16637 4.16637C5.71354 2.61919 7.81196 1.75 10 1.75C12.188 1.75 14.2865 2.61919 15.8336 4.16637C17.3808 5.71354 18.25 7.81196 18.25 10C18.25 11.0834 18.0366 12.1562 17.622 13.1571C17.2074 14.1581 16.5997 15.0675 15.8336 15.8336C15.0675 16.5997 14.1581 17.2074 13.1571 17.622C12.1562 18.0366 11.0834 18.25 10 18.25C8.91659 18.25 7.8438 18.0366 6.84286 17.622C5.84192 17.2074 4.93245 16.5997 4.16637 15.8336C3.40029 15.0675 2.7926 14.1581 2.37799 13.1571C1.96339 12.1562 1.75 11.0834 1.75 10C1.75 7.81196 2.61919 5.71354 4.16637 4.16637ZM10 6.75C10.4142 6.75 10.75 7.08579 10.75 7.5V9.25H12.5C12.9142 9.25 13.25 9.58579 13.25 10C13.25 10.4142 12.9142 10.75 12.5 10.75H10.75V12.5C10.75 12.9142 10.4142 13.25 10 13.25C9.58579 13.25 9.25 12.9142 9.25 12.5V10.75H7.5C7.08579 10.75 6.75 10.4142 6.75 10C6.75 9.58579 7.08579 9.25 7.5 9.25H9.25V7.5C9.25 7.08579 9.58579 6.75 10 6.75Z"
                />
              </svg>
            </span>
          </CustomTooltip>
          <CopyToClipboard
            tip="Copy account to clipboard"
            content={selectedAccount}
            direction="top"
          >
            <button
              className="btn text-dark p-0"
              style={{ marginRight: "8px" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.3337 10.7501V14.2501C13.3337 17.1667 12.167 18.3334 9.25033 18.3334H5.75033C2.83366 18.3334 1.66699 17.1667 1.66699 14.2501V10.7501C1.66699 7.83341 2.83366 6.66675 5.75033 6.66675H9.25033C12.167 6.66675 13.3337 7.83341 13.3337 10.7501Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.3337 5.75008V9.25008C18.3337 12.1667 17.167 13.3334 14.2503 13.3334H13.3337V10.7501C13.3337 7.83341 12.167 6.66675 9.25033 6.66675H6.66699V5.75008C6.66699 2.83341 7.83366 1.66675 10.7503 1.66675H14.2503C17.167 1.66675 18.3337 2.83341 18.3337 5.75008Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </CopyToClipboard>
          <CustomTooltip
            placement={"top-start"}
            tooltipClasses="text-nowrap"
            tooltipId="remixSignMsgTooltip"
            tooltipText={"Sign a message using this account"}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              id="remixRunSignMsg"
              data-id="settingsRemixRunSignMsg"
              aria-hidden="true"
              onClick={signMessage}
              className="cursor-pointer"
            >
              <path
                d="M9.16699 1.66675H7.50033C3.33366 1.66675 1.66699 3.33341 1.66699 7.50008V12.5001C1.66699 16.6667 3.33366 18.3334 7.50033 18.3334H12.5003C16.667 18.3334 18.3337 16.6667 18.3337 12.5001V10.8334"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.3666 2.51663L6.7999 9.0833C6.5499 9.3333 6.2999 9.82497 6.2499 10.1833L5.89157 12.6916C5.75823 13.6 6.3999 14.2333 7.30823 14.1083L9.81657 13.75C10.1666 13.7 10.6582 13.45 10.9166 13.2L17.4832 6.6333C18.6166 5.49997 19.1499 4.1833 17.4832 2.51663C15.8166 0.849966 14.4999 1.3833 13.3666 2.51663Z"
                stroke="white"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.4248 3.45825C12.9831 5.44992 14.5415 7.00825 16.5415 7.57492"
                stroke="white"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </CustomTooltip>
        </div>
      </div>
      <div className="udapp_account">
        <select
          id="txorigin"
          data-id="runTabSelectAccount"
          name="txorigin"
          className="udapp_select custom-select pr-4"
          value={selectedAccount}
          onChange={(e) => {
            props.setAccount(e.target.value);
          }}
        >
          {accounts.map((value, index) => (
            <option value={value} key={index}>
              {loadedAccounts[value]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
