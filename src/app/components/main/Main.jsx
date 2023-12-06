"use client";
import React, { useEffect, useState } from "react";
import styles from "./Main.module.css";
import Header from "./Header";
import Input from "../UI/Input";
import buildContext from "@/utils/front/buildContext";
import mykingdom from "@/utils/contexts/mykingdomcontext";
import generate from "@/utils/front/generate";
import Button from "../UI/Button";
import Bubble from "../UI/Bubble";
import Modal from "../UI/Modal";
export default function Main() {
  const [openSettings, setOpenSettings] = useState(false);
  const [key, setKey] = useState("");
  const [love, setLove] = useState(50);
  const [power, setPower] = useState(50);
  const [wealth, setWealth] = useState(50);
  const [context, setContext] = useState([]);
  const [input, setInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [year, setYear] = useState(0);
  const [choice, setChoice] = useState(false);
  const [mykingdomcontext, setMykingdomcontext] = useState("");
  const [kingdom, setKingdom] = useState({
    name: "Greenland",
    race: "Human",
    system: "Monarchy",
  });
  const [ruler, setRuler] = useState({
    name: "SGreen the Second",
  });
  useEffect(() => {
    setMykingdomcontext(`> NEW GAME
***
[ Title: My Kingdom; Tags: game; ]
----
Love
Status: neutral, ${love} out of 100
Description: How much your kingdom loves you! Highly correlated with approval, love is a base for loyalty and duty. You earn love by being fair, kind, and charming.
----
Power
Status: neutral, ${power} out of 100
Description: Power is the strength of your kingdom. Power gets stronger by getting resources, like army units, but it gets smaller with your loses.
----
Wealth
Status: neutral, ${wealth} out of 100
Description: The assets in your coffers, how much gold is available for you to spend. The higher the wealth, the better paid are your army and workers, and the more noble they view you to be.
----
Kingdom
Name: ${kingdom.name}
Population: ${kingdom.race}
System: ${kingdom.system}
[ Love: ${love}; Power: ${power}; Wealth: ${wealth} ]
----
You (Ruler)
Name: ${ruler.name}
***`);
  }, [love, power, wealth]);
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
      [...context, mykingdomcontext],
      8000
    ).then((res) => {
      generate(res + `\nYear ${year}\n`, {}, key).then((res2) => {
        console.log(res2);
        let text = res2[0].replace("\n>", "");
        if (text.includes("\n***")) {
          text = text.split("\n***")[0];
        }
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
      [...context, mykingdomcontext],
      8000
    ).then((res) => {
      setInput("");
      generate(res + `\n> ${input}\n`, {}, key).then((res2) => {
        console.log(res2);
        let text = res2[0].replace("\n***", "");
        if (text.includes("\n>")) {
          text = text.split("\n>")[0];
        }
        // points logic. There might be "Love: XXX;" or "Love: ]" check for both
        const loveText = text.split("Love: ")[1];
        const powerText = text.split("Power: ")[1];
        const wealthText = text.split("Wealth: ")[1];
        if (loveText) {
          const loveValue = getValue(loveText);
          setLove(love + loveValue);
        }
        if (powerText) {
          const powerValue = getValue(powerText);
          setPower(power + powerValue);
        }
        if (wealthText) {
          const wealthValue = getValue(wealthText);
          setWealth(wealth + wealthValue);
        }

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
  const handleApiKeyChange = (event) => {
    setKey(event.target.value);
    localStorage.setItem("MKapiKey", event.target.value);
  };
  useEffect(() => {
    // check if the username and API key are in local storage
    // if they are, set the state to the values from local storage
    //  if (localStorage.getItem("TRPusername")) {
    //    setUsername(localStorage.getItem("TRPusername"));
    //  }
    if (localStorage.getItem("MKapiKey")) {
      setKey(localStorage.getItem("MKapiKey"));
    }
  }, []);
  const getValue = (text) => {
    if (
      text.includes("increased greatly") ||
      text.includes("increase greatly") ||
      text.includes("greatly increased") ||
      text.includes("greatly increase")
    ) {
      return 20;
    } else if (
      text.includes("increased") ||
      text.includes("+") ||
      text.includes("increase")
    ) {
      return 10;
    } else if (
      text.includes("decreased greatly") ||
      text.includes("decrease greatly") ||
      text.includes("greatly decreased") ||
      text.includes("greatly decrease")
    ) {
      return -20;
    } else if (
      text.includes("decreased") ||
      text.includes("-") ||
      text.includes("decrease")
    ) {
      return -10;
    } else {
      return 0;
    }
  };
  return (
    <div className={styles.main}>
      <Header
        openSettings={openSettings}
        setOpenSettings={setOpenSettings}
        love={love}
        power={power}
        wealth={wealth}
        kingdomName={kingdom.name}
      />
      <div className={styles.contextContainer}>
        {context.map((c, i) => (
          <Bubble i={i}>{c}</Bubble>
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
      {openSettings && (
        <Modal
          isOpen={openSettings}
          onClose={() => setOpenSettings(false)}
          size="small"
        >
          <div className={styles.settings}>
            <div className={styles.setting}>
              <div className={styles.settingTitle}>NAI-Key</div>
              <Input
                value={key}
                onChange={handleApiKeyChange}
                handleEnter={handleEnter}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
