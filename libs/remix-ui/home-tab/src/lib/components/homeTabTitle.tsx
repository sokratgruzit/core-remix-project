/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import BasicLogo from "libs/remix-ui/vertical-icons-panel/src/lib/components/BasicLogo";
import { ThemeContext } from "../themeContext";
import React, { useEffect, useState, useRef, useContext } from "react";
import { CustomTooltip } from "@remix-ui/helper";
const _paq = (window._paq = window._paq || []); // eslint-disable-line

function HomeTabTitle() {
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
      className="px-2 pb-2 pt-2 d-flex flex-column border-bottom border-top"
      id="hTTitleSection"
    >
      <div className="mr-4 d-flex">
        <div onClick={() => playRemi()} style={{ filter: themeFilter.filter }}>
          {/* <BasicLogo classList="align-self-end remixui_home_logoImg" solid={false} /> */}
        </div>
        <audio
          id="remiAudio"
          muted={false}
          src="assets/audio/remiGuitar-single-power-chord-A-minor.wav"
          ref={remiAudioEl}
        ></audio>
      </div>
      <div className="d-flex justify-content-between">
        <span
          className="h-80 text-uppercase"
          style={{ fontSize: "xx-large", fontFamily: "Noah, sans-serif" }}
        >
          Core
        </span>
        <span>
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
                _paq.push(["trackEvent", "hometab", "socialMedia", "youtube"]);
              }}
              className="border-0 h-100 btn fab fa-youtube"
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
                _paq.push(["trackEvent", "hometab", "socialMedia", "twitter"]);
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
                _paq.push(["trackEvent", "hometab", "socialmedia", "linkedin"]);
              }}
              className="border-0 h-100 pl-2 btn fa fa-linkedin"
            ></button>
          </CustomTooltip>

          <CustomTooltip
            placement={"top"}
            tooltipId="overlay-tooltip"
            tooltipClasses="text-nowrap"
            tooltipText="Remix Medium Posts"
            tooltipTextClasses="border bg-light text-dark p-1 pr-3"
          >
            <button
              onClick={() => {
                openLink("https://medium.com/remix-ide");
                _paq.push(["trackEvent", "hometab", "socialmedia", "medium"]);
              }}
              className="border-0 h-100 pl-2 btn fab fa-medium"
            ></button>
          </CustomTooltip>

          <CustomTooltip
            placement={"top"}
            tooltipId="overlay-tooltip"
            tooltipClasses="text-nowrap"
            tooltipText="Remix Gitter Channel"
            tooltipTextClasses="border bg-light text-dark p-1 pr-3"
          >
            <button
              onClick={() => {
                openLink("https://gitter.im/ethereum/remix");
                _paq.push(["trackEvent", "hometab", "socialmedia", "gitter"]);
              }}
              className="border-0 h-100 pl-2 btn fab fa-gitter"
            ></button>
          </CustomTooltip>
        </span>
      </div>
      <b className="pb-1 text-dark" style={{ fontStyle: "italic" }}>
        The Native IDE for Web3 Development.
      </b>
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
          Remix Plugin
        </a>
        <a
          className="pl-2 remixui_home_text"
          onClick={() =>
            _paq.push(["trackEvent", "hometab", "header", "remixDesktop"])
          }
          target="__blank"
          href="https://github.com/ethereum/remix-desktop/releases"
        >
          Remix Desktop
        </a>
      </div>
      <div
        className="d-flex pb-1 align-items-center"
        style={{
          position: "absolute",
          top: "34px",
          marginLeft: "-8px",
          width: "100%",
          zIndex: "2",
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
          className="form-control border d-flex align-items-center p-2 justify-content-center fas fa-search bg-light"
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
          style={{ width: "3rem" }}
        ></button>
      </div>
    </div>
  );
}

export default HomeTabTitle;
