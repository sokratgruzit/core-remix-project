import React from "react";

const CornerDecor = () => {
  return (
    <div className="decorBoxWrap">
      <div className="decorBox decorBox__topLeft">
        <div className="decorBox__topLeft__top"></div>
        <div className="decorBox__topLeft__left"></div>
      </div>
      <div className="decorBox decorBox__topRight">
        <div className="decorBox__topRight__top"></div>
        <div className="decorBox__topRight__right"></div>
      </div>

      <div className="decorBox decorBox__bottomRight">
        <div className="decorBox__bottomRight__bottom"></div>
        <div className="decorBox__bottomRight__right"></div>
      </div>
      <div className="decorBox decorBox__bottomLeft">
        <div className="decorBox__bottomLeft__bottom"></div>
        <div className="decorBox__bottomLeft__left"></div>
      </div>
    </div>
  );
};

export default CornerDecor;
