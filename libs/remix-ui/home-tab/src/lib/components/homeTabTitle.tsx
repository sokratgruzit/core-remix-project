/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import BasicLogo from "libs/remix-ui/vertical-icons-panel/src/lib/components/BasicLogo";
import { ThemeContext } from "../themeContext";
import React, { useEffect, useState, useRef, useContext } from "react";

import HomeTabFile from "./homeTabFile";
import { CustomTooltip } from "@remix-ui/helper";
const _paq = (window._paq = window._paq || []); // eslint-disable-line

interface HomeTabFileProps {
  plugin: any;
}

function HomeTabTitle({ plugin }: HomeTabFileProps) {
  useEffect(() => {
    document.addEventListener("keyup", (e) => handleSearchKeyDown(e));
    return () => {
      document.removeEventListener("keyup", handleSearchKeyDown);
    };
  }, []);
  const [state, setState] = useState<{
    searchDisable: boolean;
  }>({
    searchDisable: true,
  });

  const themeFilter = useContext(ThemeContext);
  const searchInputRef = useRef(null);
  const remiAudioEl = useRef(null);

  const playRemi = async () => {
    remiAudioEl.current.play();
  };
  const handleSearchKeyDown = (e: KeyboardEvent) => {
    if (e.target !== searchInputRef.current) return;
    if (e.key === "Enter") {
      _paq.push(["trackEvent", "hometab", "header", "searchDocumentation"]);
      openLink();
      searchInputRef.current.value = "";
    } else {
      setState((prevState) => {
        return {
          ...prevState,
          searchDisable: searchInputRef.current.value === "",
        };
      });
    }
  };

  const openLink = (url = "") => {
    if (url === "") {
      window.open(
        "https://remix-ide.readthedocs.io/en/latest/search.html?q=" +
          searchInputRef.current.value +
          "&check_keywords=yes&area=default",
        "_blank"
      );
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <div
      className="px-2 pb-2 d-flex flex-column border-bottom border-top justify-content-between"
      style={{ paddingTop: "55px", paddingBottom: "30px" }}
      id="hTTitleSection"
    >
      <div
        className="d-flex pb-1 align-items-center pr-4"
        style={{
          position: "absolute",
          top: "34px",
          marginLeft: "-8px",
          width: "100%",
          zIndex: "2",
          minHeight: "56px",
        }}
      >
        <input
          ref={searchInputRef}
          type="text"
          className="border form-control border-right-0"
          id="searchInput"
          placeholder="Search Documentation"
          data-id="terminalInputSearch"
        />
        <button
          className=" d-flex align-items-center justify-content-center position-absolute"
          onClick={(e) => {
            _paq.push([
              "trackEvent",
              "hometab",
              "header",
              "searchDocumentation",
            ]);
            openLink();
          }}
          disabled={state.searchDisable}
          style={{ width: "30px", background: "none", border: "none" }}
        >
          <svg
            width="26"
            height="24"
            viewBox="0 0 26 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12.0927 3.75C7.95189 3.75 4.59512 6.99594 4.59512 11C4.59512 15.0041 7.95189 18.25 12.0927 18.25C16.2335 18.25 19.5902 15.0041 19.5902 11C19.5902 6.99594 16.2335 3.75 12.0927 3.75ZM3.0439 11C3.0439 6.16751 7.09518 2.25 12.0927 2.25C17.0902 2.25 21.1415 6.16751 21.1415 11C21.1415 15.8325 17.0902 19.75 12.0927 19.75C7.09518 19.75 3.0439 15.8325 3.0439 11Z"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M17.3872 16.1196C17.6901 15.8267 18.1812 15.8267 18.4841 16.1196L22.9826 20.4696C23.2855 20.7625 23.2855 21.2373 22.9826 21.5302C22.6797 21.8231 22.1886 21.8231 21.8857 21.5302L17.3872 17.1802C17.0843 16.8873 17.0843 16.4125 17.3872 16.1196Z"
            />
          </svg>
        </button>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <div
          className="d-flex flex-column "
          style={{ width: "170px", gap: "10px" }}
        >
          <div
            className="mr-4 d-flex align-items-center"
            style={{ gap: "10px" }}
          >
            {/* <div onClick={() => playRemi()} style={{ filter: themeFilter.filter }}>
          <BasicLogo classList="align-self-end remixui_home_logoImg" solid={false} />
        </div> */}
            {/* <audio
          id="remiAudio"
          muted={false}
          src="assets/audio/remiGuitar-single-power-chord-A-minor.wav"
          ref={remiAudioEl}
        ></audio> */}
            <svg
              width="40"
              height="42"
              viewBox="0 0 40 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.61888 10.6202C7.40191 8.37079 9.73781 6.57378 12.4209 5.3874C15.104 4.20102 18.0519 3.66167 21.0051 3.81684C23.9583 3.97202 26.8262 4.81696 29.3562 6.27726C31.8862 7.73756 34.0008 9.76842 35.5136 12.191L36.8203 11.499L38.9982 10.2811C37.0444 7.14783 34.2694 4.55261 30.9458 2.75017C27.6221 0.947727 23.8639 0 20.0399 0C16.216 0 12.4578 0.947727 9.1341 2.75017C5.81042 4.55261 3.0355 7.14783 1.08167 10.2811L0 11.9004L1.72777 12.8761L8.41379 16.6612C7.32019 19.2829 7.24406 22.1906 8.19911 24.861C9.15415 27.5315 11.0777 29.7894 13.6235 31.2284C16.1694 32.6674 19.1705 33.1931 22.0868 32.7109C25.0031 32.2287 27.6431 30.7703 29.5318 28.598L34.4029 31.366C32.6194 33.6174 30.2821 35.4157 27.597 36.6023C24.9119 37.789 21.9617 38.3274 19.0067 38.1701C16.0517 38.0128 13.1827 37.1647 10.6529 35.7005C8.12316 34.2363 6.01033 32.201 4.50091 29.7744L1.05263 31.7189C3.00646 34.8522 5.78138 37.4474 9.10506 39.2498C12.4287 41.0523 16.187 42 20.0109 42C23.8348 42 27.593 41.0523 30.9167 39.2498C34.2404 37.4474 37.0153 34.8522 38.9692 31.7189L40 30.0719L38.2722 29.0962L32.784 25.9892L28.0508 23.3874C27.4746 25.1358 26.2881 26.6436 24.6885 27.6602C23.0889 28.6769 21.1725 29.1412 19.2577 28.976C17.343 28.8108 15.5452 28.026 14.1631 26.7521C12.7809 25.4782 11.8978 23.7918 11.6603 21.9732C11.4228 20.1546 11.8453 18.3133 12.8576 16.7552C13.8699 15.1972 15.411 14.0163 17.2248 13.4086C19.0387 12.801 21.016 12.8033 22.8283 13.4152C24.6406 14.027 26.1787 15.2116 27.1869 16.772L30.6642 14.8621C29.6427 13.247 28.2314 11.8878 26.5478 10.8974C24.8641 9.90703 22.9568 9.31408 20.9843 9.16789C19.0118 9.0217 17.0312 9.32648 15.2072 10.0569C13.3832 10.7873 11.7684 11.9223 10.4973 13.3674L5.61888 10.6202Z"
                fill="#4C5057"
              />
            </svg>
            <svg
              width="52"
              height="14"
              viewBox="0 0 52 14"
              fill="#4C5057"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7.28189 13.9993C4.90742 13.9993 3.0983 13.3911 1.85453 12.1748C1.21578 11.5014 0.722625 10.7037 0.405814 9.83145C0.0890029 8.95919 -0.0446763 8.03105 0.0131086 7.10489C-0.043793 6.15804 0.0882797 5.20935 0.40164 4.31401C0.715 3.41867 1.20339 2.59457 1.83838 1.88969C3.04984 0.635671 4.86435 0.00597494 7.28189 0.000592897C8.02676 -0.00697453 8.7706 0.0579139 9.5029 0.194345C10.1446 0.313455 10.7763 0.480769 11.3928 0.694871V3.67383C10.1694 3.16634 8.85682 2.90833 7.53226 2.91496C6.97772 2.86615 6.41904 2.93042 5.8901 3.10389C5.36115 3.27735 4.87297 3.55639 4.45514 3.9241C3.72483 4.81563 3.37132 5.95682 3.46982 7.10489C3.42261 7.65481 3.49012 8.20855 3.66806 8.73105C3.84601 9.25355 4.13052 9.73345 4.5036 10.1404C5.36732 10.8453 6.46874 11.1921 7.58071 11.1091C8.239 11.1108 8.89602 11.0514 9.54328 10.9315C10.1881 10.8112 10.8187 10.6246 11.4251 10.3745V13.3696C10.8098 13.5683 10.1809 13.7221 9.54328 13.8297C8.79566 13.9503 8.03913 14.007 7.28189 13.9993Z" />
              <path d="M19.291 14.0001C17.078 14.0001 15.3981 13.4377 14.2513 12.3128C13.1044 11.188 12.5256 9.43882 12.5149 7.06533C12.5149 4.54654 13.0964 2.74624 14.2513 1.6483C15.4062 0.550367 17.078 0.0336914 19.291 0.0336914C21.5039 0.0336914 23.1757 0.58266 24.3307 1.6483C25.4856 2.71395 26.059 4.54654 26.059 7.06533C26.059 9.43882 25.4775 11.1907 24.3307 12.3128C23.1838 13.435 21.4958 14.0001 19.291 14.0001ZM19.291 11.1099C19.7594 11.1565 20.2323 11.0923 20.6714 10.9226C21.1105 10.753 21.5036 10.4825 21.8189 10.1331C22.4249 9.23011 22.7094 8.14955 22.6265 7.06533C22.7305 5.9286 22.4458 4.79021 21.8189 3.83611C21.5001 3.50249 21.1102 3.24503 20.6781 3.08289C20.246 2.92076 19.7829 2.85811 19.3233 2.89963C18.8599 2.85674 18.3928 2.91865 17.9566 3.08076C17.5204 3.24287 17.1262 3.50103 16.8034 3.83611C16.1723 4.78837 15.8873 5.92825 15.9958 7.06533C15.9129 8.14955 16.1974 9.23011 16.8034 10.1331C17.1161 10.4748 17.5028 10.7405 17.9339 10.9098C18.3651 11.0791 18.8293 11.1475 19.291 11.1099Z" />
              <path d="M27.7881 13.7897V0.210788H34.5803C35.2263 0.157319 35.8763 0.242774 36.4865 0.461402C37.0967 0.68003 37.6529 1.02676 38.1178 1.47826C38.9162 2.42189 39.3236 3.63489 39.2566 4.86895C39.2818 5.7287 39.0391 6.57503 38.562 7.29087C38.0957 7.98103 37.4352 8.5176 36.6641 8.83283C36.8515 8.97636 37.0127 9.15115 37.1406 9.3495C37.2945 9.60606 37.4242 9.87632 37.5282 10.1568L39.1435 13.822H35.5899L34.0715 10.3667C33.9731 10.1106 33.8053 9.887 33.587 9.72086C33.3413 9.58087 33.0619 9.51105 32.7793 9.51904H31.1802V13.822L27.7881 13.7897ZM31.1802 6.87107H33.6919C34.2523 6.90648 34.8055 6.73079 35.2426 6.37861C35.4396 6.18253 35.5915 5.9459 35.6877 5.68519C35.784 5.42448 35.8223 5.14595 35.7999 4.86895C35.7999 3.51268 35.1457 2.82647 33.8373 2.82647H31.1802V6.87107Z" />
              <path d="M40.9845 13.7903V0.211426H51.0073V2.8271H44.3847V5.6769H50.2239V8.34908H44.3847V11.1747H51.0073V13.7903H40.9845Z" />
            </svg>
          </div>
          <b className="pb-1 text-dark">The Native IDE for Web3 Development.</b>
        </div>
        <div style={{ width: "330px" }}>
          <HomeTabFile plugin={plugin} />
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <div
          className="d-flex justify-content-between"
          style={{ width: "170px" }}
        >
          <span>
            <CustomTooltip
              placement={"top"}
              tooltipId="overlay-tooltip"
              tooltipClasses="text-nowrap"
              tooltipText="Remix Facebook Channel"
              tooltipTextClasses="border bg-light text-dark p-1 pr-3"
            >
              <button
                onClick={() => {
                  openLink("https://gitter.im/ethereum/remix");
                  _paq.push(["trackEvent", "hometab", "socialmedia", "gitter"]);
                }}
                className="border-0 h-100 pl-2 btn fab fa-facebook"
              ></button>
            </CustomTooltip>
            <CustomTooltip
              placement={"top"}
              tooltipId="overlay-tooltip"
              tooltipClasses="text-nowrap"
              tooltipText="Remix Twitter Profile"
              tooltipTextClasses="border bg-light text-dark p-1 pr-3"
            >
              <button
                onClick={() => {
                  openLink("https://twitter.com/EthereumRemix");
                  _paq.push([
                    "trackEvent",
                    "hometab",
                    "socialMedia",
                    "twitter",
                  ]);
                }}
                className="border-0 h-100 pl-2 btn fab fa-twitter"
              ></button>
            </CustomTooltip>
            <CustomTooltip
              placement={"top"}
              tooltipId="overlay-tooltip"
              tooltipClasses="text-nowrap"
              tooltipText="Remix Linkedin Profile"
              tooltipTextClasses="border bg-light text-dark p-1 pr-3"
            >
              <button
                onClick={() => {
                  openLink("https://www.linkedin.com/company/ethereum-remix/");
                  _paq.push([
                    "trackEvent",
                    "hometab",
                    "socialmedia",
                    "linkedin",
                  ]);
                }}
                className="border-0 h-100 pl-2 btn fa fa-linkedin"
              ></button>
            </CustomTooltip>
            <CustomTooltip
              placement={"top"}
              tooltipId="overlay-tooltip"
              tooltipClasses="text-nowrap"
              tooltipText="Remix Youtube Playlist"
              tooltipTextClasses="border bg-light text-dark p-1 pr-3"
            >
              <button
                onClick={() => {
                  openLink(
                    "https://www.youtube.com/channel/UCjTUPyFEr2xDGN6Cg8nKDaA"
                  );
                  _paq.push([
                    "trackEvent",
                    "hometab",
                    "socialMedia",
                    "youtube",
                  ]);
                }}
                className="border-0 h-100 btn fab fa-github"
              ></button>
            </CustomTooltip>
          </span>
        </div>
        <div style={{ width: "330px" }}>
          <label className="text-white font-12">Resources:</label>

          <div className="pb-1" id="hTGeneralLinks">
            <a
              className="remixui_home_text"
              onClick={() =>
                _paq.push(["trackEvent", "hometab", "header", "webSite"])
              }
              target="__blank"
              href="https://remix-project.org"
            >
              Website
            </a>
            <a
              className="pl-2 remixui_home_text"
              onClick={() =>
                _paq.push(["trackEvent", "hometab", "header", "documentation"])
              }
              target="__blank"
              href="https://remix-ide.readthedocs.io/en/latest"
            >
              Documentation
            </a>
            <a
              className="pl-2 remixui_home_text"
              onClick={() =>
                _paq.push(["trackEvent", "hometab", "header", "remixPlugin"])
              }
              target="__blank"
              href="https://remix-plugin-docs.readthedocs.io/en/latest/"
            >
              CORE Plugin
            </a>
            <a
              className="pl-2 remixui_home_text"
              onClick={() =>
                _paq.push(["trackEvent", "hometab", "header", "remixDesktop"])
              }
              target="__blank"
              href="https://github.com/ethereum/remix-desktop/releases"
            >
              Desktop
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeTabTitle;
