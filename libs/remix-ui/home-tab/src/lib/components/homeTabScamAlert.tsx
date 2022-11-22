/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
const _paq = (window._paq = window._paq || []); // eslint-disable-line

function HomeTabScamAlert() {
  return (
    <div
      className=""
      style={{ paddingTop: "55px", paddingBottom: "55px" }}
      id="hTScamAlertSection"
    >
      <label className="pl-2 text-danger" style={{ fontSize: "1.2rem" }}>
        Scam Alert
      </label>
      <div className="py-2 ml-2 mb-1 align-self-end d-flex flex-column border border-danger">
        <span className="pl-4 mt-2">
          <i className="pr-2 text-danger fas fa-exclamation-triangle"></i>
          <b>Scam Alerts:</b>
        </span>
        <span className="pl-4 mt-1">
          The only URL Remix uses is remix.ethereum.org
        </span>
        <span className="pl-4 mt-1">
          Beware of online videos promoting "liquidity front runner bots":
          <a
            className="pl-2 remixui_home_text"
            onClick={() =>
              _paq.push(["trackEvent", "hometab", "scamAlert", "learnMore"])
            }
            target="__blank"
            href="https://medium.com/remix-ide/remix-in-youtube-crypto-scams-71c338da32d"
          >
            Learn more
          </a>
        </span>
        <span className="pl-4 mt-1">
          Additional safety tips: &nbsp;
          <a
            className="remixui_home_text"
            onClick={() =>
              _paq.push(["trackEvent", "hometab", "scamAlert", "safetyTips"])
            }
            target="__blank"
            href="https://remix-ide.readthedocs.io/en/latest/security.html"
          >
            here
          </a>
        </span>
      </div>
    </div>
  );
}

export default HomeTabScamAlert;
