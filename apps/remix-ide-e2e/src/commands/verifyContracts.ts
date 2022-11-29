import { NightwatchBrowser } from "nightwatch";
import EventEmitter from "events";

class VerifyContracts extends EventEmitter {
  command(
    this: NightwatchBrowser,
    compiledContractNames: string[],
    opts = { wait: 1000, version: null, runs: "200" }
  ): NightwatchBrowser {
    this.api.perform((done) => {
      verifyContracts(this.api, compiledContractNames, opts, () => {
        done();
        this.emit("complete");
      });
    });
    return this;
  }
}

function verifyContracts(
  browser: NightwatchBrowser,
  compiledContractNames: string[],
  opts: { wait: number; version?: string; runs?: string },
  callback: VoidFunction
) {
  browser
    .clickLaunchIcon("solidity")
    .pause(opts.wait)
    .pause(5000)
    .waitForElementPresent('*[data-id="compiledContracts"] option', 60000)
    .perform(async (done) => {
      if (opts.version) {
        browser
          .click('*[data-id="compilation-details"]')
          .waitForElementVisible('*[data-id="remixui_treeviewitem_metadata"]')
          .pause(2000)
          .click('*[data-id="remixui_treeviewitem_metadata"]')
          .waitForElementVisible('*[data-id="treeViewDivtreeViewItemcompiler"]')
          .pause(2000)
          .click('*[data-id="treeViewDivtreeViewItemcompiler"]')
          .waitForElementVisible('*[data-id="treeViewLiversion"]')
          .assert.containsText(
            '*[data-id="treeViewLiversion"]',
            `${opts.version}`
          )
          .click('[data-id="workspacesModalDialog-modal-footer-ok-react"]')
          .perform(() => {
            done();
            callback();
          });
      }
      if (opts.runs) {
        browser
          .click('*[data-id="compilation-details"]')
          .waitForElementVisible('*[data-id="remixui_treeviewitem_metadata"]')
          .pause(2000)
          .click('*[data-id="remixui_treeviewitem_metadata"]')
          .waitForElementVisible('*[data-id="treeViewDivtreeViewItemsettings"]')
          .pause(2000)
          .click('*[data-id="treeViewDivtreeViewItemsettings"]')
          .waitForElementVisible(
            '*[data-id="treeViewDivtreeViewItemoptimizer"]'
          )
          .click('*[data-id="treeViewDivtreeViewItemoptimizer"]')
          .waitForElementVisible('*[data-id="treeViewDivruns"]')
          .assert.containsText('*[data-id="treeViewDivruns"]', `${opts.runs}`)
          .click('[data-id="workspacesModalDialog-modal-footer-ok-react"]')
          .perform(() => {
            done();
            callback();
          });
      } else {
        for (const index in compiledContractNames) {
          await browser.waitForElementContainsText(
            '[data-id="compiledContracts"]',
            compiledContractNames[index],
            60000
          );
        }
        done();
        callback();
      }
    });
}

module.exports = VerifyContracts;
