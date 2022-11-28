import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react"; // eslint-disable-line

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

  const [width, setWidth] = useState<number | undefined>();

  const myObserver = new ResizeObserver((entries) => {
    // this will get called whenever div dimension changes
    entries.forEach((entry) => {
      setWidth(entry.contentRect.width);
    });
  });
  const someEl = document.querySelector(".trackWidth");

  useEffect(() => {
    if (someEl) {
      myObserver.observe(someEl);
    }

    return () => {
      myObserver.disconnect();
    };
  }, [someEl]);

  useEffect(() => {
    console.log(width);
  }, [width]);

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
      className="d-flex flex-column-reverse trackWidth"
      style={{
        minHeight: window.outerHeight,
        height: "fit-content",
        width: "calc(100% - 140px)",
        position: "relative",
        background: "#010713",
        overflow: "hidden",
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
          <HomeTabTitle plugin={plugin} width={width} />
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
          <HomeTabGetStarted plugin={plugin} width={width}></HomeTabGetStarted>
          <HomeTabFeaturedPlugins
            plugin={plugin}
            width={width}
          ></HomeTabFeaturedPlugins>
          <HomeTabScamAlert></HomeTabScamAlert>
        </div>
      </ThemeContext.Provider>
    </div>
  );
};

export default RemixUiHomeTab;
