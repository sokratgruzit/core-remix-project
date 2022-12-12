import React, { useState, useRef, useEffect, ReactElement } from "react"; // eslint-disable-line
import * as semver from "semver";
import { eachOfSeries } from "async"; // eslint-disable-line
import type Web3 from "web3";
import { canUseWorker, urlFromVersion } from "@remix-project/remix-solidity";
import { Renderer } from "@remix-ui/renderer"; // eslint-disable-line
import { Toaster } from "@remix-ui/toaster"; // eslint-disable-line
import { format } from "util";
import "./css/style.css";
import { CustomTooltip } from "@remix-ui/helper";
import { CornerDecorGreen, CornerDecorRed } from "@remix-ui/helper";

const _paq = ((window as any)._paq = (window as any)._paq || []); // eslint-disable-line @typescript-eslint/no-explicit-any

interface TestObject {
  fileName: string;
  checked: boolean;
}

interface TestResultInterface {
  type: string;
  value: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  time?: number;
  context?: string;
  errMsg?: string;
  filename: string;
  assertMethod?: string;
  returned?: string | number;
  expected?: string | number;
  location?: string;
  hhLogs?: [];
  web3?: Web3;
  debugTxHash?: string;
  rendered?: boolean;
}

interface FinalResult {
  totalPassing: number;
  totalFailing: number;
  totalTime: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  errors: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const SolidityUnitTesting = (props: Record<string, any>) => {
  // eslint-disable-line @typescript-eslint/no-explicit-any

  const { helper, testTab, initialPath } = props;
  const { testTabLogic } = testTab;

  const [toasterMsg, setToasterMsg] = useState<string>("");

  const [disableCreateButton, setDisableCreateButton] = useState<boolean>(true);
  const [disableGenerateButton, setDisableGenerateButton] =
    useState<boolean>(false);
  const [disableStopButton, setDisableStopButton] = useState<boolean>(true);
  const [disableRunButton, setDisableRunButton] = useState<boolean>(false);
  const [runButtonTitle, setRunButtonTitle] = useState<string>("Run tests");
  const [stopButtonLabel, setStopButtonLabel] = useState<string>("Stop");

  const [checkSelectAll, setCheckSelectAll] = useState<boolean>(true);
  const [testsOutput, setTestsOutput] = useState<ReactElement[]>([]);

  const [testsExecutionStoppedHidden, setTestsExecutionStoppedHidden] =
    useState<boolean>(true);
  const [progressBarHidden, setProgressBarHidden] = useState<boolean>(true);
  const [
    testsExecutionStoppedErrorHidden,
    setTestsExecutionStoppedErrorHidden,
  ] = useState<boolean>(true);

  let [testFiles, setTestFiles] = useState<TestObject[]>([]); // eslint-disable-line
  const [pathOptions, setPathOptions] = useState<string[]>([""]);

  const [inputPathValue, setInputPathValue] = useState<string>("tests");

  let [readyTestsNumber, setReadyTestsNumber] = useState<number>(0); // eslint-disable-line
  let [runningTestsNumber, setRunningTestsNumber] = useState<number>(0); // eslint-disable-line

  const areTestsRunning = useRef<boolean>(false);
  const hasBeenStopped = useRef<boolean>(false);
  const isDebugging = useRef<boolean>(false);
  const allTests = useRef<string[]>([]);
  const selectedTests = useRef<string[]>([]);
  const currentTestFiles: any = useRef([]); // stores files for which tests have been run
  const currentErrors: any = useRef([]); // eslint-disable-line @typescript-eslint/no-explicit-any

  const defaultPath = "tests";

  let runningTestFileName: string;
  const filesContent: Record<string, Record<string, string>> = {};
  const testsResultByFilename: Record<
    string,
    Record<string, Record<string, any>>
  > = {}; // eslint-disable-line @typescript-eslint/no-explicit-any

  const trimTestDirInput = (input: string) => {
    if (input.includes("/"))
      return input
        .split("/")
        .map((e) => e.trim())
        .join("/");
    else return input.trim();
  };

  const clearResults = () => {
    setProgressBarHidden(true);
    testTab.call("editor", "clearAnnotations");
    setTestsOutput([]);
    setTestsExecutionStoppedHidden(true);
    setTestsExecutionStoppedErrorHidden(true);
  };

  const updateForNewCurrent = async (file: string | null = null) => {
    // Ensure that when someone clicks on compilation error and that opens a new file
    // Test result, which is compilation error in this case, is not cleared
    if (currentErrors.current) {
      if (
        Array.isArray(currentErrors.current) &&
        currentErrors.current.length > 0
      ) {
        const errFiles = currentErrors.current.map((err: any) => {
          if (err.sourceLocation && err.sourceLocation.file)
            return err.sourceLocation.file;
        }); // eslint-disable-line
        if (errFiles.includes(file)) return;
      } else if (
        currentErrors.current.sourceLocation &&
        currentErrors.current.sourceLocation.file &&
        currentErrors.current.sourceLocation.file === file
      )
        return;
    }
    // if current file is changed while debugging and one of the files imported in test file are opened
    // do not clear the test results in SUT plugin
    if (
      (isDebugging.current && testTab.allFilesInvolved.includes(file)) ||
      currentTestFiles.current.includes(file)
    )
      return;
    allTests.current = [];
    updateTestFileList();
    clearResults();
    try {
      const tests = await testTabLogic.getTests();
      allTests.current = tests;
      selectedTests.current = [...allTests.current];
      updateTestFileList();
      if (!areTestsRunning.current) await updateRunAction(file);
    } catch (e: any) {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      console.log(e);
      setToasterMsg(e);
    }
  };

  /**
   * Changes the current path of Unit Testing Plugin
   * @param path - the path from where UT plugin takes _test.sol files to run
   */
  const setCurrentPath = async (path: string) => {
    testTabLogic.setCurrentPath(path);
    setInputPathValue(path);
    updateDirList(path);
    await updateForNewCurrent();
  };

  useEffect(() => {
    if (initialPath) setCurrentPath(initialPath);
  }, [initialPath]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    testTab.on("filePanel", "newTestFileCreated", async (file: string) => {
      try {
        const tests = await testTabLogic.getTests();
        allTests.current = tests;
        selectedTests.current = [...allTests.current];
        updateTestFileList();
      } catch (e) {
        console.log(e);
        allTests.current.push(file);
        selectedTests.current.push(file);
      }
    });

    testTab.on("filePanel", "setWorkspace", async () => {
      await setCurrentPath(defaultPath);
    });

    const truncateVersion = (version: string) => {
      const tmp: RegExpExecArray | null = /^(\d+.\d+.\d+)/.exec(version);
      return tmp ? tmp[1] : version;
    };

    testTab.fileManager.events.on("noFileSelected", async () => {
      await updateForNewCurrent();
    });
    testTab.fileManager.events.on(
      "currentFileChanged",
      async (file: string) => {
        await updateForNewCurrent(file);
      }
    );
    testTab.on(
      "solidity",
      "compilerLoaded",
      async (version: string, license: string) => {
        const { currentVersion } =
          testTab.compileTab.getCurrentCompilerConfig();

        if (!semver.gt(truncateVersion(currentVersion), "0.4.12")) {
          setDisableRunButton(true);
          setRunButtonTitle(
            "Please select Solidity compiler version greater than 0.4.12."
          );
        }
      }
    );
  }, []); // eslint-disable-line

