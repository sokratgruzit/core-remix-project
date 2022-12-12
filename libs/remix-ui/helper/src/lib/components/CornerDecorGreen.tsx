import React from "react";

const CornerDecor = () => {
  return (
    <div className="decorBoxWrap">
      <div className="decorBox decorBox__topLeft">
        <div className="decorBox__topLeft__top__green"></div>
        <div className="decorBox__topLeft__left__green"></div>
      </div>
      <div className="decorBox decorBox__topRight">
        <div className="decorBox__topRight__top__green"></div>
        <div className="decorBox__topRight__right__green"></div>
      </div>

      <div className="decorBox decorBox__bottomRight">
        <div className="decorBox__bottomRight__bottom__green"></div>
        <div className="decorBox__bottomRight__right__green"></div>
      </div>
      <div className="decorBox decorBox__bottomLeft">
        <div className="decorBox__bottomLeft__bottom__green"></div>
        <div className="decorBox__bottomLeft__left__green"></div>
      </div>
    </div>
  );
};

export default CornerDecor;
