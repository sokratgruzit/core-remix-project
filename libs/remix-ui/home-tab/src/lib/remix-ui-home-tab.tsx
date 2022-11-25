import React, { useState, useEffect } from "react"; // eslint-disable-line

import "./remix-ui-home-tab.css";
import { ThemeContext, themes } from "./themeContext";
import HomeTabTitle from "./components/homeTabTitle";
import HomeTabLearn from "./components/homeTabLearn";
import HomeTabScamAlert from "./components/homeTabScamAlert";
import HomeTabGetStarted from "./components/homeTabGetStarted";
import HomeTabFeatured from "./components/homeTabFeatured";
import HomeTabFeaturedPlugins from "./components/homeTabFeaturedPlugins";

declare global {
  interface Window {
    _paq: any;
  }
}

export interface RemixUiHomeTabProps {
  plugin: any;
}

export const RemixUiHomeTab = (props: RemixUiHomeTabProps) => {
  const { plugin } = props;

  const [state, setState] = useState<{
    themeQuality: { filter: string; name: string };
  }>({
    themeQuality: themes.light,
  });

  useEffect(() => {
    plugin.call("theme", "currentTheme").then((theme) => {
      // update theme quality. To be used for for images
      setState((prevState) => {
        return {
          ...prevState,
          themeQuality: theme.quality === "dark" ? themes.dark : themes.light,
        };
      });
    });
    plugin.on("theme", "themeChanged", (theme) => {
      // update theme quality. To be used for for images
      setState((prevState) => {
        return {
          ...prevState,
          themeQuality: theme.quality === "dark" ? themes.dark : themes.light,
        };
      });
    });
  }, []);

  return (
    <div
      className="d-flex flex-column-reverse"
      style={{
        minHeight: window.outerHeight,
        height: "fit-content",
        width: "calc(100% - 140px)",
        position: "relative",
        background: "#010713",
      }}
      data-id="remixUIHTAll"
    >
      <ThemeContext.Provider value={state.themeQuality}>
        <div
          className="px-2 pl-3 justify-content-start d-flex flex-column"
          id="remixUIHTLeft"
          style={{
            height: "fit-content",
          }}
        >
          <HomeTabTitle plugin={plugin} />
          {/* <HomeTabLearn plugin={plugin} /> */}
        </div>
        <div
          className="pl-2 pr-3 justify-content-start d-flex flex-column"
          style={{
            height: "fit-content",
          }}
          id="remixUIHTRight"
        >
          <HomeTabFeatured></HomeTabFeatured>
          <HomeTabGetStarted plugin={plugin}></HomeTabGetStarted>
          <HomeTabFeaturedPlugins plugin={plugin}></HomeTabFeaturedPlugins>
          <HomeTabScamAlert></HomeTabScamAlert>
        </div>
      </ThemeContext.Provider>
    </div>
  );
};

export default RemixUiHomeTab;
