/* global */
import React from "react"; // eslint-disable-line
import * as packageJson from "../../../../../../package.json";
import { ViewPlugin } from "@remixproject/engine-web";
import { RemixUiHomeTab } from "@remix-ui/home-tab"; // eslint-disable-line

const profile = {
  name: "home",
  displayName: "Home",
  methods: [],
  events: [],
  description: "Remix home tab ",
  icon: "assets/img/home.webp",
  location: "mainPanel",
  version: packageJson.version,
};
export class LandingPage extends ViewPlugin {
  constructor(
    appManager,
    verticalIcons,
    fileManager,
    filePanel,
    contentImport
  ) {
    super(profile);
    this.profile = profile;
    this.fileManager = fileManager;
    this.filePanel = filePanel;
    this.contentImport = contentImport;
    this.appManager = appManager;
    this.verticalIcons = verticalIcons;
    this.el = document.createElement("div");
    this.el.setAttribute("id", "landingPageHomeContainer");
    this.el.setAttribute(
      "class",
      "remixui_homeContainer justify-content-between bg-light d-flex"
    );
    this.el.setAttribute("data-id", "landingPageHomeContainer");
  }

  render() {
    return (
      <div
        id="landingPageHomeContainer"
        className="remixui_homeContainer justify-content-between bg-light d-flex"
        data-id="landingPageHomeContainer"
      >
        {/* <div className="right-panel">
          <div className="right-panel-inner">
            <img className="core-logo" src="assets/img/core.svg" />
            <p>The Native IDE for Web3 Development</p>
            <div className="social">
              <img className="social-icon" src="assets/img/fb.svg" />
              <img className="social-icon" src="assets/img/twitter.svg" />
              <img className="social-icon" src="assets/img/linkedin.svg" />
              <img className="social-icon" src="assets/img/github.svg" />
            </div>
          </div>
          <div className="files">
            <div className="files-wrap">
              <div className="icon-hover">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4 10C2.89543 10 2 10.8954 2 12V14C2 15.1046 2.89543 16 4 16H20C21.1046 16 22 15.1046 22 14V12C22 10.8954 21.1046 10 20 10H4ZM18.2 14.2C18.8627 14.2 19.4 13.6628 19.4 13C19.4 12.3373 18.8627 11.8 18.2 11.8C17.5373 11.8 17 12.3373 17 13C17 13.6628 17.5373 14.2 18.2 14.2Z"
                    fill="#00050F"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4 3C2.89543 3 2 3.89543 2 5V7C2 8.10457 2.89543 9 4 9H20C21.1046 9 22 8.10457 22 7V5C22 3.89543 21.1046 3 20 3H4ZM18.2 7.20005C18.8627 7.20005 19.4 6.66279 19.4 6.00005C19.4 5.33731 18.8627 4.80005 18.2 4.80005C17.5373 4.80005 17 5.33731 17 6.00005C17 6.66279 17.5373 7.20005 18.2 7.20005Z"
                    fill="#00050F"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.3 19V14H12.8V19H11.3Z"
                    fill="#00050F"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M22 20.3001L2 20.3L2 18.8L22 18.8001L22 20.3001Z"
                    fill="#00050F"
                  />
                  <rect
                    x="9"
                    y="18"
                    width="6"
                    height="3"
                    rx="1"
                    fill="#00050F"
                  />
                </svg>
              </div>
              <p>Connect to Localhost</p>
            </div>
            <div className="files-wrap">
              <div className="icon-hover">
                <svg
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.3 9H13.25V13.44L15.32 11.37C15.47 11.22 15.66 11.15 15.85 11.15C16.04 11.15 16.23 11.22 16.38 11.37C16.67 11.66 16.67 12.14 16.38 12.43L13.03 15.78C12.74 16.07 12.26 16.07 11.97 15.78L8.62 12.43C8.33 12.14 8.33 11.66 8.62 11.37C8.91 11.08 9.39 11.08 9.68 11.37L11.75 13.44V9H7.7C4.5 9 2.5 11 2.5 14.2V16.79C2.5 20 4.5 22 7.7 22H17.29C20.49 22 22.49 20 22.49 16.8V14.2C22.5 11 20.5 9 17.3 9ZM13.25 2.75C13.25 2.34 12.91 2 12.5 2C12.09 2 11.75 2.34 11.75 2.75V9H13.25V2.75Z"
                    fill="#00050F"
                  />
                </svg>
              </div>
              <p>Open File</p>
            </div>
            <div className="files-wrap">
              <div className="icon-hover-orange">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 12H18M12 18V6"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p>New File</p>
            </div>
            <div className="files-wrap">
              <div className="icon-hover-black">
                <svg
                  width="8"
                  height="13"
                  viewBox="0 0 8 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.590088 11.34L5.17009 6.75L0.590088 2.16L2.00009 0.75L8.00009 6.75L2.00009 12.75L0.590088 11.34Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div> */}
        <RemixUiHomeTab plugin={this} />
      </div>
    );
  }
}
