import { NextResponse } from "next/server";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
const { Pinecone } = require("@pinecone-database/pinecone");
import { google } from "@ai-sdk/google";

export async function GET() {
  try {
    // const model = google('models/text-embedding-004');

    // const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

    // const text = "The quick brown fox jumps over the lazy dog.";

    // const result = await model.embedContent(text);
    // const embedding = result.embedding;
    // return NextResponse.json({ embedding });
    

    // Access your API key as an environment variable (see our Getting Started tutorial)
    const genAI = new GoogleGenerativeAI("AIzaSyDG4OxudnIwDS3OduKM9wkAm1YUpGZmMzA");

   
      // For embeddings, use the Text Embeddings model
      const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

      const text = "The quick brown fox jumps over the lazy dog.";

      const result = await model.embedContent(text);
      const embedding = result.embedding;
      console.log(embedding.values);
    
      return NextResponse.json({embedding});;
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

// async function upsertData() {
//   const indexName = 'ul-chatbot';
//   const index = pc.Index(indexName);

//   // Load JSON data
//   const filePath = path.join(__dirname, 'uniliving.cities.json');
//   const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

//   // Convert text data to vectors
//   const upserts = data.map(async (item) => {
//     const vector = await encode(item.text); // Convert text to vector
//     return { id: item.id, vector: vector };
//   });

//   try {
//     await index.upsert({ vectors: await Promise.all(upserts) });
//     console.log('Data upserted successfully');
//   } catch (error) {
//     console.error('Error upserting data:', error);
//   }
// }

// upsertData();
