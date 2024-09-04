import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { prompt } from "./Promt";
export const findRelevantProperties = async (lastMessage) => {
  const query = await generateText({
    model: google("models/gemini-1.5-flash-latest"),
    prompt: prompt(lastMessage),
  });

  if (!query.text) {
    return;
  }

  let cleanedString = query.text.replace(/```json\n/g, "").replace(/```/g, "");

  // Remove any leading or trailing whitespace
  return cleanedString.trim();
};
