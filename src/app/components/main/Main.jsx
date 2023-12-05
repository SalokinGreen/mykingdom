"use client";
import React, { useState } from "react";
import styles from "./Main.module.css";
import Header from "./Header";
import Input from "../UI/Input";
import buildContext from "@/utils/front/buildContext";
import mykingdom from "@/utils/contexts/mykingdomcontext";
import generate from "@/utils/front/generate";
import Button from "../UI/Button";
export default function Main() {
  const [openSettings, setOpenSettings] = useState(false);
  const [love, setLove] = useState(50);
  const [power, setPower] = useState(50);
  const [wealth, setWealth] = useState(50);
  const [context, setContext] = useState([]);
  const [input, setInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [year, setYear] = useState(0);
  const [choice, setChoice] = useState(false);
  function handleEnter(e) {
    if (e.key === "Enter") {
      send();
    }
  }
  function beforeChoice() {
    setGenerating(true);
    setChoice(true);
    buildContext(
      mykingdom.start,
      mykingdom.context,
      [...context, mykdc],
      8000
    ).then((res) => {
      generate(
        res +
          `\n[ Love: ${love}; Power: ${power}; Wealth: ${wealth} ]\nYear ${year}\n`,
        {},
        ""
      ).then((res2) => {
        console.log(res2);
        let text = res2[0].replace("\n>", "");
        // remove "\n> " from the end
        setContext([...context, `Year ${year}\n${text}`]);
        setGenerating(false);
      });
    });
  }
  function afterChoice() {
    setGenerating(true);
    setChoice(false);
    buildContext(
      mykingdom.after,
      mykingdom.context,
      [...context, mykdc],
      8000
    ).then((res) => {
      setInput("");
      generate(res + `\n> ${input}\n`, {}, "").then((res2) => {
        console.log(res2);
        let text = res2[0].replace("\n***", "");
        // remove "\n> " from the end
        setContext([...context, `> ${input}`, text]);
        setGenerating(false);
        setYear(year + 1);
      });
    });
  }
  function send() {
    if (generating) return;
    if (choice) {
      afterChoice();
    } else {
      beforeChoice();
    }
  }
  return (
    <div className={styles.main}>
      <Header
        openSettings={setOpenSettings}
        love={love}
        power={power}
        wealth={wealth}
      />
      {/* context later */}
      <div className={styles.contextContainer}>
        {context.map((c, i) => (
          <div
            key={i}
            className={styles.context}
            style={{ whiteSpace: "pre-line" }}
          >
            {c}
          </div>
        ))}
      </div>
      <div className={styles.inputArea}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          handleEnter={handleEnter}
        />
        <Button onClick={() => start()}>Enter</Button>
      </div>
    </div>
  );
}
const mykdc = `> NEW GAME
***
[ Title: My Kingdom; Tags: game; ]
----
Love
Status: neutral, 50 out of 100
Description: How much your kingdom loves you! Highly correlated with approval, love is a base for loyalty and duty. You earn love by being fair, kind, and charming.
----
Power
Status: neutral, 50 out of 100
Description: Power is the strength of your kingdom. Power gets stronger by getting resources, like army units, but it gets smaller with your loses.
----
Wealth
Status: neutral, 50 out of 100
Description: The assets in your coffers, how much gold is available for you to spend. The higher the wealth, the better paid are your army and workers, and the more noble they view you to be.
***`;
