import { CustomTooltip } from "@remix-ui/helper";
import React, { CSSProperties } from "react"; //eslint-disable-line
import "./remix-ui-checkbox.css";
type Placement = import("react-overlays/usePopper").Placement;

/* eslint-disable-next-line */
export interface RemixUiCheckboxProps {
  onClick?: (event) => void;
  onChange?: (event) => void;
  label?: string;
  inputType?: string;
  name?: string;
  checked?: boolean;
  id?: string;
  itemName?: string;
  categoryId?: string;
  title?: string;
  visibility?: string;
  display?: string;
  tooltipPlacement?: Placement;
}

export const RemixUiCheckbox = ({
  id,
  label,
  onClick,
  inputType,
  name,
  checked,
  onChange,
  itemName,
  categoryId,
  title,
  visibility,
  display = "flex",
  tooltipPlacement = "right-start",
}: RemixUiCheckboxProps) => {
  const childJSX = (
    <div
      className="listenOnNetwork_2A0YE0 custom-control custom-checkbox"
      style={
        {
          display: display,
          alignItems: "center",
          visibility: visibility,
          marginTop: "4px",
        } as CSSProperties
      }
      onClick={onClick}
    >
      <input
        id={id}
        type={inputType}
        onChange={onChange}
        style={{ verticalAlign: "bottom" }}
        name={name}
        className="custom-control-input"
        checked={checked}
      />
      <label
        className="form-check-label custom-control-label"
        id={`heading${categoryId}`}
      >
        {name ? <div className="font-weight-bold">{itemName}</div> : ""}
        {label}
      </label>
    </div>
  );
  return (
    <CustomTooltip
      tooltipText={title}
      tooltipId={`${name}Tooltip`}
      placement={tooltipPlacement}
    >
      {childJSX}
    </CustomTooltip>
  );
};

export default RemixUiCheckbox;
