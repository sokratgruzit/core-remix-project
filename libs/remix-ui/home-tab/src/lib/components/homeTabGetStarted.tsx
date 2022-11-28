/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../themeContext";
import Carousel from "react-multi-carousel";
import WorkspaceTemplate from "./workspaceTemplate";
import "react-multi-carousel/lib/styles.css";
import CustomNavButtons from "./customNavButtons";
declare global {
  interface Window {
    _paq: any;
  }
}
const _paq = (window._paq = window._paq || []); //eslint-disable-line
interface HomeTabGetStartedProps {
  plugin: any;
  width: number | undefined;
}

function HomeTabGetStarted({ plugin, width }: HomeTabGetStartedProps) {
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

  const createWorkspace = async (templateName) => {
    await plugin.appManager.activatePlugin("filePanel");
    const timeStamp = Date.now();
    await plugin.call(
      "filePanel",
      "createWorkspace",
      templateName + "_" + timeStamp,
      templateName
    );
    await plugin.call(
      "filePanel",
      "setWorkspace",
      templateName + "_" + timeStamp
    );
    plugin.verticalIcons.select("filePanel");
    _paq.push(["trackEvent", "hometab", "homeGetStarted", templateName]);
  };

  return (
    <div
      className="pl-2"
      id="hTGetStartedSection"
      style={{ paddingTop: "30px" }}
    >
      <p
        style={{
          fontSize: "14px",
          lineHeight: "20px",
          color: "#FFF",
        }}
      >
        Get Started - Project Templates
      </p>
      <div
        ref={carouselRefDiv}
        className="w-100 d-flex flex-column"
        style={{ position: "relative" }}
      >
        <ThemeContext.Provider value={themeFilter}>
          <Carousel
            ref={carouselRef}
            focusOnSelect={true}
            customButtonGroup={
              <CustomNavButtons
                next={undefined}
                previous={undefined}
                goToSlide={undefined}
              />
            }
            arrows={false}
            swipeable={false}
            draggable={true}
            showDots={false}
            responsive={{
              superLargeDesktop: {
                breakpoint: { max: 4000, min: 3000 },
                items: 5,
              },
              desktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: 5,
                partialVisibilityGutter: 0,
              },
            }}
            renderButtonGroupOutside={true}
            ssr={true} // means to render carousel on server-side.
            keyBoardControl={true}
            containerClass="carousel-container"
            deviceType={"desktop"}
            itemClass="w-100"
          >
            <WorkspaceTemplate
              gsID="starkNetLogo"
              workspaceTitle="Blank"
              description="Create an empty workspace."
              callback={() => createWorkspace("blank")}
              width={width}
            />
            <WorkspaceTemplate
              gsID="solhintLogo"
              workspaceTitle="Remix Default"
              description="Create a workspace with sample files."
              callback={() => createWorkspace("remixDefault")}
              width={width}
            />
            <WorkspaceTemplate
              gsID="sourcifyLogo"
              workspaceTitle="OpenZeppelin ERC20"
              description="Create an ERC20 token by importing OpenZeppelin library."
              callback={() => createWorkspace("ozerc20")}
              width={width}
            />
            <WorkspaceTemplate
              gsID="sUTLogo"
              workspaceTitle="OpenZeppelin ERC721"
              description="Create an NFT token by importing OpenZeppelin library."
              callback={() => createWorkspace("ozerc721")}
              width={width}
            />
            <WorkspaceTemplate
              gsID="sUTLogo"
              workspaceTitle="0xProject ERC20"
              description="Create an ERC20 token by importing 0xProject contract."
              callback={() => createWorkspace("zeroxErc20")}
              width={width}
            />
          </Carousel>
        </ThemeContext.Provider>
      </div>
    </div>
  );
}

export default HomeTabGetStarted;
