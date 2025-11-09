import axios from "axios";

export default function generateDeepseek(messages, key, model = "deepseek-chat", options = {}) {
  const { temperature = 0.8, max_tokens = 400 } = options;
  return axios
    .post(
      "api/deepseek",
      {
        messages,
        key,
        model,
        gens: 1,
        temperature,
        max_tokens,
      },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => res.data.results);
}
