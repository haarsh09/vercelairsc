import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { mistral } from "@ai-sdk/mistral";
import { cosineSimilarity, embed, embedMany, generateText } from "ai";

dotenv.config();

async function main() {
  const db= [];

  const essay = fs.readFileSync(path.join(__dirname, "essay.txt"), "utf8");
  const chunks = essay
    .split(".")
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0 && chunk !== "\n");

  const { embeddings } = await embedMany({
    model: mistral.embedding("mistral-embed"),
    values: chunks,
  });
  embeddings.forEach((e, i) => {
    db.push({
      embedding: e,
      value: chunks[i],
    });
  });

  const input =
    "What were the two main things the author worked on before college?";

  const { embedding } = await embed({
    model: mistral.embedding("mistral-embed"),
    value: input,
  });
  const context = db
    .map((item) => ({
      document: item,
      similarity: cosineSimilarity(embedding, item.embedding),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3)
    .map((r) => r.document.value)
    .join("\n");

  const { text } = await generateText({
    model: mistral("open-mixtral-8x7b"),
    prompt: `Answer the following question based only on the provided context:
             ${context}

             Question: ${input}`,
  });
  console.log(text);
}

main().catch(console.error);