// eslint-disable-next-line no-use-before-define
import { CustomTooltip } from "@remix-ui/helper";
import React from "react";
import { GasPriceProps } from "../types";

export function GasPriceUI(props: GasPriceProps) {
  const handleGasLimit = (e) => {
    props.setGasFee(e.target.value);
  };

  return (
    <div className="udapp_crow d-flex flex-column ">
      <label className="udapp_settingsLabel font-14 text-white">
        Gas limit
      </label>
      <CustomTooltip
        placement={"right-end"}
        tooltipClasses="text-nowrap"
        tooltipId="remixGasPriceTooltip"
        tooltipText={"The default gas limit is 3M. Adjust as needed."}
      >
        <input
          type="number"
          className="form-control custom-select udapp_gasNval udapp_col2"
          id="gasLimit"
          value={props.gasLimit}
          onChange={handleGasLimit}
        />
      </CustomTooltip>
    </div>
  );
}
