/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../themeContext";
import { CornerDecor } from "@remix-ui/helper";

declare global {
  interface Window {
    _paq: any;
  }
}
const _paq = (window._paq = window._paq || []); //eslint-disable-line
interface HomeTabLearnProps {
  plugin: any;
  width: number | undefined;
}

function HomeTabLearn({ plugin, width }: HomeTabLearnProps) {
  const themeFilter = useContext(ThemeContext);

  const openLink = () => {
    window.open(
      "https://remix-ide.readthedocs.io/en/latest/remix_tutorials_learneth.html?highlight=learneth#learneth-tutorial-repos",
      "_blank"
    );
  };

  const startLearnEthTutorial = async (tutorial) => {
    await plugin.appManager.activatePlugin([
      "solidity",
      "LearnEth",
      "solidityUnitTesting",
    ]);
    plugin.call(
      "LearnEth",
      "startTutorial",
      "ethereum/remix-workshops",
      "master",
      tutorial
    );
    plugin.verticalIcons.select("LearnEth");
    _paq.push(["trackEvent", "hometab", "startLearnEthTutorial", tutorial]);
  };

  return (
    <div
      className="d-flex pl-2 pb-2 pt-2 d-flex flex-column"
      id="hTLearnSection"
    >
      <div
        className="d-flex position-relative flex-column mainLearnWrapper"
        style={{ padding: "20px" }}
      >
        <CornerDecor />
        <button
          onClick={() => openLink()}
          className="h-100 px-0 pt-0 btn learnIcon"
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13.43 4.91401C11.0307 3.7685 7.67723 3.20737 3.1875 3.18745C2.76408 3.1817 2.34896 3.30517 1.9975 3.54139C1.70903 3.73638 1.47288 3.99927 1.30985 4.30693C1.14681 4.6146 1.06187 4.95761 1.0625 5.30581V24.3046C1.0625 25.5889 1.97625 26.5578 3.1875 26.5578C7.907 26.5578 12.6411 26.9987 15.4766 29.6789C15.5154 29.7157 15.5642 29.7403 15.6169 29.7497C15.6695 29.7591 15.7238 29.7527 15.7729 29.7315C15.822 29.7103 15.8638 29.6751 15.893 29.6303C15.9223 29.5856 15.9378 29.5332 15.9375 29.4797V7.09346C15.9376 6.94243 15.9053 6.79312 15.8428 6.65565C15.7802 6.51817 15.6889 6.39573 15.5749 6.29659C14.9254 5.74132 14.2039 5.27627 13.43 4.91401Z" />
            <path d="M32.0025 3.53945C31.6509 3.30381 31.2357 3.18103 30.8125 3.1875C26.3228 3.20742 22.9693 3.7659 20.57 4.91406C19.7961 5.27566 19.0744 5.7398 18.4244 6.29398C18.3107 6.3933 18.2196 6.51579 18.1572 6.65324C18.0948 6.79068 18.0625 6.9399 18.0625 7.09086V29.4784C18.0625 29.5298 18.0776 29.5801 18.106 29.6229C18.1345 29.6657 18.1749 29.6992 18.2223 29.7191C18.2697 29.739 18.3219 29.7445 18.3724 29.7349C18.4229 29.7253 18.4694 29.701 18.5061 29.665C20.2107 27.9716 23.2023 26.5559 30.8152 26.5565C31.3787 26.5565 31.9192 26.3326 32.3178 25.9341C32.7163 25.5356 32.9402 24.9951 32.9402 24.4315V5.30652C32.9409 4.95764 32.8558 4.61393 32.6923 4.30575C32.5287 3.99757 32.2918 3.73439 32.0025 3.53945Z" />
          </svg>
        </button>
        <p className="font-12 text-white mb-3 mt-2">Learn</p>
        <div
          className={`learnItemsWrapper ${
            width < 700 && "learnItemsWrapperSml"
          }`}
        >
          <div className="d-flex flex-column learnItem">
            <div className="pt-2 d-flex flex-column text-left">
              <label className="m-0 font-12 text-white">Remix Basics</label>
              <span>
                Introduction to Remix's interface and concepts used in Ethereum,
                as well as the basics of Solidity.
              </span>
            </div>
            <button
              className="btn btn-sm grayBtn w-100 mt-2"
              style={{ width: "fit-content" }}
              onClick={() => startLearnEthTutorial("basics")}
            >
              Get Started
            </button>
          </div>
          <div className="d-flex flex-column learnItem">
            <div className="pt-2 d-flex flex-column text-left">
              <label className="m-0 font-12 text-white">
                Remix Intermediate
              </label>
              Using the web3.js to interact with a contract. Using Recorder
              tool.
            </div>
            <button
              className="btn btn-sm grayBtn w-100 mt-2"
              style={{ width: "fit-content" }}
              onClick={() => startLearnEthTutorial("useofweb3js")}
            >
              Get Started
            </button>
          </div>
          <div className="d-flex flex-column learnItem btn">
            <div className="pt-2 d-flex flex-column text-left font-12 text-dark">
              <label className="m-0 font-12 text-white">Remix Advanced</label>
              Learn the Proxy Pattern and working with Libraries in Remix. Learn
              to use the Debugger.
            </div>
            <button
              className="btn btn-sm grayBtn w-100 mt-2"
              style={{ width: "fit-content" }}
              onClick={() => startLearnEthTutorial("deploylibraries")}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeTabLearn;
