import {
  CornerDecorRed,
  CornerDecorYellow,
  CustomTooltip,
} from "@remix-ui/helper";
import React from "react"; //eslint-disable-line

interface ErrorRendererProps {
  message: any;
  opt: any;
  warningErrors: any;
  editor: any;
  name: string;
}

const ErrorRenderer = ({ message, opt, editor, name }: ErrorRendererProps) => {
  const getPositionDetails = (msg: any) => {
    const result = {} as Record<string, number | string>;

    // To handle some compiler warning without location like SPDX license warning etc
    if (!msg.includes(":")) return { errLine: -1, errCol: -1, errFile: msg };

    // extract line / column
    let position = msg.match(/^(.*?):([0-9]*?):([0-9]*?)?/);
    result.errLine = position ? parseInt(position[2]) - 1 : -1;
    result.errCol = position ? parseInt(position[3]) : -1;

    // extract file
    position = msg.match(/^(https:.*?|http:.*?|.*?):/);
    result.errFile = position ? position[1] : "";
    return result;
  };

  const handlePointToErrorOnClick = async (location, fileName) => {
    await editor.call("editor", "discardHighlight");
    await editor.call("editor", "highlight", location, fileName, "", {
      focus: true,
    });
  };

  if (!message) return;
  let position = getPositionDetails(message);
  if (
    !position.errFile ||
    (opt.errorType && opt.errorType === position.errFile)
  ) {
    // Updated error reported includes '-->' before file details
    const errorDetails = message.split("-->");
    // errorDetails[1] will have file details
    if (errorDetails.length > 1) position = getPositionDetails(errorDetails[1]);
  }
  opt.errLine = position.errLine;
  opt.errCol = position.errCol;
  opt.errFile = position.errFile.trim();

  return (
    <div>
      <div className={`sol ${opt.type}`}>
        <span
          className="d-flex flex-column p-3 mb-2"
          data-id={`${name}Button`}
          onClick={async () =>
            await handlePointToErrorOnClick(opt.location, opt.fileName)
          }
          style={{ position: "relative" }}
        >
          {opt.type === "error" ? <CornerDecorRed /> : <CornerDecorYellow />}
          <span className="h6 font-weight-bold">{opt.name}</span>
          {opt.item.warning}
          {opt.item.more ? (
            <span>
              <a href={opt.item.more} target="_blank">
                more
              </a>
            </span>
          ) : (
            <span> </span>
          )}
          <CustomTooltip
            placement="right"
            tooltipId="errorTooltip"
            tooltipText={`Position in ${opt.errFile}`}
            tooltipClasses="text-nowrap"
          >
            <span>Pos: {opt.locationString}</span>
          </CustomTooltip>
        </span>
      </div>
    </div>
  );
};

export default ErrorRenderer;