  const updateDirList = (path: string) => {
    testTabLogic.dirList(path).then((options: string[]) => {
      setPathOptions(options);
    });
  };

  const handleTestDirInput = async (e: any) => {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    let testDirInput = trimTestDirInput(e.target.value);
    testDirInput = helper.removeMultipleSlashes(testDirInput);
    setInputPathValue(testDirInput);
    if (testDirInput) {
      if (testDirInput.endsWith("/") && testDirInput !== "/") {
        testDirInput = helper.removeTrailingSlashes(testDirInput);
        if (
          testTabLogic.currentPath ===
          testDirInput.substr(0, testDirInput.length - 1)
        ) {
          setDisableCreateButton(true);
          setDisableGenerateButton(true);
        }
        updateDirList(testDirInput);
      } else {
        // If there is no matching folder in the workspace with entered text, enable Create button
        if (await testTabLogic.pathExists(testDirInput)) {
          setDisableCreateButton(true);
          setDisableGenerateButton(false);
        } else {
          // Enable Create button
          setDisableCreateButton(false);
          // Disable Generate button because dir does not exist
          setDisableGenerateButton(true);
        }
        await setCurrentPath(testDirInput);
      }
    } else {
      await setCurrentPath("/");
      setDisableCreateButton(true);
      setDisableGenerateButton(false);
    }
  };

  const handleCreateFolder = async () => {
    let inputPath = trimTestDirInput(inputPathValue);
    let path = helper.removeMultipleSlashes(inputPath);
    if (path !== "/") path = helper.removeTrailingSlashes(path);
    if (inputPath === "") inputPath = defaultPath;
    setInputPathValue(path);
    await testTabLogic.generateTestFolder(inputPath);
    setToasterMsg("Folder created successfully");
    setDisableCreateButton(true);
    setDisableGenerateButton(false);
    testTabLogic.setCurrentPath(inputPath);
    await updateRunAction();
    await updateForNewCurrent();
    pathOptions.push(inputPath);
    setPathOptions(pathOptions);
  };

