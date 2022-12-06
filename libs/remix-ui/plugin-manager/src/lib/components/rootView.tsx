/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment, ReactNode, useEffect, useState } from "react"; // eslint-disable-line no-use-before-define
import { PluginManagerComponent, PluginManagerSettings } from "../../types";
import PermisssionsSettings from "./permissionsSettings";
import { Profile } from "@remixproject/plugin-utils";
import LocalPluginForm from "./LocalPluginForm";

interface RootViewProps {
  pluginComponent: PluginManagerComponent;
  children: ReactNode;
}

export interface pluginDeactivated {
  flag: boolean;
  profile: Profile;
}

export interface pluginActivated {
  flag: boolean;
  profile: Profile;
}

function RootView({ pluginComponent, children }: RootViewProps) {
  const [visible, setVisible] = useState<boolean>(true);
  const [filterPlugins, setFilterPlugin] = useState<string>("");

  const openModal = () => {
    setVisible(false);
  };
  const closeModal = () => setVisible(true);

  useEffect(() => {
    pluginComponent.getAndFilterPlugins(filterPlugins);
  }, [filterPlugins]);
  return (
    <Fragment>
      <div id="pluginManager" data-id="pluginManagerComponentPluginManager">
        <header
          className="form-group remixui_pluginSearch plugins-header py-3 border-bottom"
          data-id="pluginManagerComponentPluginManagerHeader"
        >
          <div className="w-100" style={{ position: "relative" }}>
            <input
              type="text"
              onChange={(event) => {
                setFilterPlugin(event.target.value.toLowerCase());
              }}
              value={filterPlugins}
              className="form-control"
              placeholder="Search"
              data-id="pluginManagerComponentSearchInput"
            />
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="#808287"
              xmlns="http://www.w3.org/2000/svg"
              className="search-icon"
            >
              <circle cx="15" cy="15" r="15" fill="#0F1218" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.3333 9.5C11.664 9.5 9.5 11.664 9.5 14.3333C9.5 17.0027 11.664 19.1667 14.3333 19.1667C17.0027 19.1667 19.1667 17.0027 19.1667 14.3333C19.1667 11.664 17.0027 9.5 14.3333 9.5ZM8.5 14.3333C8.5 11.1117 11.1117 8.5 14.3333 8.5C17.555 8.5 20.1667 11.1117 20.1667 14.3333C20.1667 17.555 17.555 20.1667 14.3333 20.1667C11.1117 20.1667 8.5 17.555 8.5 14.3333Z"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.748 17.7463C17.9433 17.551 18.2599 17.551 18.4551 17.7463L21.3551 20.6463C21.5504 20.8416 21.5504 21.1581 21.3551 21.3534C21.1599 21.5487 20.8433 21.5487 20.648 21.3534L17.748 18.4534C17.5527 18.2581 17.5527 17.9416 17.748 17.7463Z"
              />
            </svg>
          </div>

          <PermisssionsSettings />
          <button
            onClick={openModal}
            className="remixui_pluginSearchButton btn btn-secondary text-dark w-100"
            data-id="pluginManagerComponentPluginSearchButton"
          >
            Connect to a Local Plugin
          </button>
        </header>
        {children}
      </div>
      <LocalPluginForm
        closeModal={closeModal}
        visible={visible}
        pluginManager={pluginComponent}
      />
    </Fragment>
  );
}

export default RootView;
