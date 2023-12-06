import React, { useState, useEffect } from "react";
import styles from "./Main.module.css";
import { FaHeart } from "react-icons/fa";
import { AiFillGold } from "react-icons/ai";
import { IoMdFlame } from "react-icons/io";
import { FaCrown } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

import Button from "../UI/Button";

export default function Header({
  openSettings,
  setOpenSettings,
  love,
  power,
  wealth,
  kingdomName,
}) {
  const [beforeLove, setBeforeLove] = useState(love);
  const [beforePower, setBeforePower] = useState(power);
  const [beforeWealth, setBeforeWealth] = useState(wealth);
  const [loveColor, setLoveColor] = useState("white");
  const [powerColor, setPowerColor] = useState("white");
  const [wealthColor, setWealthColor] = useState("white");
  useEffect(() => {
    if (beforeLove !== love) {
      setBeforeLove(love);
      beforeLove > love ? setLoveColor("red") : setLoveColor("green");
    }
    if (beforePower !== power) {
      setBeforePower(power);
      beforePower > power ? setPowerColor("red") : setPowerColor("green");
    }
    if (beforeWealth !== wealth) {
      setBeforeWealth(wealth);
      beforeWealth > wealth ? setWealthColor("red") : setWealthColor("green");
    }
  }, [love, power, wealth]);
  useEffect(() => {
    setTimeout(() => {
      setLoveColor("white");
      setPowerColor("white");
      setWealthColor("white");
    }, 1000);
  }, [loveColor, powerColor, wealthColor]);
  return (
    <div className={styles.header}>
      <div className={styles.titleArea}>
        <FaCrown size={36} color="white" className={styles.icon} />
        <div className={styles.title}>
          <h1>{kingdomName}</h1>
        </div>
        <IoMdSettings
          size={36}
          color="white"
          className={styles.icon}
          onClick={() => setOpenSettings(true)}
        />
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <FaHeart size={36} color={`${loveColor}`} className={styles.icon} />
          <p>{love}</p>
        </div>
        <div className={styles.stat}>
          <IoMdFlame
            size={36}
            color={`${powerColor}`}
            className={styles.icon}
          />
          <p>{power}</p>
        </div>
        <div className={styles.stat}>
          <AiFillGold
            size={36}
            color={`${wealthColor}`}
            className={styles.icon}
          />
          <p>{wealth}</p>
        </div>
      </div>
    </div>
  );
}