  const cleanFileName = (fileName: string, testSuite: string) => {
    return fileName
      ? fileName.replace(/\//g, "_").replace(/\./g, "_") + testSuite
      : fileName;
  };

  const startDebug = async (txHash: string, web3: Web3) => {
    isDebugging.current = true;
    if (!(await testTab.appManager.isActive("debugger")))
      await testTab.appManager.activatePlugin("debugger");
    testTab.call("menuicons", "select", "debugger");
    testTab.call("debugger", "debug", txHash, web3);
  };

  const printHHLogs = (logsArr: Record<string, any>[], testName: string) => {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    let finalLogs = `<b>${testName}:</b>\n`;
    for (const log of logsArr) {
      let formattedLog;
      // Hardhat implements the same formatting options that can be found in Node.js' console.log,
      // which in turn uses util.format: https://nodejs.org/dist/latest-v12.x/docs/api/util.html#util_util_format_format_args
      // For example: console.log("Name: %s, Age: %d", remix, 6) will log 'Name: remix, Age: 6'
      // We check first arg to determine if 'util.format' is needed
      if (
        typeof log[0] === "string" &&
        (log[0].includes("%s") || log[0].includes("%d"))
      ) {
        formattedLog = format(log[0], ...log.slice(1));
      } else {
        formattedLog = log.join(" ");
      }
      finalLogs = finalLogs + "&emsp;" + formattedLog + "\n";
    }
    _paq.push(["trackEvent", "solidityUnitTesting", "hardhat", "console.log"]);
    testTab.call("terminal", "log", { type: "log", value: finalLogs });
  };

  const discardHighlight = async () => {
    await testTab.call("editor", "discardHighlight");
  };

  const highlightLocation = async (location: string, fileName: string) => {
    if (location) {
      const split = location.split(":");
      const file = split[2];
      const parsedLocation = {
        start: parseInt(split[0]),
        length: parseInt(split[1]),
      };
      const locationToHighlight =
        testTab.offsetToLineColumnConverter.offsetToLineColumnWithContent(
          parsedLocation,
          parseInt(file),
          filesContent[fileName].content
        );
      await testTab.call("editor", "discardHighlight");
      await testTab.call(
        "editor",
        "highlight",
        locationToHighlight,
        fileName,
        "",
        { focus: true }
      );
    }
  };

  const renderContract = (
    filename: string,
    contract: string | null,
    index: number,
    withoutLabel = false
  ) => {
    if (withoutLabel) {
      const contractCard: ReactElement = (
        <div
          id={runningTestFileName}
          data-id="testTabSolidityUnitTestsOutputheader"
          className="py-1"
        >
          <span className="font-weight-bold">
            {contract ? contract : ""} ({filename})
          </span>
        </div>
      );
      setTestsOutput((prevCards) => [...prevCards, contractCard]);
      return;
    }
    let label;
    if (index > -1) {
      const className = "failedTests " + runningTestFileName;
      label = (
        <CustomTooltip
          placement={"right"}
          tooltipClasses="text-nowrap"
          tooltipId="info-recorder"
          tooltipText="At least one contract test failed"
        >
          <div className={className}>FAIL</div>
        </CustomTooltip>
      );
    } else {
      const className = "passedTests " + runningTestFileName;
      label = (
        <CustomTooltip
          placement={"top-end"}
          tooltipClasses="text-nowrap"
          tooltipId="info-recorder"
          tooltipText="All contract tests passed"
        >
          <div className={className}>PASS</div>
        </CustomTooltip>
      );
    }
    // show contract and file name with label
    const ContractCard: ReactElement = (
      <div
        id={runningTestFileName}
        data-id="testTabSolidityUnitTestsOutputheader"
        className="py-1"
      >
        {label}
        <span className="font-weight-bold">
          {contract} ({filename})
        </span>
      </div>
    );
    setTestsOutput((prevCards) => {
      const index = prevCards.findIndex(
        (card: ReactElement) => card.props.id === runningTestFileName
      );
      prevCards[index] = ContractCard;
      return prevCards;
    });
  };

  const renderTests = (
    tests: TestResultInterface[],
    contract: string,
    filename: string
  ) => {
    const index = tests.findIndex(
      (test: TestResultInterface) => test.type === "testFailure"
    );
    // show filename and contract
    renderContract(filename, contract, index);
    // show tests
    for (const test of tests) {
      if (!test.rendered) {
        let debugBtn;
        if (test.debugTxHash) {
          const { web3, debugTxHash } = test;
          debugBtn = (
            <div
              id={test.value.replaceAll(" ", "_")}
              className="btn border btn btn-sm ml-1"
              style={{ cursor: "pointer" }}
              onClick={() => startDebug(debugTxHash, web3)}
            >
              <CustomTooltip
                placement={"top-start"}
                tooltipClasses="text-nowrap"
                tooltipId="info-recorder"
                tooltipText="Start debugging"
              >
                <i className="fas fa-bug"></i>
              </CustomTooltip>
            </div>
          );
        }
        if (test.type === "testPass") {
          if (test.hhLogs && test.hhLogs.length)
            printHHLogs(test.hhLogs, test.value);
          const testPassCard: ReactElement = (
            <div
              id={runningTestFileName}
              data-id="testTabSolidityUnitTestsOutputheader"
              className="testPass testLog bg-light mb-2 text-success border-0"
              onClick={() => discardHighlight()}
            >
              <CornerDecorGreen />
              <div className="d-flex my-1 align-items-center justify-content-between">
                <span className="text-white font-12"> ✓ {test.value}</span>
                {debugBtn}
              </div>
            </div>
          );
          setTestsOutput((prevCards) => [...prevCards, testPassCard]);
          test.rendered = true;
        } else if (test.type === "testFailure") {
          if (test.hhLogs && test.hhLogs.length)
            printHHLogs(test.hhLogs, test.value);
          if (!test.assertMethod) {
            const testFailCard1: ReactElement = (
              <div
                className="bg-light mb-2 px-2 testLog d-flex flex-column text-danger border-0"
                id={"UTContext" + test.context}
                onClick={() => {
                  if (test.location)
                    highlightLocation(test.location, test.filename);
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-white font-12"> ✘ {test.value}</span>
                  {debugBtn}
                </div>
                <span className="text-dark">Error Message:</span>
                <span className="pb-2 text-break">"{test.errMsg}"</span>
              </div>
            );
            setTestsOutput((prevCards) => [...prevCards, testFailCard1]);
          } else {
            const preposition =
              test.assertMethod === "equal" || test.assertMethod === "notEqual"
                ? "to"
                : "";
            const method = test.assertMethod === "ok" ? "" : test.assertMethod;
            const expected =
              test.assertMethod === "ok" ? "'true'" : test.expected;
            const testFailCard2: ReactElement = (
              <div
                className="testFail bg-light mb-2 testLog d-flex flex-column text-danger border-0"
                id={"UTContext" + test.context}
                onClick={() => {
                  if (test.location)
                    highlightLocation(test.location, test.filename);
                }}
              >
                <CornerDecorRed />
                <div className="d-flex my-1 align-items-start justify-content-between">
                  <span> ✘ {test.value}</span>
                  {debugBtn}
                </div>
                <span className="text-dark">Error Message:</span>
                <span className="pb-2 text-break">"{test.errMsg}"</span>
                <span className="text-dark">Assertion:</span>
                <div className="d-flex flex-wrap">
                  <span>Expected value should be</span>
                  <div className="mx-1 font-weight-bold">{method}</div>
                  <div>
                    {preposition} {expected}
                  </div>
                </div>
                <span className="text-dark">Received value:</span>
                <span>{test.returned}</span>
                <span className="text-dark text-sm pb-2">
                  Skipping the remaining tests of the function.
                </span>
              </div>
            );
            setTestsOutput((prevCards) => [...prevCards, testFailCard2]);
          }
          test.rendered = true;
        } else if (test.type === "logOnly") {
          if (test.hhLogs && test.hhLogs.length)
            printHHLogs(test.hhLogs, test.value);
          test.rendered = true;
        }
      }
    }
  };

  const showTestsResult = () => {
    const filenames = Object.keys(testsResultByFilename);
    currentTestFiles.current = filenames;
    for (const filename of filenames) {
      const fileTestsResult = testsResultByFilename[filename];
      const contracts = Object.keys(fileTestsResult);
      for (const contract of contracts) {
        if (contract && contract !== "summary" && contract !== "errors") {
          runningTestFileName = cleanFileName(filename, contract);
          const tests = fileTestsResult[contract] as TestResultInterface[];
          if (tests?.length) {
            renderTests(tests, contract, filename);
          } else {
            // show only contract and file name
            renderContract(filename, contract, -1, true);
          }
        } else if (contract === "errors" && fileTestsResult["errors"]) {
          const errors = fileTestsResult["errors"];
          if (errors && errors.errors) {
            errors.errors.forEach((err: any) => {
              // eslint-disable-line @typescript-eslint/no-explicit-any
              const errorCard: ReactElement = (
                <Renderer
                  message={err.formattedMessage || err.message}
                  plugin={testTab}
                  opt={{ type: err.severity, errorType: err.type }}
                />
              );
              setTestsOutput((prevCards) => [...prevCards, errorCard]);
            });
          } else if (
            errors &&
            Array.isArray(errors) &&
            (errors[0].message || errors[0].formattedMessage)
          ) {
            errors.forEach((err) => {
              const errorCard: ReactElement = (
                <Renderer
                  message={err.formattedMessage || err.message}
                  plugin={testTab}
                  opt={{ type: err.severity, errorType: err.type }}
                />
              );
              setTestsOutput((prevCards) => [...prevCards, errorCard]);
            });
          } else if (errors && !errors.errors && !Array.isArray(errors)) {
            // To track error like this: https://github.com/ethereum/remix/pull/1438
            const errorCard: ReactElement = (
              <Renderer
                message={errors.formattedMessage || errors.message}
                plugin={testTab}
                opt={{ type: "error" }}
              />
            );
            setTestsOutput((prevCards) => [...prevCards, errorCard]);
          }
        }
      }
      // show summary
      const testSummary = fileTestsResult["summary"];
      if (testSummary && testSummary.filename && !testSummary.rendered) {
        const summaryCard: ReactElement = (
          <div className="d-flex mb-3 flex-column">
            <span className="text-white">
              Result for {testSummary.filename}
            </span>
            <span className="text-success">Passed: {testSummary.passed}</span>
            <span className="text-danger">Failed: {testSummary.failed}</span>
            <span>Time Taken: {testSummary.timeTaken}s</span>
          </div>
        );
        setTestsOutput((prevCards) => [...prevCards, summaryCard]);
        fileTestsResult["summary"]["rendered"] = true;
      }
    }
  };

  const testCallback = (result: Record<string, any>) => {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    if (result.filename) {
      if (!testsResultByFilename[result.filename]) {
        testsResultByFilename[result.filename] = {};
        testsResultByFilename[result.filename]["summary"] = {};
      }
      if (result.type === "contract") {
        testsResultByFilename[result.filename][result.value] = {};
        testsResultByFilename[result.filename][result.value] = [];
      } else {
        // Set that this test is not rendered on UI
        result.rendered = false;
        testsResultByFilename[result.filename][result.context].push(result);
      }
      showTestsResult();
    }
  };

  const resultsCallback = (_err: any, result: any, cb: any) => {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    // total stats for the test
    // result.passingNum
    // result.failureNum
    // result.timePassed
    cb();
  };

  const updateFinalResult = (
    _errors: any,
    result: FinalResult | null,
    filename: string
  ) => {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    ++readyTestsNumber;
    setReadyTestsNumber(readyTestsNumber);
    if (
      !result &&
      _errors &&
      (_errors.errors ||
        (Array.isArray(_errors) &&
          (_errors[0].message || _errors[0].formattedMessage)))
    ) {
      // show only file name
      renderContract(filename, null, -1, true);
      currentErrors.current = _errors.errors;
    }
    if (result) {
      const totalTime = parseFloat(result.totalTime).toFixed(2);
      const testsSummary = {
        filename,
        passed: result.totalPassing,
        failed: result.totalFailing,
        timeTaken: totalTime,
        rendered: false,
      };
      testsResultByFilename[filename]["summary"] = testsSummary;
      showTestsResult();
    } else if (_errors) {
      if (!testsResultByFilename[filename]) {
        testsResultByFilename[filename] = {};
      }
      testsResultByFilename[filename]["errors"] = _errors;
      setTestsExecutionStoppedErrorHidden(false);
      showTestsResult();
    }

    if (hasBeenStopped.current && readyTestsNumber !== runningTestsNumber) {
      // if all tests has been through before stopping no need to print this.
      setTestsExecutionStoppedHidden(false);
    }
    if (
      _errors ||
      hasBeenStopped.current ||
      readyTestsNumber === runningTestsNumber
    ) {
      // All tests are ready or the operation has been canceled or there was a compilation error in one of the test files.
      setDisableStopButton(true);
      setStopButtonLabel("Stop");
      if (selectedTests.current?.length !== 0) {
        setDisableRunButton(false);
      }
      areTestsRunning.current = false;
    }
  };

  const runTest = (testFilePath: string, callback: any) => {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    isDebugging.current = false;
    if (hasBeenStopped.current) {
      updateFinalResult(null, null, testFilePath);
      return;
    }
    testTab.fileManager
      .readFile(testFilePath)
      .then((content: string) => {
        const runningTests: Record<string, Record<string, string>> = {};
        runningTests[testFilePath] = { content };
        filesContent[testFilePath] = { content };
        const { currentVersion, evmVersion, optimize, runs, isUrl } =
          testTab.compileTab.getCurrentCompilerConfig();
        const currentCompilerUrl = isUrl
          ? currentVersion
          : urlFromVersion(currentVersion);
        const compilerConfig = {
          currentCompilerUrl,
          evmVersion,
          optimize,
          usingWorker: canUseWorker(currentVersion),
          runs,
        };
        const deployCb = async (file: string, contractAddress: string) => {
          const compilerData = await testTab.call(
            "compilerArtefacts",
            "getCompilerAbstract",
            file
          );
          await testTab.call(
            "compilerArtefacts",
            "addResolvedContract",
            contractAddress,
            compilerData
          );
        };
        testTab.testRunner.runTestSources(
          runningTests,
          compilerConfig,
          (result: Record<string, any>) => testCallback(result), // eslint-disable-line @typescript-eslint/no-explicit-any
          (_err: any, result: any, cb: any) =>
            resultsCallback(_err, result, cb), // eslint-disable-line @typescript-eslint/no-explicit-any
          deployCb,
          (error: any, result: any) => {
            // eslint-disable-line @typescript-eslint/no-explicit-any
            updateFinalResult(error, result, testFilePath);
            callback(error);
          },
          (url: string, cb: any) => {
            // eslint-disable-line @typescript-eslint/no-explicit-any
            return testTab.contentImport
              .resolveAndSave(url)
              .then((result: any) => cb(null, result))
              .catch((error: Error) => cb(error.message)); // eslint-disable-line @typescript-eslint/no-explicit-any
          },
          { testFilePath }
        );
      })
      .catch((error: Error) => {
        console.log(error);
        if (error) return; // eslint-disable-line
      });
  };

  const runTests = () => {
    areTestsRunning.current = true;
    hasBeenStopped.current = false;
    readyTestsNumber = 0;
    setReadyTestsNumber(readyTestsNumber);
    runningTestsNumber = selectedTests.current.length;
    setRunningTestsNumber(runningTestsNumber);
    setDisableStopButton(false);
    clearResults();
    setProgressBarHidden(false);
    const tests: string[] = selectedTests.current;
    if (!tests || !tests.length) return;
    else setProgressBarHidden(false);
    _paq.push([
      "trackEvent",
      "solidityUnitTesting",
      "runTests",
      "nbTestsRunning" + tests.length,
    ]);
    eachOfSeries(tests, (value: string, key: string, callback: any) => {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      if (hasBeenStopped.current) return;
      runTest(value, callback);
    });
  };

  const updateRunAction = async (currentFile: any = null) => {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    const isSolidityActive = await testTab.appManager.isActive("solidity");
    if (!isSolidityActive || !selectedTests.current.length) {
      setDisableRunButton(true);
      if (
        !currentFile ||
        (currentFile && currentFile.split(".").pop().toLowerCase() !== "sol")
      ) {
        setRunButtonTitle("No solidity file selected");
      } else {
        setRunButtonTitle('The "Solidity Plugin" should be activated');
      }
    } else setDisableRunButton(false);
  };

  const stopTests = () => {
    hasBeenStopped.current = true;
    setStopButtonLabel("Stopping");
    setDisableStopButton(true);
    setDisableRunButton(true);
  };

  const getCurrentSelectedTests = () => {
    const selectedTestsList: TestObject[] = testFiles.filter(
      (testFileObj) => testFileObj.checked
    );
    return selectedTestsList.map((testFileObj) => testFileObj.fileName);
  };

  const toggleCheckbox = (eChecked: boolean, index: number) => {
    testFiles[index].checked = eChecked;
    setTestFiles([...testFiles]);
    selectedTests.current = getCurrentSelectedTests();
    if (eChecked) {
      setCheckSelectAll(true);
      setDisableRunButton(false);
      if (
        (readyTestsNumber === runningTestsNumber || hasBeenStopped.current) &&
        stopButtonLabel.trim() === "Stop"
      ) {
        setRunButtonTitle("Run tests");
      }
    } else if (!selectedTests.current.length) {
      setCheckSelectAll(false);
      setDisableRunButton(true);
      setRunButtonTitle("No test file selected");
    } else setCheckSelectAll(false);
  };

  const checkAll = (event: any) => {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    testFiles.forEach(
      (testFileObj) => (testFileObj.checked = event.target.checked)
    );
    setTestFiles([...testFiles]);
    setCheckSelectAll(event.target.checked);
    if (event.target.checked) {
      selectedTests.current = getCurrentSelectedTests();
      setDisableRunButton(false);
    } else {
      selectedTests.current = [];
      setDisableRunButton(true);
    }
  };

  const updateTestFileList = () => {
    if (allTests.current?.length) {
      testFiles = allTests.current.map((testFile: string) => {
        return { fileName: testFile, checked: true };
      });
      setCheckSelectAll(true);
    } else testFiles = [];
    setTestFiles([...testFiles]);
  };

  return (
    <div className="px-2" id="testView">
      <Toaster message={toasterMsg} />
      <div className="infoBox">
        <p className="font-14 text-dark">
          Test your smart contract in Solidity Select directory to load and
          generate test files.
        </p>
        <label className="font-14 text-white">Test directory:</label>
        <div>
          <div className="d-flex flex-column" style={{ gap: "13px" }}>
            <datalist id="utPathList">
              {pathOptions.map(function (path) {
                return <option key={path}>{path}</option>;
              })}
            </datalist>
            <CustomTooltip
              placement="top-end"
              tooltipClasses="text-nowrap"
              tooltipId="uiPathInputtooltip"
              tooltipText={"Press 'Enter' to change the path for test files."}
            >
              <input
                list="utPathList"
                className="inputFolder custom-select"
                id="utPath"
                data-id="uiPathInput"
                name="utPath"
                value={inputPathValue}
                style={{ backgroundImage: "var(--primary)" }}
                onKeyDown={() => {
                  if (inputPathValue === "/") setInputPathValue("");
                }}
                onChange={handleTestDirInput}
                onClick={() => {
                  if (inputPathValue === "/") setInputPathValue("");
                }}
              />
            </CustomTooltip>
            <CustomTooltip
              placement="top-end"
              tooltipClasses="text-nowrap"
              tooltipId="uiPathInputButtontooltip"
              tooltipText="Create a test folder"
            >
              <button
                className="btn createBtn"
                data-id="testTabGenerateTestFolder"
                disabled={disableCreateButton}
                onClick={handleCreateFolder}
              >
                Create
              </button>
            </CustomTooltip>
          </div>
        </div>
      </div>
      <div>
        <div
          className="d-flex flex-column"
          style={{ gap: "13px", paddingTop: "30px" }}
        >
          <CustomTooltip
            tooltipId="generateTestsButtontooltip"
            tooltipClasses="text-nowrap"
            tooltipText="Generate a sample test file"
            placement={"bottom-start"}
          >
            <button
              className="btn w-100 grayBtn"
              data-id="testTabGenerateTestFile"
              disabled={disableGenerateButton}
              onClick={async () => {
                await testTabLogic.generateTestFile((err: any) => {
                  if (err) setToasterMsg(err);
                }); // eslint-disable-line @typescript-eslint/no-explicit-any
                await updateForNewCurrent();
              }}
            >
              Generate
            </button>
          </CustomTooltip>
          <CustomTooltip
            tooltipId="generateTestsLinktooltip"
            tooltipClasses="text-nowrap"
            tooltipText="Check out documentation."
            placement={"bottom-start"}
          >
            <a
              className="btn text-decoration-none pr-0 d-flex w-100 grayBtn"
              target="__blank"
              href="https://remix-ide.readthedocs.io/ en/latest/unittesting.html#test-directory"
            >
              <span
                className="btn font-12 d-flex justify-content-center align-items-center"
                style={{ gap: "10px" }}
              >
                How to use{" "}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.65806 2.59014C3.23091 3.05015 3 3.74323 3 4.66658V11.3333C3 12.2566 3.23091 12.9497 3.65806 13.4097C4.07899 13.863 4.76197 14.1666 5.83333 14.1666H11.1667C12.238 14.1666 12.921 13.863 13.3419 13.4097C13.7691 12.9497 14 12.2566 14 11.3333V4.66658C14 3.74323 13.7691 3.05015 13.3419 2.59014C12.921 2.13684 12.238 1.83325 11.1667 1.83325H5.83333C4.76197 1.83325 4.07899 2.13684 3.65806 2.59014ZM2.92527 1.90969C3.58768 1.19633 4.57137 0.833252 5.83333 0.833252H11.1667C12.4286 0.833252 13.4123 1.19633 14.0747 1.90969C14.7309 2.61635 15 3.58994 15 4.66658V11.3333C15 12.4099 14.7309 13.3835 14.0747 14.0901C13.4123 14.8035 12.4286 15.1666 11.1667 15.1666H5.83333C4.57137 15.1666 3.58768 14.8035 2.92527 14.0901C2.26909 13.3835 2 12.4099 2 11.3333V4.66658C2 3.58994 2.26909 2.61635 2.92527 1.90969Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.1673 2.5C10.4435 2.5 10.6673 2.72386 10.6673 3V4.33333C10.6673 4.79052 11.0435 5.16667 11.5007 5.16667H12.834C13.1101 5.16667 13.334 5.39052 13.334 5.66667C13.334 5.94281 13.1101 6.16667 12.834 6.16667H11.5007C10.4912 6.16667 9.66732 5.34281 9.66732 4.33333V3C9.66732 2.72386 9.89118 2.5 10.1673 2.5ZM5.33398 8.66667C5.33398 8.39052 5.55784 8.16667 5.83398 8.16667H8.50065C8.77679 8.16667 9.00065 8.39052 9.00065 8.66667C9.00065 8.94281 8.77679 9.16667 8.50065 9.16667H5.83398C5.55784 9.16667 5.33398 8.94281 5.33398 8.66667ZM5.33398 11.3333C5.33398 11.0572 5.55784 10.8333 5.83398 10.8333H11.1673C11.4435 10.8333 11.6673 11.0572 11.6673 11.3333C11.6673 11.6095 11.4435 11.8333 11.1673 11.8333H5.83398C5.55784 11.8333 5.33398 11.6095 5.33398 11.3333Z"
                    fill="white"
                  />
                </svg>
              </span>
            </a>
          </CustomTooltip>
        </div>
        <div className="d-flex" style={{ paddingTop: "13px" }}>
          <CustomTooltip
            placement={"top-start"}
            tooltipClasses="text-nowrap"
            tooltipId="info-recorder"
            tooltipText={runButtonTitle}
          >
            <button
              id="runTestsTabRunAction"
              data-id="testTabRunTestsTabRunAction"
              className="w-50 btn btn-primary"
              disabled={disableRunButton}
              onClick={runTests}
            >
              <span className="far fa-play ml-2"></span>
              <span className="labelOnBtn font-12">Run</span>
            </button>
          </CustomTooltip>
          <button
            id="runTestsTabStopAction"
            data-id="testTabRunTestsTabStopAction"
            className="w-50 pl-2 ml-2 btn btn-secondary"
            disabled={disableStopButton}
            onClick={stopTests}
          >
            <CustomTooltip
              placement={"top-start"}
              tooltipClasses="text-nowrap"
              tooltipId="info-recorder"
              tooltipText="Stop running tests"
            >
              <span>
                <span className="far fa-stop mr-2"></span>
                <span
                  className="labelOnBtn btn font-12"
                  id="runTestsTabStopActionLabel"
                >
                  {stopButtonLabel}
                </span>
              </span>
            </CustomTooltip>
          </button>
        </div>
        <div
          className="d-flex align-items-center mx-3 pb-2 mb-1 mt-2 border-bottom custom-control custom-checkbox"
          style={{ gap: "8px", paddingTop: "30px" }}
        >
          <input
            id="checkAllTests"
            type="checkbox"
            data-id="testTabCheckAllTests"
            className="custom-control-input"
            onClick={checkAll}
            checked={checkSelectAll}
            onChange={() => {}} // eslint-disable-line
          />
          <label
            className="text-nowrap font-12 text-white mb-0 pb-0 custom-control-label"
            htmlFor="checkAllTests"
          >
            Select all
          </label>
        </div>
        <div className="testList mt-0">
          {testFiles.length
            ? testFiles.map((testFileObj: TestObject, index) => {
                const elemId = `singleTest${testFileObj.fileName}`;
                return (
                  <div
                    className="d-flex align-items-center py-1 custom-control custom-checkbox"
                    key={index}
                  >
                    <input
                      data-id="singleTest"
                      className="singleTest custom-control-input"
                      id={elemId}
                      onChange={(e) => toggleCheckbox(e.target.checked, index)}
                      type="checkbox"
                      checked={testFileObj.checked}
                    />
                    <label
                      className="singleTestLabel text-nowrap pl-2 mb-0 custom-control-label font-12 text-white"
                      htmlFor={elemId}
                    >
                      {testFileObj.fileName}
                    </label>
                  </div>
                );
              })
            : "No test file available"}{" "}
        </div>
        <div className="align-items-start flex-column mt-2 mx-3 mb-0">
          <span className="text-info font-12" hidden={progressBarHidden}>
            Progress: {readyTestsNumber} finished (of {runningTestsNumber})
          </span>
          <label
            className="text-warning h6"
            data-id="testTabTestsExecutionStopped"
            hidden={testsExecutionStoppedHidden}
          >
            The test execution has been stopped
          </label>
          <label
            className="text-danger h6"
            data-id="testTabTestsExecutionStoppedError"
            hidden={testsExecutionStoppedErrorHidden}
          >
            The test execution has been stopped because of error(s) in your test
            file
          </label>
        </div>
        <div
          className="mx-3 mb-2 pb-4 border-primary"
          id="solidityUnittestsOutput"
          data-id="testTabSolidityUnitTestsOutput"
        >
          {testsOutput}
        </div>
      </div>
    </div>
  );
};

export default SolidityUnitTesting;
