import React, { useState, useEffect } from "react"; // eslint-disable-line
import { TreeViewItemProps } from "../../types";

import "./tree-view-item.css";

export const TreeViewItem = (props: TreeViewItemProps) => {
  const {
    id,
    children,
    label,
    labelClass,
    expand,
    iconX = "fas fa-caret-right",
    iconY = "fas",
    icon,
    controlBehaviour = false,
    innerRef,
    showIcon = true,
    ...otherProps
  } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(expand);
  }, [expand]);

  return (
    <li
      ref={innerRef}
      key={`treeViewLi${id}`}
      data-id={`treeViewLi${id}`}
      className="li_tv"
      {...otherProps}
    >
      <div
        key={`treeViewDiv${id}`}
        data-id={`treeViewDiv${id}`}
        className={`d-flex flex-row align-items-center justify-content-between w-100 px-2 ${labelClass} `}
        onClick={() => !controlBehaviour && setIsExpanded(!isExpanded)}
        style={{ background: isExpanded && "#0F1218", borderRadius: "4px" }}
      >
        <span className="w-100">{label}</span>

        {children && showIcon ? (
          <div>
            <svg
              width="10"
              height="7"
              viewBox="0 0 10 7"
              fill="#343841"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                visibility: children ? "visible" : "hidden",
                rotate: isExpanded && "-180deg",
                cursor: "pointer",
              }}
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.33263 1.2526C0.743926 0.884022 1.37614 0.918648 1.74472 1.32994L5 4.96246L8.25528 1.32994C8.62386 0.918648 9.25607 0.884022 9.66737 1.2526C10.0787 1.62119 10.1133 2.2534 9.74471 2.6647L6.45179 6.33923C5.66546 7.21668 4.33454 7.21668 3.54821 6.33923L0.25529 2.6647C-0.113292 2.2534 -0.078666 1.62119 0.33263 1.2526Z"
              />
            </svg>
          </div>
        ) : icon ? (
          <div>
            {" "}
            <div className={`pr-3 pl-1 ${icon} caret caret_tv`}></div>
          </div>
        ) : null}
      </div>
      {isExpanded ? children : null}
    </li>
  );
};

export default TreeViewItem;
