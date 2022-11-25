/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { CornerDecorRed } from "@remix-ui/helper";
const _paq = (window._paq = window._paq || []); // eslint-disable-line

function HomeTabScamAlert() {
  return (
    <div
      className=""
      style={{ paddingTop: "55px", paddingBottom: "55px" }}
      id="hTScamAlertSection"
    >
      <div
        className="ml-2 mb-1 d-flex flex-column  position-relative"
        style={{ padding: "34px", height: "165px" }}
      >
        <CornerDecorRed />
        <span
          className="mt-2  d-flex align-items-center"
          style={{ gap: "10px" }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.5099 5.85L13.5699 2.42C12.5999 1.86 11.3999 1.86 10.4199 2.42L4.48992 5.85C3.51992 6.41 2.91992 7.45 2.91992 8.58V15.42C2.91992 16.54 3.51992 17.58 4.48992 18.15L10.4299 21.58C11.3999 22.14 12.5999 22.14 13.5799 21.58L19.5199 18.15C20.4899 17.59 21.0899 16.55 21.0899 15.42V8.58C21.0799 7.45 20.4799 6.42 19.5099 5.85ZM11.2499 7.75C11.2499 7.34 11.5899 7 11.9999 7C12.4099 7 12.7499 7.34 12.7499 7.75V13C12.7499 13.41 12.4099 13.75 11.9999 13.75C11.5899 13.75 11.2499 13.41 11.2499 13V7.75ZM12.9199 16.63C12.8699 16.75 12.7999 16.86 12.7099 16.96C12.5199 17.15 12.2699 17.25 11.9999 17.25C11.8699 17.25 11.7399 17.22 11.6199 17.17C11.4899 17.12 11.3899 17.05 11.2899 16.96C11.1999 16.86 11.1299 16.75 11.0699 16.63C11.0199 16.51 10.9999 16.38 10.9999 16.25C10.9999 15.99 11.0999 15.73 11.2899 15.54C11.3899 15.45 11.4899 15.38 11.6199 15.33C11.9899 15.17 12.4299 15.26 12.7099 15.54C12.7999 15.64 12.8699 15.74 12.9199 15.87C12.9699 15.99 12.9999 16.12 12.9999 16.25C12.9999 16.38 12.9699 16.51 12.9199 16.63Z"
              fill="#E94B4B"
            />
          </svg>

          <b style={{ fontSize: "14px", lineHeight: "20px", color: "#E94B4B" }}>
            Scam Alerts:
          </b>
        </span>
        <span className="mt-2 text-white font-12">
          The only CORE uses is core.multichain.org
        </span>
        <span className="mt-1 text-white font-12">
          Beware of online videos promoting "liquidity front runner bots":
          <a
            className="pl-2 text-blue font-12"
            onClick={() =>
              _paq.push(["trackEvent", "hometab", "scamAlert", "learnMore"])
            }
            target="__blank"
            href="https://medium.com/remix-ide/remix-in-youtube-crypto-scams-71c338da32d"
          >
            Learn more
          </a>
        </span>
        <span className="mt-1 text-white font-12">
          Additional safety tips: &nbsp;
          <a
            className="text-blue font-12"
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
