import React from "react";

const CornerDecor = () => {
  return (
    <div className="decorBoxWrap">
      <div className="decorBox decorBox__topLeft">
        <div className="decorBox__topLeft__top__red"></div>
        <div className="decorBox__topLeft__left__red"></div>
      </div>
      <div className="decorBox decorBox__topRight">
        <div className="decorBox__topRight__top__red"></div>
        <div className="decorBox__topRight__right__red"></div>
      </div>

      <div className="decorBox decorBox__bottomRight">
        <div className="decorBox__bottomRight__bottom__red"></div>
        <div className="decorBox__bottomRight__right__red"></div>
      </div>
      <div className="decorBox decorBox__bottomLeft">
        <div className="decorBox__bottomLeft__bottom__red"></div>
        <div className="decorBox__bottomLeft__left__red"></div>
      </div>
    </div>
  );
};

export default CornerDecor;
