/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef, useContext } from "react";
import { ThemeContext, themes } from "../themeContext";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CustomNavButtons from "./customNavButtons";
const _paq = (window._paq = window._paq || []); // eslint-disable-line

function HomeTabFeatured() {
  const themeFilter = useContext(ThemeContext);

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div className="pt-3 pl-2" id="hTFeaturedeSection">
      <div className="mb-2">
        <div
          className="w-100 d-flex flex-column border-bottom"
          style={{ height: "280px", marginTop: "90px" }}
        >
          <ThemeContext.Provider value={themeFilter}>
            <Carousel
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
              showDots={true}
              responsive={{
                desktop: { breakpoint: { max: 2000, min: 1024 }, items: 1 },
              }}
              renderDotsOutside={true}
              ssr={true} // means to render carousel on server-side.
              infinite={true}
              centerMode={false}
              autoPlay={true}
              keyBoardControl={true}
              containerClass="carousel-container"
              sliderClass="px-2 h-100 justify-content-between"
              deviceType={"desktop"}
              itemClass="px-2 carousel-item-padding-10-px"
              autoPlaySpeed={15000}
              dotListClass="position-relative mt-2"
            >
              <div className="d-flex" style={{ height: "230px" }}>
                <img
                  src={"assets/img/bgRemi.webp"}
                  style={{ flex: "1", height: "230px", maxWidth: "230px" }}
                  alt=""
                ></img>
                <div className="h6 w-50 p-4" style={{ flex: "1" }}>
                  <h5>JUMP INTO WEB3</h5>
                  <p>
                    The Apeirogon Project is a rich toolset which can be used
                    for the entire journey of contract development by users of
                    any knowledge level, and as a learning lab for teaching and
                    experimenting with CORE.
                  </p>
                  <a
                    className="remixui_home_text"
                    onClick={() =>
                      _paq.push([
                        "trackEvent",
                        "hometab",
                        "featuredSection",
                        "jumpIntoWeb3",
                      ])
                    }
                    target="__blank"
                    href="https://remix-project.org"
                  >
                    More
                  </a>
                </div>
              </div>
              <div className="d-flex" style={{ height: "230px" }}>
                <img
                  src={"/assets/img/remixRewardUser.webp"}
                  style={{ flex: "1", height: "230px", maxWidth: "230px" }}
                  alt=""
                ></img>
                <div className="h6 p-4" style={{ flex: "1" }}>
                  <h5>APEIROGON REWARDS</h5>
                  <p style={{ fontStyle: "italic" }}>NFTs for our users!</p>
                  <p>
                    Apeirogon Project rewards contributors, beta testers, and UX
                    research participants with NFTs deployed on Optimism.
                    Apeirogon Reward holders are able to mint a second
                    “Apeirogon” user NFT badge to give to any other user of
                    their choice.
                  </p>
                  <a
                    className="remixui_home_text"
                    target="__blank"
                    onClick={() =>
                      _paq.push([
                        "trackEvent",
                        "hometab",
                        "featuredSection",
                        "remixRewards",
                      ])
                    }
                    href="https://rewards.remix.ethereum.eth.limo"
                  >
                    More
                  </a>
                </div>
              </div>
              <div className="d-flex" style={{ height: "230px" }}>
                <img
                  src={"/assets/img/remixRewardBetaTester.webp"}
                  style={{ flex: "1", height: "230px", maxWidth: "230px" }}
                  alt=""
                ></img>
                <div className="h6 p-4" style={{ flex: "1" }}>
                  <h5>BETA TESTING</h5>
                  <p style={{ fontStyle: "italic" }}>
                    Our community supports us.
                  </p>
                  <p>
                    You can join Beta Testing before each release of Apeirogon
                    IDE. Help us test now and get a handle on new features!
                  </p>
                  <a
                    className="remixui_home_text"
                    onClick={() =>
                      _paq.push([
                        "trackEvent",
                        "hometab",
                        "featuredSection",
                        "betatesting",
                      ])
                    }
                    target="__blank"
                    href="https://rewards.remix.ethereum.eth.limo"
                  >
                    More
                  </a>
                </div>
              </div>
            </Carousel>
          </ThemeContext.Provider>
        </div>
      </div>
    </div>
  );
}

export default HomeTabFeatured;
