/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

const CustomNavButtons = ({ next, previous, goToSlide, ...rest }) => {
  const {
    carouselState: { currentSlide, totalItems, itemWidth, containerWidth },
  } = rest;
  return (
    <div
      className="mt-1 d-flex justify-content-end carousel-button-group"
      style={{ position: "absolute", top: "-48px", right: 0 }}
    >
      <button
        className={currentSlide === 0 ? "disable btn" : " btn"}
        style={{ background: "none", border: "none" }}
        disabled={currentSlide === 0}
        onClick={() => previous()}
      >
        <svg
          width="14"
          height="10"
          viewBox="0 0 14 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M-2.18557e-07 5C-2.28619e-07 4.76981 0.0902398 4.54905 0.250868 4.38628L4.32857 0.254214C4.66306 -0.0847372 5.20537 -0.0847372 5.53986 0.254214C5.87436 0.593164 5.87436 1.14271 5.53986 1.48166L2.06782 5L5.53987 8.51834C5.87436 8.85729 5.87436 9.40684 5.53987 9.74579C5.20537 10.0847 4.66306 10.0847 4.32857 9.74579L0.250868 5.61372C0.0902398 5.45095 -2.08495e-07 5.23019 -2.18557e-07 5Z"
            fill="white"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.111328 4.99925C0.111328 4.5199 0.494804 4.13131 0.967846 4.13131L12.2739 4.13131C12.7469 4.13131 13.1304 4.5199 13.1304 4.99925C13.1304 5.4786 12.7469 5.86719 12.2739 5.86719L0.967846 5.86719C0.494804 5.86719 0.111328 5.4786 0.111328 4.99925Z"
            fill="white"
          />
        </svg>
      </button>
      <button
        className={
          (totalItems - currentSlide) * itemWidth + 5 < containerWidth
            ? "disable  btn"
            : " btn"
        }
        style={{ background: "none", border: "none" }}
        onClick={() => {
          if (currentSlide - 1 < totalItems) goToSlide(currentSlide + 1);
        }}
        disabled={currentSlide > totalItems}
      >
        <svg
          width="14"
          height="10"
          viewBox="0 0 14 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14 5C14 4.76981 13.9098 4.54905 13.7491 4.38628L9.67143 0.254214C9.33694 -0.084737 8.79463 -0.0847371 8.46013 0.254214C8.12564 0.593164 8.12564 1.14271 8.46013 1.48166L11.9322 5L8.46013 8.51834C8.12564 8.85729 8.12564 9.40684 8.46013 9.74579C8.79463 10.0847 9.33694 10.0847 9.67143 9.74579L13.7491 5.61372C13.9098 5.45095 14 5.23019 14 5Z"
            fill="white"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.8887 4.99925C13.8887 4.5199 13.5052 4.13131 13.0322 4.13131L1.72611 4.13131C1.25307 4.13131 0.869596 4.5199 0.869596 4.99925C0.869596 5.4786 1.25307 5.86719 1.72611 5.86719L13.0322 5.86719C13.5052 5.86719 13.8887 5.4786 13.8887 4.99925Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  );
};

export default CustomNavButtons;
