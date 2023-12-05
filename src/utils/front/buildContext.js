import { Encoder } from "nai-js-tokenizer";

// import tokenizerData from "../tokenizers/7nerdstash_tokenizer_v2.json";

export default function buildContext(memory, top, bottom, size) {
  //   let encoder = new Encoder(vocab, merges, specialTokens, config);
  return fetch("./tokenizers/nerdstash_tokenizer_v2.json")
    .then((response) => response.json())
    .then((data) => {
      let encoder = new Encoder(
        data.vocab,
        data.merges,
        data.specialTokens,
        data.config
      );
      let tokenSize = 0;
      let returnString = "";
      tokenSize += encoder.encode("memory").length;
      returnString += memory + "\n";
      top.forEach((e) => {
        if (tokenSize + encoder.encode(e).length > size / 2) return;
        tokenSize += encoder.encode(e).length;
        returnString += e + "\n";
      });
      let bottomString = "";
      bottom.forEach((e) => {
        if (tokenSize + encoder.encode(e).length > size) return;
        tokenSize += encoder.encode(e).length;
        bottomString = "\n" + e + bottomString;
      });
      returnString += bottomString;
      returnString = cleanString(returnString);
      console.log(returnString);
      return returnString;
    });
}

function cleanString(string) {
  // remove white spaces
  while (string.includes("\n\n")) {
    string = string.replace("\n\n", "\n");
  }
  string.replace(" \n", "\n");
  string.replace("\n ", "\n");
  while (string.includes("  ")) {
    string = string.replace("  ", " ");
  }
  // string = string.trim();

  return string;
}
