import axios from "axios";

export default function generate(context, parameters, key) {
  return axios
    .post(
      "api/generate",
      {
        context,
        key,
        gens: 1,
        model: "kayra-v1",
        //   parameters,
      },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      return res.data.results;
    });
}
