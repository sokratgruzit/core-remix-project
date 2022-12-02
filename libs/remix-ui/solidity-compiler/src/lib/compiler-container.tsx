import React, { useEffect, useState, useRef, useReducer } from "react"; // eslint-disable-line
import semver from "semver";
import { CompilerContainerProps } from "./types";
import { ConfigurationSettings } from "@remix-project/remix-lib-ts";
import {
  checkSpecialChars,
  CustomTooltip,
  extractNameFromKey,
} from "@remix-ui/helper";
import {
  canUseWorker,
  baseURLBin,
  baseURLWasm,
  urlFromVersion,
  pathToURL,
  promisedMiniXhr,
} from "@remix-project/remix-solidity";
import { compilerReducer, compilerInitialState } from "./reducers/compiler";
import { resetEditorMode, listenToEvents } from "./actions/compiler";
import { getValidLanguage } from "@remix-project/remix-solidity";
import { CopyToClipboard } from "@remix-ui/clipboard";
import { configFileContent } from "./compilerConfiguration";

import "./css/style.css";
const defaultPath = "compiler_config.json";

declare global {
  interface Window {
    _paq: any;
  }
}

const _paq = (window._paq = window._paq || []); //eslint-disable-line

export const CompilerContainer = (props: CompilerContainerProps) => {
  const {
    api,
    compileTabLogic,
    tooltip,
    modal,
    compiledFileName,
    updateCurrentVersion,
    configurationSettings,
    isHardhatProject,
    isTruffleProject,
    isFoundryProject,
    workspaceName,
    configFilePath,
    setConfigFilePath,
  } = props; // eslint-disable-line
  const [state, setState] = useState({
    hideWarnings: false,
    autoCompile: false,
    useFileConfiguration: false,
    matomoAutocompileOnce: true,
    optimize: false,
    compileTimeout: null,
    timeout: 300,
    allversions: [],
    customVersions: [],
    compilerLicense: null,
    selectedVersion: null,
    defaultVersion: "soljson-v0.8.7+commit.e28d00a7.js", // this default version is defined: in makeMockCompiler (for browser test)
    runs: "",
    compiledFileName: "",
    includeNightlies: false,
    language: "Solidity",
    evmVersion: "",
    createFileOnce: true,
  });
  const [showFilePathInput, setShowFilePathInput] = useState<boolean>(false);
  const [toggleExpander, setToggleExpander] = useState<boolean>(false);
  const [disableCompileButton, setDisableCompileButton] =
    useState<boolean>(false);
  const compileIcon = useRef(null);
  const promptMessageInput = useRef(null);
  const configFilePathInput = useRef(null);
  const [hhCompilation, sethhCompilation] = useState(false);
  const [truffleCompilation, setTruffleCompilation] = useState(false);
  const [compilerContainer, dispatch] = useReducer(
    compilerReducer,
    compilerInitialState
  );

  useEffect(() => {
    if (workspaceName) {
      api.setAppParameter("configFilePath", defaultPath);
      if (state.useFileConfiguration) {
        api.fileExists(defaultPath).then((exists) => {
          if (!exists && state.useFileConfiguration) {
            configFilePathInput.current.value = defaultPath;
            createNewConfigFile();
          }
        });
      }
      setShowFilePathInput(false);
    }
  }, [workspaceName]);

  useEffect(() => {
    if (state.useFileConfiguration) {
      api.fileExists(defaultPath).then((exists) => {
        if (!exists) createNewConfigFile();
      });
      setToggleExpander(true);
    }
  }, [state.useFileConfiguration]);

  useEffect(() => {
    const listener = (event) => {
      if (
        configFilePathInput.current !== event.target &&
        event.target.innerText !== "Create"
      ) {
        setShowFilePathInput(false);
        configFilePathInput.current.value = "";
        return;
      }
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  });

  useEffect(() => {
    fetchAllVersion((allversions, selectedVersion, isURL) => {
      setState((prevState) => {
        return { ...prevState, allversions };
      });
      if (isURL) _updateVersionSelector(state.defaultVersion, selectedVersion);
      else {
        setState((prevState) => {
          return { ...prevState, selectedVersion };
        });
        updateCurrentVersion(selectedVersion);
        _updateVersionSelector(selectedVersion);
      }
    });
    const currentFileName = api.currentFile;

    currentFile(currentFileName);
    listenToEvents(compileTabLogic, api)(dispatch);
  }, []);

  useEffect(() => {
    (async () => {
      if (compileTabLogic && compileTabLogic.compiler) {
        const autocompile =
          ((await api.getAppParameter("autoCompile")) as boolean) || false;
        const hideWarnings =
          ((await api.getAppParameter("hideWarnings")) as boolean) || false;
        const includeNightlies =
          ((await api.getAppParameter("includeNightlies")) as boolean) || false;
        const useFileConfiguration =
          ((await api.getAppParameter("useFileConfiguration")) as boolean) ||
          false;
        let configFilePathSaved = await api.getAppParameter("configFilePath");
        if (!configFilePathSaved || configFilePathSaved == "")
          configFilePathSaved = defaultPath;

        setConfigFilePath(configFilePathSaved);

        setState((prevState) => {
          const params = api.getCompilerParameters();
          const optimize = params.optimize;
          const runs = params.runs as string;
          const evmVersion = compileTabLogic.evmVersions.includes(
            params.evmVersion
          )
            ? params.evmVersion
            : "default";
          const language = getValidLanguage(params.language);

          return {
            ...prevState,
            hideWarnings: hideWarnings,
            autoCompile: autocompile,
            includeNightlies: includeNightlies,
            useFileConfiguration: useFileConfiguration,
            optimize: optimize,
            runs: runs,
            evmVersion:
              evmVersion !== null &&
              evmVersion !== "null" &&
              evmVersion !== undefined &&
              evmVersion !== "undefined"
                ? evmVersion
                : "default",
            language: language !== null ? language : "Solidity",
          };
        });
      }
    })();
  }, [compileTabLogic]);

  useEffect(() => {
    const isDisabled =
      !compiledFileName ||
      (compiledFileName && !isSolFileSelected(compiledFileName));

    setDisableCompileButton(isDisabled);
    setState((prevState) => {
      return { ...prevState, compiledFileName };
    });
  }, [compiledFileName]);

  useEffect(() => {
    if (compilerContainer.compiler.mode) {
      switch (compilerContainer.compiler.mode) {
        case "startingCompilation":
          startingCompilation();
          break;
        case "compilationDuration":
          compilationDuration(compilerContainer.compiler.args[0]);
          break;
        case "loadingCompiler":
          loadingCompiler();
          break;
        case "compilerLoaded":
          compilerLoaded(compilerContainer.compiler.args[1]);
          break;
        case "compilationFinished":
          compilationFinished();
          break;
      }
    }
  }, [compilerContainer.compiler.mode]);

  useEffect(() => {
    if (compilerContainer.editor.mode) {
      switch (compilerContainer.editor.mode) {
        case "sessionSwitched":
          sessionSwitched();
          resetEditorMode()(dispatch);
          break;
        case "contentChanged":
          contentChanged();
          resetEditorMode()(dispatch);
          break;
      }
    }
  }, [compilerContainer.editor.mode]);

  useEffect(() => {
    compileTabLogic.setUseFileConfiguration(state.useFileConfiguration);
    if (state.useFileConfiguration)
      compileTabLogic.setConfigFilePath(configFilePath);
  }, [state.useFileConfiguration]);

  useEffect(() => {
    if (configurationSettings) {
      setConfiguration(configurationSettings);
    }
  }, [configurationSettings]);

  const toggleConfigType = () => {
    if (state.useFileConfiguration)
      if (state.createFileOnce) {
        api.fileExists(defaultPath).then((exists) => {
          if (!exists || state.useFileConfiguration) createNewConfigFile();
        });
        setState((prevState) => {
          return { ...prevState, createFileOnce: false };
        });
      }

    setState((prevState) => {
      api.setAppParameter("useFileConfiguration", !state.useFileConfiguration);
      return {
        ...prevState,
        useFileConfiguration: !state.useFileConfiguration,
      };
    });
  };

  const openFile = async () => {
    await api.open(configFilePath);
  };

  const createNewConfigFile = async () => {
    let filePath =
      configFilePathInput.current && configFilePathInput.current.value !== ""
        ? configFilePathInput.current.value
        : configFilePath;
    if (filePath === "") filePath = defaultPath;
    if (!filePath.endsWith(".json")) filePath = filePath + ".json";

    let compilerConfig = configFileContent;
    if (isFoundryProject && !compilerConfig.includes("remappings")) {
      const config = JSON.parse(compilerConfig);
      config.settings.remappings = [
        "ds-test/=lib/forge-std/lib/ds-test/src/",
        "forge-std/=lib/forge-std/src/",
      ];
      compilerConfig = JSON.stringify(config, null, "\t");
    }
    await api.writeFile(filePath, compilerConfig);
    api.setAppParameter("configFilePath", filePath);
    setConfigFilePath(filePath);
    compileTabLogic.setConfigFilePath(filePath);
    setShowFilePathInput(false);
  };

  const handleConfigPathChange = async () => {
    if (configFilePathInput.current.value !== "") {
      if (!configFilePathInput.current.value.endsWith(".json"))
        configFilePathInput.current.value += ".json";

      if (await api.fileExists(configFilePathInput.current.value)) {
        api.setAppParameter(
          "configFilePath",
          configFilePathInput.current.value
        );
        setConfigFilePath(configFilePathInput.current.value);
        compileTabLogic.setConfigFilePath(configFilePathInput.current.value);

        setShowFilePathInput(false);
      } else {
        modal(
          "New configuration file",
          `The file "${configFilePathInput.current.value}" you entered does not exist. Do you want to create a new one?`,
          "Create",
          async () => await createNewConfigFile(),
          "Cancel",
          () => {
            setShowFilePathInput(false);
          }
        );
      }
    }
  };

  const _retrieveVersion = (version?) => {
    if (!version) version = state.selectedVersion;
    if (version === "builtin") version = state.defaultVersion;
    return semver.coerce(version) ? semver.coerce(version).version : "";
  };

  // fetching both normal and wasm builds and creating a [version, baseUrl] map
  const fetchAllVersion = async (callback) => {
    let selectedVersion, allVersionsWasm, isURL;
    let allVersions = [
      {
        path: "builtin",
        longVersion: "latest local version - " + state.defaultVersion,
      },
    ];
    // fetch normal builds
    const binRes: any = await promisedMiniXhr(`${baseURLBin}/list.json`);
    // fetch wasm builds
    const wasmRes: any = await promisedMiniXhr(`${baseURLWasm}/list.json`);
    if (binRes.event.type === "error" && wasmRes.event.type === "error") {
      selectedVersion = "builtin";
      return callback(allVersions, selectedVersion);
    }
    try {
      const versions = JSON.parse(binRes.json).builds.slice().reverse();

      allVersions = [...allVersions, ...versions];
      selectedVersion = state.defaultVersion;
      if (api.getCompilerParameters().version) {
        const versionFromURL = api.getCompilerParameters().version;
        // Check if version is a URL and corresponding filename starts with 'soljson'
        if (versionFromURL.startsWith("https://")) {
          const urlArr = versionFromURL.split("/");
          if (urlArr[urlArr.length - 1].startsWith("soljson")) {
            isURL = true;
            selectedVersion = versionFromURL;
          }
        } else {
          // URL version can be like 0.8.7+commit.e28d00a7, 0.8.7 or soljson-v0.8.7+commit.e28d00a7.js
          const selectedVersionArr = versions.filter(
            (obj) =>
              obj.path === versionFromURL ||
              obj.longVersion === versionFromURL ||
              obj.version === versionFromURL
          );
          // for version like 0.8.15, there will be more than one elements in the array
          // In that case too, index 0 will have non-nightly version object
          if (selectedVersionArr.length)
            selectedVersion = selectedVersionArr[0].path;
        }
      }
      if (wasmRes.event.type !== "error") {
        allVersionsWasm = JSON.parse(wasmRes.json).builds.slice().reverse();
      }
    } catch (e) {
      tooltip(
        "Cannot load compiler version list. It might have been blocked by an advertisement blocker. Please try deactivating any of them from this page and reload. Error: " +
          e
      );
    }
    // replace in allVersions those compiler builds which exist in allVersionsWasm with new once
    if (allVersionsWasm && allVersions) {
      allVersions.forEach((compiler, index) => {
        const wasmIndex = allVersionsWasm.findIndex((wasmCompiler) => {
          return wasmCompiler.longVersion === compiler.longVersion;
        });
        const URLWasm: string =
          process && process.env && process.env["NX_WASM_URL"]
            ? process.env["NX_WASM_URL"]
            : baseURLWasm;
        const URLBin: string =
          process && process.env && process.env["NX_BIN_URL"]
            ? process.env["NX_BIN_URL"]
            : baseURLBin;
        if (wasmIndex !== -1) {
          allVersions[index] = allVersionsWasm[wasmIndex];
          pathToURL[compiler.path] = URLWasm;
        } else {
          pathToURL[compiler.path] = URLBin;
        }
      });
    }
    callback(allVersions, selectedVersion, isURL);
  };

  /**
   * Update the compilation button with the name of the current file
   */
  const currentFile = (name = "") => {
    if (name && name !== "") {
      _setCompilerVersionFromPragma(name);
    }
    const compiledFileName = name.split("/").pop();

    setState((prevState) => {
      return { ...prevState, compiledFileName };
    });
  };

  // Load solc compiler version according to pragma in contract file
  const _setCompilerVersionFromPragma = (filename: string) => {
    if (!state.allversions) return;
    api.readFile(filename).then((data) => {
      if (!data) return;
      const pragmaArr = data.match(/(pragma solidity (.+?);)/g);
      if (pragmaArr && pragmaArr.length === 1) {
        const pragmaStr = pragmaArr[0].replace("pragma solidity", "").trim();
        const pragma = pragmaStr.substring(0, pragmaStr.length - 1);
        const releasedVersions = state.allversions
          .filter((obj) => !obj.prerelease)
          .map((obj) => obj.version);
        const allVersions = state.allversions.map((obj) =>
          _retrieveVersion(obj.version)
        );
        const currentCompilerName = _retrieveVersion(state.selectedVersion);
        // contains only numbers part, for example '0.4.22'
        const pureVersion = _retrieveVersion();
        // is nightly build newer than the last release
        const isNewestNightly =
          currentCompilerName.includes("nightly") &&
          semver.gt(pureVersion, releasedVersions[0]);
        // checking if the selected version is in the pragma range
        const isInRange = semver.satisfies(pureVersion, pragma);
        // checking if the selected version is from official compilers list(excluding custom versions) and in range or greater
        const isOfficial = allVersions.includes(currentCompilerName);
        if (isOfficial && !isInRange && !isNewestNightly) {
          const compilerToLoad = semver.maxSatisfying(releasedVersions, pragma);
          const compilerPath = state.allversions.filter(
            (obj) => !obj.prerelease && obj.version === compilerToLoad
          )[0].path;
          if (state.selectedVersion !== compilerPath) {
            // @ts-ignore
            api.call(
              "notification",
              "toast",
              `Updating compiler version to match current contract file pragma i.e ${_retrieveVersion(
                compilerPath
              )}`
            );
            setState((prevState) => {
              return { ...prevState, selectedVersion: compilerPath };
            });
            _updateVersionSelector(compilerPath);
          }
        }
      }
    });
  };

  const isSolFileSelected = (currentFile = "") => {
    if (!currentFile) currentFile = api.currentFile;
    if (!currentFile) return false;
    const extention = currentFile.substr(
      currentFile.length - 3,
      currentFile.length
    );
    return (
      extention.toLowerCase() === "sol" || extention.toLowerCase() === "yul"
    );
  };

  const sessionSwitched = () => {
    if (!compileIcon.current) return;
    scheduleCompilation();
  };

  const startingCompilation = () => {
    if (!compileIcon.current) return;
    compileIcon.current.setAttribute("title", "compiling...");
    compileIcon.current.classList.remove("remixui_bouncingIcon");
    compileIcon.current.classList.add("remixui_spinningIcon");
  };

  const compilationDuration = (speed: number) => {
    if (speed > 1000) {
      console.log(
        `Last compilation took ${speed}ms. We suggest to turn off autocompilation.`
      );
    }
  };

  const contentChanged = () => {
    if (!compileIcon.current) return;
    scheduleCompilation();
    compileIcon.current.classList.add("remixui_bouncingIcon"); // @TODO: compileView tab
  };

  const loadingCompiler = () => {
    if (!compileIcon.current) return;
    compileIcon.current.setAttribute(
      "title",
      "compiler is loading, please wait a few moments."
    );
    compileIcon.current.classList.add("remixui_spinningIcon");
    setState((prevState) => {
      return {
        ...prevState,
        compilerLicense:
          "Compiler is loading. License will be displayed once compiler is loaded",
      };
    });
    _updateLanguageSelector();
    setDisableCompileButton(true);
  };

  const compilerLoaded = (license) => {
    if (!compileIcon.current) return;
    compileIcon.current.setAttribute("title", "");
    compileIcon.current.classList.remove("remixui_spinningIcon");
    setState((prevState) => {
      return {
        ...prevState,
        compilerLicense: license
          ? license
          : "Could not retreive license for selected compiler version",
      };
    });
    if (state.autoCompile) compile();
    const isDisabled =
      !compiledFileName ||
      (compiledFileName && !isSolFileSelected(compiledFileName));

    setDisableCompileButton(isDisabled);

    // just for e2e
    // eslint-disable-next-line no-case-declarations
    const elements = document.querySelectorAll('[data-id="compilerloaded"]');
    // remove elements
    for (let i = 0; i < elements.length; i++) {
      elements[i].remove();
    }
    const loadedElement = document.createElement("span");
    loadedElement.setAttribute("data-id", "compilerloaded");
    loadedElement.setAttribute("data-version", state.selectedVersion);
    document.body.appendChild(loadedElement);
  };

  const compilationFinished = () => {
    if (!compileIcon.current) return;
    compileIcon.current.setAttribute("title", "idle");
    compileIcon.current.classList.remove("remixui_spinningIcon");
    compileIcon.current.classList.remove("remixui_bouncingIcon");
    if (
      !state.autoCompile ||
      (state.autoCompile && state.matomoAutocompileOnce)
    ) {
      _paq.push([
        "trackEvent",
        "compiler",
        "compiled",
        "with_config_file_" + state.useFileConfiguration,
      ]);
      _paq.push([
        "trackEvent",
        "compiler",
        "compiled",
        "with_version_" + _retrieveVersion(),
      ]);
      if (state.autoCompile && state.matomoAutocompileOnce) {
        setState((prevState) => {
          return { ...prevState, matomoAutocompileOnce: false };
        });
      }
    }
  };

  const scheduleCompilation = () => {
    if (!state.autoCompile) return;
    if (state.compileTimeout) window.clearTimeout(state.compileTimeout);
    const compileTimeout = window.setTimeout(() => {
      state.autoCompile && compile();
    }, state.timeout);

    setState((prevState) => {
      return { ...prevState, compileTimeout };
    });
  };

  const compile = () => {
    const currentFile = api.currentFile;

    if (!isSolFileSelected()) return;

    _setCompilerVersionFromPragma(currentFile);
    let externalCompType;
    if (hhCompilation) externalCompType = "hardhat";
    else if (truffleCompilation) externalCompType = "truffle";
    compileTabLogic.runCompiler(externalCompType);
  };

  const compileAndRun = () => {
    const currentFile = api.currentFile;

    if (!isSolFileSelected()) return;

    _setCompilerVersionFromPragma(currentFile);
    let externalCompType;
    if (hhCompilation) externalCompType = "hardhat";
    else if (truffleCompilation) externalCompType = "truffle";
    api.runScriptAfterCompilation(currentFile);
    compileTabLogic.runCompiler(externalCompType);
  };

  const _updateVersionSelector = (version, customUrl = "") => {
    // update selectedversion of previous one got filtered out
    let selectedVersion = version;
    if (!selectedVersion || !_shouldBeAdded(selectedVersion)) {
      selectedVersion = state.defaultVersion;
      setState((prevState) => {
        return { ...prevState, selectedVersion };
      });
    }
    updateCurrentVersion(selectedVersion);
    api.setCompilerParameters({ version: selectedVersion });
    let url;

    if (customUrl !== "") {
      selectedVersion = customUrl;
      setState((prevState) => {
        return {
          ...prevState,
          selectedVersion,
          customVersions: [...state.customVersions, selectedVersion],
        };
      });
      updateCurrentVersion(selectedVersion);
      url = customUrl;
      api.setCompilerParameters({ version: selectedVersion });
    } else {
      if (checkSpecialChars(selectedVersion)) {
        return console.log(
          "loading " +
            selectedVersion +
            " not allowed, special chars not allowed."
        );
      }
      if (
        selectedVersion === "builtin" ||
        selectedVersion.indexOf("soljson") === 0
      ) {
        url = urlFromVersion(selectedVersion);
      } else {
        return console.log(
          "loading " +
            selectedVersion +
            ' not allowed, version should start with "soljson"'
        );
      }
    }

    // Workers cannot load js on "file:"-URLs and we get a
    // "Uncaught RangeError: Maximum call stack size exceeded" error on Chromium,
    // resort to non-worker version in that case.
    if (selectedVersion === "builtin") selectedVersion = state.defaultVersion;
    if (selectedVersion !== "builtin" && canUseWorker(selectedVersion)) {
      compileTabLogic.compiler.loadVersion(true, url);
    } else {
      compileTabLogic.compiler.loadVersion(false, url);
    }
  };

  const _shouldBeAdded = (version) => {
    return (
      !version.includes("nightly") ||
      (version.includes("nightly") && state.includeNightlies)
    );
  };

  const promptCompiler = () => {
    // custom url https://solidity-blog.s3.eu-central-1.amazonaws.com/data/08preview/soljson.js
    modal(
      "Add a custom compiler",
      promptMessage("URL"),
      "OK",
      addCustomCompiler,
      "Cancel",
      () => {}
    );
  };

  const showCompilerLicense = () => {
    modal(
      "Compiler License",
      state.compilerLicense ? state.compilerLicense : "License not available",
      "OK",
      () => {}
    );
  };

  const promptMessage = (message) => {
    return (
      <>
        <span>{message}</span>
        <input
          type="text"
          data-id="modalDialogCustomPromptCompiler"
          className="form-control"
          ref={promptMessageInput}
        />
      </>
    );
  };

  const addCustomCompiler = () => {
    const url = promptMessageInput.current.value;

    setState((prevState) => {
      return { ...prevState, selectedVersion: url };
    });
    _updateVersionSelector(state.defaultVersion, url);
  };

  const handleLoadVersion = (value) => {
    setState((prevState) => {
      return {
        ...prevState,
        selectedVersion: value,
        matomoAutocompileOnce: true,
      };
    });
    updateCurrentVersion(value);
    _updateVersionSelector(value);
    _updateLanguageSelector();
  };

  const _updateLanguageSelector = () => {
    // This is the first version when Yul is available
    if (
      !semver.valid(_retrieveVersion()) ||
      semver.lt(_retrieveVersion(), "v0.5.7+commit.6da8b019.js")
    ) {
      handleLanguageChange("Solidity");
      compileTabLogic.setLanguage("Solidity");
    }
  };

  const handleAutoCompile = (e) => {
    const checked = e.target.checked;

    api.setAppParameter("autoCompile", checked);
    checked && compile();
    setState((prevState) => {
      return {
        ...prevState,
        autoCompile: checked,
        matomoAutocompileOnce: state.matomoAutocompileOnce || checked,
      };
    });
  };

  const handleOptimizeChange = (value) => {
    const checked = !!value;

    api.setAppParameter("optimize", checked);
    compileTabLogic.setOptimize(checked);
    if (compileTabLogic.optimize) {
      compileTabLogic.setRuns(parseInt(state.runs));
    } else {
      compileTabLogic.setRuns(200);
    }
    state.autoCompile && compile();
    setState((prevState) => {
      return { ...prevState, optimize: checked };
    });
  };

  const onChangeRuns = (value) => {
    const runs = value;

    compileTabLogic.setRuns(parseInt(runs));
    state.autoCompile && compile();
    setState((prevState) => {
      return { ...prevState, runs };
    });
  };

  const handleHideWarningsChange = (e) => {
    const checked = e.target.checked;

    api.setAppParameter("hideWarnings", checked);
    state.autoCompile && compile();
    setState((prevState) => {
      return { ...prevState, hideWarnings: checked };
    });
  };

  const handleNightliesChange = (e) => {
    const checked = e.target.checked;

    if (!checked) handleLoadVersion(state.defaultVersion);
    api.setAppParameter("includeNightlies", checked);
    setState((prevState) => {
      return { ...prevState, includeNightlies: checked };
    });
  };

  const handleLanguageChange = (value) => {
    compileTabLogic.setLanguage(value);
    state.autoCompile && compile();
    setState((prevState) => {
      return { ...prevState, language: value };
    });
  };

  const handleEvmVersionChange = (value) => {
    if (!value) return;
    let v = value;
    if (v === "default") {
      v = null;
    }
    compileTabLogic.setEvmVersion(v);
    state.autoCompile && compile();
    setState((prevState) => {
      return { ...prevState, evmVersion: value };
    });
  };

  const updatehhCompilation = (event) => {
    const checked = event.target.checked;
    if (checked) setTruffleCompilation(false); // wayaround to reset the variable
    sethhCompilation(checked);
    api.setAppParameter("hardhat-compilation", checked);
  };

  const updateTruffleCompilation = (event) => {
    const checked = event.target.checked;
    if (checked) sethhCompilation(false); // wayaround to reset the variable
    setTruffleCompilation(checked);
    api.setAppParameter("truffle-compilation", checked);
  };

  /*
    The following functions map with the above event handlers.
    They are an external API for modifying the compiler configuration.
  */
  const setConfiguration = (settings: ConfigurationSettings) => {
    handleLoadVersion(`soljson-v${settings.version}.js`);
    handleEvmVersionChange(settings.evmVersion);
    handleLanguageChange(settings.language);
    handleOptimizeChange(settings.optimize);
    onChangeRuns(settings.runs);
  };

  const toggleConfigurations = () => {
    setToggleExpander(!toggleExpander);
  };

  return (
    <section>
      <article>
        <div className="pt-0 remixui_compilerSection">
          <div className="mb-2">
            <div className="d-flex justify-content-between align-items-end pt-2 pb-2">
              <label
                className=" form-check-label font-14 text-white mb-0"
                htmlFor="versionSelector"
              >
                Compiler
              </label>
              <div className="d-flex" style={{ gap: "10px" }}>
                <CustomTooltip
                  placement="top"
                  tooltipId="promptCompilerTooltip"
                  tooltipClasses="text-nowrap"
                  tooltipText={"Add a custom compiler with URL"}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => promptCompiler()}
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10 3.25C8.20979 3.25 6.4929 3.96116 5.22703 5.22703C3.96116 6.4929 3.25 8.20979 3.25 10C3.25 10.8864 3.42459 11.7642 3.76381 12.5831C4.10303 13.4021 4.60023 14.1462 5.22703 14.773C5.85382 15.3998 6.59794 15.897 7.41689 16.2362C8.23583 16.5754 9.11358 16.75 10 16.75C10.8864 16.75 11.7642 16.5754 12.5831 16.2362C13.4021 15.897 14.1462 15.3998 14.773 14.773C15.3998 14.1462 15.897 13.4021 16.2362 12.5831C16.5754 11.7642 16.75 10.8864 16.75 10C16.75 8.20979 16.0388 6.4929 14.773 5.22703C13.5071 3.96116 11.7902 3.25 10 3.25ZM4.16637 4.16637C5.71354 2.61919 7.81196 1.75 10 1.75C12.188 1.75 14.2865 2.61919 15.8336 4.16637C17.3808 5.71354 18.25 7.81196 18.25 10C18.25 11.0834 18.0366 12.1562 17.622 13.1571C17.2074 14.1581 16.5997 15.0675 15.8336 15.8336C15.0675 16.5997 14.1581 17.2074 13.1571 17.622C12.1562 18.0366 11.0834 18.25 10 18.25C8.91659 18.25 7.8438 18.0366 6.84286 17.622C5.84192 17.2074 4.93245 16.5997 4.16637 15.8336C3.40029 15.0675 2.7926 14.1581 2.37799 13.1571C1.96339 12.1562 1.75 11.0834 1.75 10C1.75 7.81196 2.61919 5.71354 4.16637 4.16637ZM10 6.75C10.4142 6.75 10.75 7.08579 10.75 7.5V9.25H12.5C12.9142 9.25 13.25 9.58579 13.25 10C13.25 10.4142 12.9142 10.75 12.5 10.75H10.75V12.5C10.75 12.9142 10.4142 13.25 10 13.25C9.58579 13.25 9.25 12.9142 9.25 12.5V10.75H7.5C7.08579 10.75 6.75 10.4142 6.75 10C6.75 9.58579 7.08579 9.25 7.5 9.25H9.25V7.5C9.25 7.08579 9.58579 6.75 10 6.75Z"
                    />
                  </svg>

                  {/* <span className="fas fa-plus  p-0 ml-3"></span> */}
                </CustomTooltip>
                <CustomTooltip
                  placement="top"
                  tooltipId="showCompilerTooltip"
                  tooltipClasses="text-nowrap"
                  tooltipText={"See compiler license"}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="white"
                    onClick={() => showCompilerLicense()}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.6663 7.45008C16.6577 7.37353 16.6409 7.29811 16.6163 7.22508V7.15008C16.5763 7.0644 16.5228 6.98564 16.458 6.91675L11.458 1.91675C11.3891 1.85193 11.3104 1.79848 11.2247 1.75841H11.1497L10.883 1.66675H5.83301C5.16997 1.66675 4.53408 1.93014 4.06524 2.39898C3.5964 2.86782 3.33301 3.50371 3.33301 4.16675V15.8334C3.33301 16.4965 3.5964 17.1323 4.06524 17.6012C4.53408 18.07 5.16997 18.3334 5.83301 18.3334H14.1663C14.8294 18.3334 15.4653 18.07 15.9341 17.6012C16.4029 17.1323 16.6663 16.4965 16.6663 15.8334V7.50008C16.6663 7.50008 16.6663 7.50008 16.6663 7.45008ZM11.6663 4.50841L13.8247 6.66675H11.6663V4.50841ZM14.9997 15.8334C14.9997 16.0544 14.9119 16.2664 14.7556 16.4227C14.5993 16.579 14.3874 16.6667 14.1663 16.6667H5.83301C5.61199 16.6667 5.40003 16.579 5.24375 16.4227C5.08747 16.2664 4.99967 16.0544 4.99967 15.8334V4.16675C4.99967 3.94573 5.08747 3.73377 5.24375 3.57749C5.40003 3.42121 5.61199 3.33341 5.83301 3.33341H9.99967V7.50008C9.99967 7.7211 10.0875 7.93306 10.2438 8.08934C10.4 8.24562 10.612 8.33341 10.833 8.33341H14.9997V15.8334Z" />
                  </svg>
                </CustomTooltip>
              </div>
            </div>
            <select
              value={state.selectedVersion || state.defaultVersion}
              onChange={(e) => handleLoadVersion(e.target.value)}
              className="custom-select"
              id="versionSelector"
              disabled={state.allversions.length <= 0}
            >
              {state.allversions.length <= 0 && (
                <option
                  disabled
                  data-id={
                    state.selectedVersion === state.defaultVersion
                      ? "selected"
                      : ""
                  }
                >
                  {state.defaultVersion}
                </option>
              )}
              {state.allversions.length <= 0 && (
                <option
                  disabled
                  data-id={
                    state.selectedVersion === "builtin" ? "selected" : ""
                  }
                >
                  builtin
                </option>
              )}
              {state.customVersions.map((url, i) => (
                <option
                  key={i}
                  data-id={state.selectedVersion === url ? "selected" : ""}
                  value={url}
                >
                  custom
                </option>
              ))}
              {state.allversions.map((build, i) => {
                return _shouldBeAdded(build.longVersion) ? (
                  <option
                    key={i}
                    value={build.path}
                    data-id={
                      state.selectedVersion === build.path ? "selected" : ""
                    }
                  >
                    {build.longVersion}
                  </option>
                ) : null;
              })}
            </select>
          </div>
          <div className=" d-flex flex-row-reverse justify-content-end custom-control custom-checkbox">
            <input
              className="mr-2 custom-control-input"
              id="nightlies"
              type="checkbox"
              onChange={handleNightliesChange}
              checked={state.includeNightlies}
            />
            <label
              htmlFor="nightlies"
              data-id="compilerNightliesBuild"
              className="form-check-label custom-control-label"
            >
              Include nightly builds
            </label>
          </div>
          <div className="mt-1 remixui_compilerConfig custom-control custom-checkbox">
            <input
              className="remixui_autocompile custom-control-input"
              type="checkbox"
              onChange={handleAutoCompile}
              data-id="compilerContainerAutoCompile"
              id="autoCompile"
              title="Auto compile"
              checked={state.autoCompile}
            />
            <label
              className="form-check-label custom-control-label"
              htmlFor="autoCompile"
            >
              Auto compile
            </label>
          </div>
          <div className="mt-1 mb-2 remixui_compilerConfig custom-control custom-checkbox">
            <input
              className="remixui_autocompile custom-control-input"
              onChange={handleHideWarningsChange}
              id="hideWarningsBox"
              type="checkbox"
              title="Hide warnings"
              checked={state.hideWarnings}
            />
            <label
              className="form-check-label custom-control-label"
              htmlFor="hideWarningsBox"
            >
              Hide warnings
            </label>
          </div>
          {isHardhatProject && (
            <div className="mt-3 remixui_compilerConfig custom-control custom-checkbox">
              <input
                className="remixui_autocompile custom-control-input"
                onChange={updatehhCompilation}
                id="enableHardhat"
                type="checkbox"
                title="Enable Hardhat Compilation"
                checked={hhCompilation}
              />
              <label
                className="form-check-label custom-control-label"
                htmlFor="enableHardhat"
              >
                Enable Hardhat Compilation
              </label>
              <a
                className="mt-1 text-nowrap"
                href="https://remix-ide.readthedocs.io/en/latest/hardhat.html#enable-hardhat-compilation"
                target={"_blank"}
              >
                <CustomTooltip
                  placement={"right"}
                  tooltipClasses="text-nowrap"
                  tooltipId="overlay-tooltip-hardhat"
                  tooltipText={
                    <span
                      className="border bg-light text-dark p-1 pr-3"
                      style={{ minWidth: "230px" }}
                    >
                      Learn how to use Hardhat Compilation
                    </span>
                  }
                >
                  <i
                    style={{ fontSize: "medium" }}
                    className={"ml-2 fal fa-info-circle"}
                    aria-hidden="true"
                  ></i>
                </CustomTooltip>
              </a>
            </div>
          )}
          {isTruffleProject && (
            <div className="mt-3 remixui_compilerConfig custom-control custom-checkbox">
              <input
                className="remixui_autocompile custom-control-input"
                onChange={updateTruffleCompilation}
                id="enableTruffle"
                type="checkbox"
                title="Enable Truffle Compilation"
                checked={truffleCompilation}
              />
              <label
                className="form-check-label custom-control-label"
                htmlFor="enableTruffle"
              >
                Enable Truffle Compilation
              </label>
              <a
                className="mt-1 text-nowrap"
                href="https://remix-ide.readthedocs.io/en/latest/truffle.html#enable-truffle-compilation"
                target={"_blank"}
              >
                <CustomTooltip
                  placement={"right"}
                  tooltipClasses="text-nowrap"
                  tooltipId="overlay-tooltip-truffle"
                  tooltipText={
                    <span
                      className="border bg-light text-dark p-1 pr-3"
                      style={{ minWidth: "230px" }}
                    >
                      Learn how to use Truffle Compilation
                    </span>
                  }
                >
                  <i
                    style={{ fontSize: "medium" }}
                    className={"ml-2 fal fa-info-circle"}
                    aria-hidden="true"
                  ></i>
                </CustomTooltip>
              </a>
            </div>
          )}
        </div>
        <div
          className="d-flex px-4 remixui_compilerConfigSection justify-content-between"
          onClick={toggleConfigurations}
        >
          <div className="d-flex">
            <label className="mt-1 remixui_compilerConfigSection font-14 text-white">
              Advanced Configurations
            </label>
          </div>
          <div>
            <span
              data-id="scConfigExpander"
              onClick={toggleConfigurations}
              style={{ color: "#343841" }}
            >
              <i
                className={
                  !toggleExpander ? "fas fa-angle-right" : "fas fa-angle-down"
                }
                aria-hidden="true"
              ></i>
            </span>
          </div>
        </div>
        <div
          className={`px-4 pb-4 border-bottom flex-column ${
            toggleExpander ? "d-flex" : "d-none"
          }`}
        >
          <div className="d-flex pb-1 remixui_compilerConfig custom-control custom-radio">
            <input
              className="custom-control-input"
              type="radio"
              name="configradio"
              value="manual"
              onChange={toggleConfigType}
              checked={!state.useFileConfiguration}
              id="scManualConfig"
            />
            <label
              className="form-check-label custom-control-label"
              htmlFor="scManualConfig"
              data-id="scManualConfiguration"
            >
              Compiler configuration
            </label>
          </div>
          <div className={`flex-column 'd-flex'}`}>
            <div className="mb-2 ml-4">
              <label
                className="remixui_compilerLabel form-check-label"
                htmlFor="compilierLanguageSelector"
              >
                Language
              </label>
              <CustomTooltip
                placement="right-start"
                tooltipId="compilerLabelTooltip"
                tooltipClasses="text-nowrap"
                tooltipText={
                  <span>
                    {
                      "Language specification available from   Compiler >= v0.5.7"
                    }
                  </span>
                }
              >
                <select
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  disabled={state.useFileConfiguration}
                  value={state.language}
                  className="custom-select"
                  id="compilierLanguageSelector"
                >
                  <option
                    data-id={state.language === "Solidity" ? "selected" : ""}
                    value="Solidity"
                  >
                    Solidity
                  </option>
                  <option
                    data-id={state.language === "Yul" ? "selected" : ""}
                    value="Yul"
                  >
                    Yul
                  </option>
                </select>
              </CustomTooltip>
            </div>
            <div className="mb-2 ml-4">
              <label
                className="remixui_compilerLabel form-check-label"
                htmlFor="evmVersionSelector"
              >
                EVM Version
              </label>
              <select
                value={state.evmVersion}
                onChange={(e) => handleEvmVersionChange(e.target.value)}
                disabled={state.useFileConfiguration}
                className="custom-select"
                id="evmVersionSelector"
              >
                {compileTabLogic.evmVersions.map((version, index) => (
                  <option
                    key={index}
                    data-id={state.evmVersion === version ? "selected" : ""}
                    value={version}
                  >
                    {version}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-1 mt-3 border-dark pb-3 ml-4 remixui_compilerConfig custom-control custom-checkbox">
              <div className="justify-content-between align-items-center d-flex">
                <input
                  onChange={(e) => {
                    handleOptimizeChange(e.target.checked);
                  }}
                  disabled={state.useFileConfiguration}
                  className="custom-control-input"
                  id="optimize"
                  type="checkbox"
                  checked={state.optimize}
                />
                <label
                  className="form-check-label custom-control-label"
                  htmlFor="optimize"
                >
                  Enable optimization
                </label>
                <input
                  min="1"
                  className="custom-select ml-2 remixui_runs"
                  id="runs"
                  placeholder="200"
                  value={state.runs}
                  type="number"
                  title="Estimated number of times each opcode of the deployed code will be executed across the life-time of the contract."
                  onChange={(e) => onChangeRuns(e.target.value)}
                  disabled={!state.optimize || state.useFileConfiguration}
                />
              </div>
            </div>
          </div>
          <div className="d-flex pb-1 remixui_compilerConfig custom-control custom-radio">
            <input
              className="custom-control-input"
              type="radio"
              name="configradio"
              value="file"
              onChange={toggleConfigType}
              checked={state.useFileConfiguration}
              id="scFileConfig"
            />
            <label
              className="form-check-label custom-control-label"
              htmlFor="scFileConfig"
              data-id="scFileConfiguration"
            >
              Use configuration file
            </label>
          </div>
          <div
            className={`pt-2 ml-4 ml-2 align-items-start justify-content-between d-flex`}
          >
            {!showFilePathInput && state.useFileConfiguration && (
              <CustomTooltip
                placement="bottom"
                tooltipId="configfileTooltip"
                tooltipClasses="text-nowrap"
                tooltipText={<span>Click to open the config file</span>}
              >
                <span
                  onClick={
                    configFilePath === ""
                      ? () => {}
                      : async () => {
                          await openFile();
                        }
                  }
                  className="py-2 remixui_compilerConfigPath"
                >
                  {configFilePath === "" ? "No file selected." : configFilePath}
                </span>
              </CustomTooltip>
            )}
            {!showFilePathInput && !state.useFileConfiguration && (
              <span className="py-2 text-secondary">{configFilePath}</span>
            )}
            <input
              ref={configFilePathInput}
              className={`py-0 my-0 form-control ${
                showFilePathInput ? "d-flex" : "d-none"
              }`}
              placeholder={"/folder_path/file_name.json"}
              title="If the file you entered does not exist you will be able to create one in the next step."
              disabled={!state.useFileConfiguration}
              data-id="scConfigFilePathInput"
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  handleConfigPathChange();
                }
              }}
            />
            {!showFilePathInput && (
              <button
                disabled={!state.useFileConfiguration}
                data-id="scConfigChangeFilePath"
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  setShowFilePathInput(true);
                }}
              >
                Change
              </button>
            )}
          </div>
        </div>
        <div className="px-4">
          <button
            id="compileBtn"
            data-id="compilerContainerCompileBtn"
            className="btn btn-primary btn-block d-block w-100 text-break remixui_disabled mb-1 mt-3"
            onClick={compile}
            disabled={
              (configFilePath === "" && state.useFileConfiguration) ||
              disableCompileButton
            }
          >
            <CustomTooltip
              placement="auto"
              tooltipId="overlay-tooltip-compile"
              tooltipText={
                <div className="text-left">
                  {!(configFilePath === "" && state.useFileConfiguration) && (
                    <div>
                      <b>Ctrl+S</b> for compiling
                    </div>
                  )}
                  {configFilePath === "" && state.useFileConfiguration && (
                    <div> No config file selected</div>
                  )}
                </div>
              }
            >
              <span>
                {
                  <i
                    ref={compileIcon}
                    className="fas fa-sync remixui_iconbtn"
                    aria-hidden="true"
                  ></i>
                }
                Compile{" "}
                {typeof state.compiledFileName === "string"
                  ? extractNameFromKey(state.compiledFileName) ||
                    "<no file selected>"
                  : "<no file selected>"}
              </span>
            </CustomTooltip>
          </button>
          <div className="d-flex flex-column align-items-center">
            <button
              id="compileAndRunBtn"
              data-id="compilerContainerCompileAndRunBtn"
              className="btn btn-secondary btn-block d-block w-100 text-break remixui_solidityCompileAndRunButton d-inline-block remixui_disabled mb-1 mt-3"
              onClick={compileAndRun}
              disabled={
                (configFilePath === "" && state.useFileConfiguration) ||
                disableCompileButton
              }
            >
              <CustomTooltip
                placement="auto"
                tooltipId="overlay-tooltip-compile-run"
                tooltipText={
                  <div className="text-left">
                    {!(configFilePath === "" && state.useFileConfiguration) && (
                      <div>
                        <b>Ctrl+Shift+S</b> for compiling and script execution
                      </div>
                    )}
                    {configFilePath === "" && state.useFileConfiguration && (
                      <div> No config file selected</div>
                    )}
                  </div>
                }
              >
                <span>Compile and Run script</span>
              </CustomTooltip>
            </button>
            <div
              className="d-flex "
              style={{ gap: "13px", paddingTop: "20px" }}
            >
              <CustomTooltip
                placement="auto"
                tooltipId="overlay-tooltip-compile-run-doc"
                tooltipText={
                  <div className="text-left p-2">
                    <div>
                      Choose the script to execute right after compilation by
                      adding the `dev-run-script` natspec tag, as in:
                    </div>
                    <pre>
                      <code>
                        /**
                        <br />
                        * @title ContractName
                        <br />
                        * @dev ContractDescription
                        <br />
                        * @custom:dev-run-script file_path
                        <br />
                        */
                        <br />
                        contract ContractName {"{}"}
                        <br />
                      </code>
                    </pre>
                    Click to know more
                  </div>
                }
              >
                <a
                  href="https://remix-ide.readthedocs.io/en/latest/running_js_scripts.html#compile-a-contract-and-run-a-script-on-the-fly"
                  target="_blank"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 6.45825V10.8333"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.5665 7.15011V12.8501C17.5665 13.7834 17.0665 14.6501 16.2582 15.1251L11.3082 17.9834C10.4998 18.4501 9.49981 18.4501 8.68315 17.9834L3.73314 15.1251C2.92481 14.6584 2.4248 13.7917 2.4248 12.8501V7.15011C2.4248 6.21678 2.92481 5.35008 3.73314 4.87508L8.68315 2.01675C9.49148 1.55008 10.4915 1.55008 11.3082 2.01675L16.2582 4.87508C17.0665 5.35008 17.5665 6.20844 17.5665 7.15011Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 13.5V13.5833"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </CustomTooltip>
              <CopyToClipboard
                tip="Click to copy the custom NatSpec tag"
                getContent={() => "@custom:dev-run-script file_path"}
                direction="top"
              >
                <button className="btn text-dark p-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.3337 10.7501V14.2501C13.3337 17.1667 12.167 18.3334 9.25033 18.3334H5.75033C2.83366 18.3334 1.66699 17.1667 1.66699 14.2501V10.7501C1.66699 7.83341 2.83366 6.66675 5.75033 6.66675H9.25033C12.167 6.66675 13.3337 7.83341 13.3337 10.7501Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.3337 5.75008V9.25008C18.3337 12.1667 17.167 13.3334 14.2503 13.3334H13.3337V10.7501C13.3337 7.83341 12.167 6.66675 9.25033 6.66675H6.66699V5.75008C6.66699 2.83341 7.83366 1.66675 10.7503 1.66675H14.2503C17.167 1.66675 18.3337 2.83341 18.3337 5.75008Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </CopyToClipboard>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};

export default CompilerContainer;
