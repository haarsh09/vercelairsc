// import { google } from "@ai-sdk/google";
// import { Pinecone } from "@pinecone-database/pinecone";
// import { generateText } from "ai";
// import { generateEmbeddings } from "./CreateEmbeddings";
// const pc = new Pinecone();
// const indexName = "ulragbot";
// const index = pc.index(indexName);

// export const createContext=async (namespace,topK,embeddings)=>{
//     const response = await index.namespace(namespace).query({
//         vector: embeddings,
//         topK: topK,
//         includeMetadata: true,
//       });
//       const matches = response.matches.map((match) => {
//         return {
//           property_name: match.metadata.property_name || "",
//           text: match.metadata.text || "", // Assuming 'text' is the key for content
//           similarity: match.score || 0, // Assuming 'score' is the similarity score
//           country: match.metadata.country || "",
//           city: match.metadata.city || "",
//           displayPrice: match.metadata.displayPrice || "",
//           whatWeLove:match.metadata.whatWeLove || "",
//           address: match.metadata.address || "",
//         };
//     })
// }.



//NOT IN USE