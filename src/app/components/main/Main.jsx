"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./Main.module.css";
import Header from "./Header";
import Input from "../UI/Input";
import buildContext from "@/utils/front/buildContext";
import mykingdom from "@/utils/contexts/mykingdomcontext";
import generate from "@/utils/front/generate";
import Button from "../UI/Button";
import Bubble from "../UI/Bubble";
import Modal from "../UI/Modal";
import PopUP from "../UI/PopUp";
export default function Main() {
  const [loading, setLoading] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const [popUpText, setPopUpText] = useState("");
  const [popUpTitle, setPopUpTitle] = useState("");
  const [key, setKey] = useState("");
  const [love, setLove] = useState(50);
  const [power, setPower] = useState(50);
  const [wealth, setWealth] = useState(50);
  const [context, setContext] = useState([
    `***
Year 0
Your father died, leaving his kingdom to you. What will you do?`,
  ]);
  const [input, setInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [year, setYear] = useState(0);
  const [choice, setChoice] = useState(true);
  const [openKingdom, setOpenKingdom] = useState(false);
  const [openRuler, setOpenRuler] = useState(false);
  const [mykingdomcontext, setMykingdomcontext] = useState("");
  const scrollRef = useRef(null);
  const [kingdom, setKingdom] = useState({
    name: "Greenland",
    race: "Human",
    system: "Monarchy",
  });
  const [ruler, setRuler] = useState({
    name: "SGreen the Second",
    title: "King",
    race: "Human",
  });
  useEffect(() => {
    setMykingdomcontext(`> NEW GAME
***
[ Title: My Kingdom; Tags: game; ]
----
Love
Status: ${getValuetext(love)}, ${love} out of 100
Description: How much your kingdom loves you! Highly correlated with approval, love is a base for loyalty and duty. You earn love by being fair, kind, and charming.
----
Power
Status: ${getValuetext(power)}, ${power} out of 100
Description: Power is the strength of your kingdom. Power gets stronger by getting resources, like army units, but it gets smaller with your loses.
----
Wealth
Status: ${getValuetext(wealth)}, ${wealth} out of 100
Description: The assets in your coffers, how much gold is available for you to spend. The higher the wealth, the better paid are your army and workers, and the more noble they view you to be.
----
Kingdom
Name: ${kingdom.name}
Population: ${kingdom.race}
System: ${kingdom.system}
[ Love: ${getValuetext(love)}; Power: ${getValuetext(
      power
    )}; Wealth: ${getValuetext(wealth)} ]
----
You (Ruler)
Name: ${ruler.name}`);
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
      [...context],
      8000,
      mykingdomcontext
    ).then((res) => {
      generate(res + `***\nYear ${year}\n`, {}, key)
        .then((res2) => {
          console.log(res2);
          let text = res2[0].replace("\n>", "");
          if (text.includes("\n***")) {
            text = text.split("\n***")[0];
          }
          // remove "\n> " from the end
          setContext([...context, `***\nYear ${year}\n${text}`]);
          setGenerating(false);
        })
        .catch((err) => {
          console.log(err);
          setChoice(false);
          setPopUp(true);
          setPopUpTitle("Error");
          setPopUpText("Something went wrong. Please check your API key.");
          setGenerating(false);
        });
    });
  }
  function afterChoice() {
    setContext([...context, `> ${input}`]);
    setGenerating(true);
    setChoice(false);
    buildContext(
      mykingdom.start,
      mykingdom.context,
      [...context],
      8000,
      mykingdomcontext
    ).then((res) => {
      setInput("");
      let contextText = res + `> ${input}\n`;
      generate(res + `> ${input}\n`, {}, key)
        .then((res2) => {
          console.log(res2);
          let text = res2[0].replace("\n***", "");
          if (text.includes("\n>")) {
            text = text.split("\n>")[0];
          }
          if (findStats(text)) {
            setContext([...context, `> ${input}`, text]);
            setGenerating(false);
            setYear(year + 1);
          } else {
            console.log("Stats not found");
            // remove "[ " " ]" and anything in between
            text = text.replace(/\[.*?\]/g, "");
            text.trim();
            generate(contextText + text + "\n[ Love:", {}, key)
              .then((res3) => {
                let findings = res3[0].replace("\n***", "");
                if (findings.includes("\n>")) {
                  findings = findings.split("\n>")[0];
                }
                findStats("Love:" + findings);
                setContext([
                  ...context,
                  `> ${input}`,
                  text + "\n[ Love:" + findings,
                ]);
                setGenerating(false);
                setYear(year + 1);
              })
              .catch((err) => {
                console.log(err);
                setPopUp(true);
                setPopUpTitle("Error");
                setPopUpText(
                  "Something went wrong. Please check your API key."
                );
                setGenerating(false);
                setChoice(true);
                setInput(input);
              });
          }
        })
        .catch((err) => {
          console.log(err);
          setPopUp(true);
          setPopUpTitle("Error");
          setPopUpText("Something went wrong. Please check your API key.");
          setGenerating(false);
          setChoice(true);
          setInput(input);
          // remove the last line
          setContext(context);
        });
    });
  }
  function findStats(text) {
    let found = false;
    // points logic. There might be "Love: XXX;" or "Love: ]" check for both
    let loveText = text.split("Love: ")[1];
    let powerText = text.split("Power: ")[1];
    let wealthText = text.split("Wealth: ")[1];
    if (loveText) {
      loveText.includes(";")
        ? (loveText = loveText.split(";")[0])
        : loveText.split(" ]")[0];
      const loveValue = getValue(loveText);
      loveValue !== 0 && (found = true);
      setLove(love + loveValue);
    }
    if (powerText) {
      powerText.includes(";")
        ? (powerText = powerText.split(";")[0])
        : powerText.split(" ]")[0];
      const powerValue = getValue(powerText);
      powerValue !== 0 && (found = true);
      setPower(power + powerValue);
    }
    if (wealthText) {
      wealthText.includes(";")
        ? (wealthText = wealthText.split(";")[0])
        : wealthText.split(" ]")[0];
      const wealthValue = getValue(wealthText);
      wealthValue !== 0 && (found = true);
      setWealth(wealth + wealthValue);
    }
    console.log(loveText, powerText, wealthText, found);
    return found;
  }
  useEffect(() => {
    if (love <= 0 || power <= 0 || wealth <= 0) {
      setPopUp(true);
      setPopUpTitle("Game Over");
      setPopUpText("You lost the game!");
      setLove(50);
      setPower(50);
      setWealth(50);
    } else if (love >= 100 && power >= 100 && wealth >= 100) {
      setPopUp(true);
      setPopUpTitle("Congratulations!");
      setPopUpText("You won the game!");
      setLove(50);
      setPower(50);
      setWealth(50);
    }
  }, [love, power, wealth]);
  useEffect(() => {
    if (!choice && !generating && !wentBack) {
      send();
    }
  }, [choice, generating]);
  function send() {
    if (generating) return;
    setWentBack(false);
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
  useEffect(() => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [context]);
  const getValue = (text) => {
    console.log(text);
    if (
      text.includes("increased greatly") ||
      text.includes("increase greatly") ||
      text.includes("greatly increased") ||
      text.includes("greatly increase") ||
      text.includes("greatly raised") ||
      text.includes("greatly raising") ||
      text.includes("greatly raise") ||
      text.includes("extreme")
    ) {
      return 20;
    } else if (
      text.includes("increased") ||
      text.includes("+") ||
      text.includes("increase") ||
      text.includes("increasing") ||
      text.includes("raised") ||
      text.includes("raising") ||
      text.includes("raise") ||
      text.includes("higher") ||
      text.includes("up") ||
      text.includes("upped") ||
      text.includes("upping") ||
      text.includes("more")
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
      text.includes("decrease") ||
      text.includes("decreasing") ||
      text.includes("reduced") ||
      text.includes("reducing") ||
      text.includes("reduction") ||
      text.includes("back") ||
      text.includes("lower") ||
      text.includes("lowered") ||
      text.includes("lowering") ||
      text.includes("less") ||
      text.includes("lessen") ||
      text.includes("lessened") ||
      text.includes("lessening") ||
      text.includes("down") ||
      text.includes("downed")
    ) {
      return -10;
    } else {
      return 0;
    }
  };
  const getValuetext = (value) => {
    if (value < 20) {
      return "very low";
    } else if (value < 40) {
      return "low";
    } else if (value < 60) {
      return "neutral";
    } else if (value < 80) {
      return "high";
    } else {
      return "very high";
    }
  };
  useEffect(() => {
    if (localStorage.getItem("MKkingdom")) {
      setKingdom(JSON.parse(localStorage.getItem("MKkingdom")));
      setLoading(false);
    }
    if (localStorage.getItem("MKruler")) {
      setRuler(JSON.parse(localStorage.getItem("MKruler")));
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("MKkingdom", JSON.stringify(kingdom));
    }
  }, [kingdom]);
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("MKruler", JSON.stringify(ruler));
    }
  }, [ruler]);
  const [states, setStates] = useState([
    {
      love: 50,
      power: 50,
      wealth: 50,
      year: 0,
      choice: true,
    },
  ]);
  useEffect(() => {
    setStates([
      ...states,
      {
        love: love,
        power: power,
        wealth: wealth,
        year: year,
        choice: choice,
      },
    ]);
  }, [year]);
  const [wentBack, setWentBack] = useState(false);
  function goBack(i) {
    if (generating || i === 0) return;
    setWentBack(true);
    const newContext = context.slice(0, i);
    setContext(newContext);
    console.log(states);
    setLove(states[i].love);
    setPower(states[i].power);
    setWealth(states[i].wealth);
    setYear(states[i].year);
    setChoice(states[i].choice);
    const newStates = states.slice(0, i + 1);
    setStates(newStates);
  }

  return (
    <div className={styles.main}>
      <Header
        openSettings={openSettings}
        setOpenSettings={setOpenSettings}
        love={love}
        power={power}
        wealth={wealth}
        kingdomName={kingdom.name}
        openKingdom={setOpenKingdom}
        openRuler={setOpenRuler}
      />
      <div className={styles.contextContainer}>
        {context.map((c, i) => (
          <Bubble i={i} key={i} deleteBubble={goBack}>
            {c}
          </Bubble>
        ))}
        <div ref={scrollRef}></div>
      </div>
      <div className={styles.inputArea}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          handleEnter={handleEnter}
        />
        <Button onClick={() => send()}>RULE</Button>
      </div>
      {openSettings && (
        <Modal
          isOpen={openSettings}
          onClose={() => setOpenSettings(false)}
          size="small"
          title="Settings"
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
      {popUp && (
        <PopUP
          title={popUpTitle}
          text={popUpText}
          i={0}
          open={popUp}
          setOpen={setPopUp}
        ></PopUP>
      )}
      {openKingdom && (
        <Modal
          isOpen={openKingdom}
          onClose={() => setOpenKingdom(false)}
          title="Kingdom"
        >
          <div className={styles.settings}>
            <div className={styles.setting}>
              <div className={styles.settingTitle}>Name</div>
              <Input
                value={kingdom.name}
                onChange={(e) =>
                  setKingdom({ ...kingdom, name: e.target.value })
                }
              />
            </div>
            <div className={styles.setting}>
              <div className={styles.settingTitle}>Race</div>
              <Input
                value={kingdom.race}
                onChange={(e) =>
                  setKingdom({ ...kingdom, race: e.target.value })
                }
              />
            </div>
            <div className={styles.setting}>
              <div className={styles.settingTitle}>System</div>
              <Input
                value={kingdom.system}
                onChange={(e) =>
                  setKingdom({ ...kingdom, system: e.target.value })
                }
              />
            </div>
          </div>
        </Modal>
      )}
      {openRuler && (
        <Modal
          isOpen={openRuler}
          onClose={() => setOpenRuler(false)}
          title="Ruler"
        >
          <div className={styles.settings}>
            <div className={styles.setting}>
              <div className={styles.settingTitle}>Name</div>
              <Input
                value={ruler.name}
                onChange={(e) => setRuler({ ...ruler, name: e.target.value })}
              />
            </div>
            <div className={styles.setting}>
              <div className={styles.settingTitle}>Title</div>
              <Input
                value={ruler.title}
                onChange={(e) => setRuler({ ...ruler, title: e.target.value })}
              />
            </div>
            <div className={styles.setting}>
              <div className={styles.settingTitle}>Race</div>
              <Input
                value={ruler.race}
                onChange={(e) => setRuler({ ...ruler, race: e.target.value })}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
