import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  const req = await request.json();
  const messages = req.messages;
  const key = req.key;
  const model = req.model || "deepseek-chat";
  const gens = req.gens || 1;
  const temperature = req.temperature || 0.8;
  const max_tokens = req.max_tokens || 400;

  console.log("DeepSeek request:", { model, messageCount: messages.length });

  const results = [];

  for (let i = 0; i < gens; i++) {
    try {
      const response = await axios.post(
        "https://api.deepseek.com/v1/chat/completions",
        {
          model: model,
          messages: messages,
          temperature: temperature,
          max_tokens: max_tokens,
        },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
        }
      );
      
      const result = response.data.choices[0].message.content;
      results.push(result);
    } catch (err) {
      console.log("DeepSeek API error:", err.response?.data || err.message);
      return NextResponse.json({ 
        error: err.response?.data?.error?.message || err.message 
      }, { status: err.response?.status || 500 });
    }
  }

  return NextResponse.json({ results });
}
