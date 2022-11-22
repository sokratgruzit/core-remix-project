/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useContext } from "react";
import PluginButton from "./pluginButton";
import { ThemeContext } from "../themeContext";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CustomNavButtons from "./customNavButtons";
const itemsToShow = 5;
declare global {
  interface Window {
    _paq: any;
  }
}
const _paq = (window._paq = window._paq || []); //eslint-disable-line
interface HomeTabFeaturedPluginsProps {
  plugin: any;
}

function HomeTabFeaturedPlugins({ plugin }: HomeTabFeaturedPluginsProps) {
  const themeFilter = useContext(ThemeContext);
  const carouselRef = useRef(null);
  const carouselRefDiv = useRef(null);

  useEffect(() => {
    document.addEventListener("wheel", handleScroll);
    return () => {
      document.removeEventListener("wheel", handleScroll);
    };
  }, []);

  function isDescendant(parent, child) {
    let node = child.parentNode;
    while (node != null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  const handleScroll = (e) => {
    if (isDescendant(carouselRefDiv.current, e.target)) {
      e.stopPropagation();
      let nextSlide = 0;
      if (e.wheelDelta < 0) {
        nextSlide = carouselRef.current.state.currentSlide + 1;
        if (
          (carouselRef.current.state.totalItems -
            carouselRef.current.state.currentSlide) *
            carouselRef.current.state.itemWidth +
            5 <
          carouselRef.current.state.containerWidth
        )
          return; // 5 is approx margins
        carouselRef.current.goToSlide(nextSlide);
      } else {
        nextSlide = carouselRef.current.state.currentSlide - 1;
        if (nextSlide < 0) nextSlide = 0;
        carouselRef.current.goToSlide(nextSlide);
      }
    }
  };

  const startSolidity = async () => {
    await plugin.appManager.activatePlugin([
      "solidity",
      "udapp",
      "solidityStaticAnalysis",
      "solidityUnitTesting",
    ]);
    plugin.verticalIcons.select("solidity");
    _paq.push(["trackEvent", "hometabActivate", "userActivate", "solidity"]);
  };
  const startStarkNet = async () => {
    await plugin.appManager.activatePlugin("starkNet_compiler");
    plugin.verticalIcons.select("starkNet_compiler");
    _paq.push([
      "trackEvent",
      "hometabActivate",
      "userActivate",
      "starkNet_compiler",
    ]);
  };
  const startSolhint = async () => {
    await plugin.appManager.activatePlugin(["solidity", "solhint"]);
    plugin.verticalIcons.select("solhint");
    _paq.push(["trackEvent", "hometabActivate", "userActivate", "solhint"]);
  };
  const startSourceVerify = async () => {
    await plugin.appManager.activatePlugin(["solidity", "sourcify"]);
    plugin.verticalIcons.select("sourcify");
    _paq.push(["trackEvent", "hometabActivate", "userActivate", "sourcify"]);
  };
  const startSolidityUnitTesting = async () => {
    await plugin.appManager.activatePlugin(["solidity", "solidityUnitTesting"]);
    plugin.verticalIcons.select("solidityUnitTesting");
    _paq.push([
      "trackEvent",
      "hometabActivate",
      "userActivate",
      "solidityUnitTesting",
    ]);
  };

  return (
    <div className="pl-2 w-100 mt-2" id="hTFeaturedPlugins">
      <p style={{ color: "#FFF", fontSize: "14px", lineHeight: "20px" }}>
        Featured Plugins
      </p>
      <div
        ref={carouselRefDiv}
        className="w-100 d-flex flex-row"
        style={{ position: "relative", height: "332px" }}
      >
        <PluginButton
          imgPath="assets/img/solidityLogo.webp"
          envID="solidityLogo"
          envText="Solidity"
          description="Compile, test and analyse smart contract."
          remixMaintained={true}
          callback={() => startSolidity()}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <PluginButton
            imgPath="assets/img/starkNetLogo.webp"
            envID="starkNetLogo"
            envText="StarkNet"
            description="Compile and deploy contracts with Cairo, a native language for StarkNet."
            l2={true}
            callback={() => startStarkNet()}
          />
          <PluginButton
            imgPath="assets/img/solhintLogo.webp"
            envID="solhintLogo"
            envText="Solhint linter"
            description="Solhint is an open source project for linting Solidity code."
            callback={() => startSolhint()}
          />
          <PluginButton
            imgPath="assets/img/sourcifyNewLogo.webp"
            envID="sourcifyLogo"
            envText="Sourcify"
            description="Solidity contract and metadata verification service."
            callback={() => startSourceVerify()}
          />
          <PluginButton
            imgPath="assets/img/unitTesting.webp"
            envID="sUTLogo"
            envText="Solidity unit testing"
            description="Write and run unit tests for your contracts in Solidity."
            callback={() => startSolidityUnitTesting()}
          />
        </div>
      </div>
    </div>
  );
}

export default HomeTabFeaturedPlugins;
