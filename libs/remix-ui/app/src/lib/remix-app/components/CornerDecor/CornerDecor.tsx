import React from "react";
import styles from "./CornerDecor.module.css";

const CornerDecor = () => {
  return (
    <div className={styles.decorBoxWrap}>
      <div className={`${styles.decorBox} ${styles.decorBox__topLeft}`}>
        <div className={styles.decorBox__topLeft__top}></div>
        <div className={styles.decorBox__topLeft__left}></div>
      </div>
      <div className={`${styles.decorBox} ${styles.decorBox__topRight}`}>
        <div className={styles.decorBox__topRight__top}></div>
        <div className={styles.decorBox__topRight__right}></div>
      </div>

      <div className={`${styles.decorBox} ${styles.decorBox__bottomRight}`}>
        <div className={styles.decorBox__bottomRight__bottom}></div>
        <div className={styles.decorBox__bottomRight__right}></div>
      </div>
      <div className={`${styles.decorBox} ${styles.decorBox__bottomLeft}`}>
        <div className={styles.decorBox__bottomLeft__bottom}></div>
        <div className={styles.decorBox__bottomLeft__left}></div>
      </div>
    </div>
  );
};

export default CornerDecor;
