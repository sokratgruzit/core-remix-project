/* eslint-disable no-unused-expressions */
import React, { useContext, useEffect, useRef, useState } from "react"; // eslint-disable-line
import DragBar from "../dragbar/dragbar";
import RemixUIPanelPlugin from "../plugins/panel-plugin";
import { PluginRecord } from "../types";
import "./main-panel.css";

export type RemixUIMainPanelProps = {
  Context: React.Context<any>;
};

const RemixUIMainPanel = (props: RemixUIMainPanelProps) => {
  const appContext = useContext(props.Context);
  const [plugins, setPlugins] = useState<PluginRecord[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);
  const mainPanelRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const refs = [tabsRef, editorRef, mainPanelRef, terminalRef];

  const renderPanels = () => {
    if (appContext) {
      const pluginPanels: PluginRecord[] = [];
      Object.values(appContext.layout.panels).map((panel: any) => {
        pluginPanels.push({
          profile: panel.plugin.profile,
          active: panel.active,
          view:
            panel.plugin.profile.name === "tabs"
              ? panel.plugin.renderTabsbar()
              : panel.plugin.render(),
          class:
            panel.plugin.profile.name +
            "-wrap " +
            (panel.minimized ? "minimized" : ""),
          minimized: panel.minimized,
        });
      });
      setPlugins(pluginPanels);
    }
  };

  useEffect(() => {
    renderPanels();
    appContext.layout.event.on("change", () => {
      renderPanels();
    });

    return () => {
      appContext.layout.event.off("change");
    };
  }, []);

  const showTerminal = (hide: boolean) => {
    appContext.layout.panels.terminal.minimized = hide;
    appContext.layout.event.emit("change", appContext.layout.panels);
    appContext.layout.emit("change", appContext.layout.panels);
  };

  return (
    <div className="mainview">
      {Object.values(plugins).map((pluginRecord, i) => {
        return (
          <React.Fragment key={`mainView${i}`}>
            {pluginRecord.profile.name === "terminal" ? (
              <DragBar
                key="dragbar-terminal"
                hidden={pluginRecord.minimized || false}
                setHideStatus={showTerminal}
                refObject={terminalRef}
              ></DragBar>
            ) : null}
            <RemixUIPanelPlugin
              ref={refs[i]}
              key={pluginRecord.profile.name}
              pluginRecord={pluginRecord}
            />
          </React.Fragment>
        );
      })}
      <div className="right-panel">
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
          <div>
            <img className="localhost-icon" src="assets/img/localhost.svg" />
            <p className="p">Connect to Localhost</p>
          </div>
          <div>
            <img className="open-file-icon" src="assets/img/openFile.svg" />
            <p>Open File</p>
          </div>
          <div>
            <img className="add-file-icon" src="assets/img/addFile.svg" />
            <p>New File</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemixUIMainPanel;
