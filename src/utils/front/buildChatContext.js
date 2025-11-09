// Build a chat-style message array for DeepSeek (or other OpenAI-style chat APIs)
// Transforms existing linear context + metadata into role-based messages.
// Export shape: Promise that resolves to { messages } array.
// We keep token trimming simple (no tokenizer available here) – rely on upstream length limits.

export default function buildChatContext(memory, top, bottom, addon, maxMessages = 40) {
  // memory: string (game start metadata)
  // top: array of canonical story examples (mykingdom.context)
  // bottom: array of dynamic context entries (player + model turns)
  // addon: dynamic status block (mykingdomcontext)
  const messages = [];

  // System prompt describes formatting rules so the model returns bracket stats.
  messages.push({
    role: "system",
    content:
      "You are the narrative engine of a kingdom management game. Continue the story based on the player's choice. Write a narrative response describing what happens, then end with a bracketed stat line in the exact format: [ Love: <phrase>; Power: <phrase>; Wealth: <phrase> ]. Use phrases like 'increased greatly', 'increased', 'decreased greatly', 'decreased', or 'neutral'. Never invent new categories. Do NOT include 'Year X' or '***' markers - the game handles that.",
  });

  // Provide memory/start (trim whitespace) as developer guidance.
  if (memory) {
    messages[0].content += `\n\nGame Context:\n${memory.trim()}`;
  }

  // Add addon (dynamic status snapshot) as system for grounding.
  if (addon) {
    messages[0].content += `\n\nStatus Snapshot:\n${addon.trim()}`;
  }

  // Add a small sample of canonical top examples to teach style (as assistant messages).
  top.slice(0, 3).forEach((block) => {
    messages.push({ role: "assistant", content: block.trim() });
  });

  // Convert bottom context conversation. Convention: lines starting with '> ' are player choices.
  // We'll merge sequential narrative lines until next choice to reduce message count.
  const merged = [];
  let accumulator = [];
  bottom.forEach((line) => {
    if (line.startsWith(">")) {
      if (accumulator.length) {
        merged.push(accumulator.join("\n"));
        accumulator = [];
      }
      merged.push(line); // keep choice separate
    } else {
      accumulator.push(line);
    }
  });
  if (accumulator.length) merged.push(accumulator.join("\n"));

  merged.forEach((segment) => {
    if (segment.startsWith(">")) {
      messages.push({ role: "user", content: segment.replace(/^>\s?/, "").trim() });
    } else {
      messages.push({ role: "assistant", content: segment.trim() });
    }
  });

  // Trim to last maxMessages preserving the leading system instructions.
  const systemCount = messages.filter((m) => m.role === "system").length;
  const nonSystem = messages.filter((m) => m.role !== "system");
  const trimmed = nonSystem.slice(-Math.max(0, maxMessages - systemCount));
  const finalMessages = messages.filter((m) => m.role === "system").concat(trimmed);

  return Promise.resolve(finalMessages);
}
