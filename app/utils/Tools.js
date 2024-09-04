import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { Pinecone } from "@pinecone-database/pinecone";
import { generateEmbeddings } from "./CreateEmbeddings";
const pc = new Pinecone();
const indexName = "ulragbot";
const index = pc.index(indexName);

//DESCRIPTION
export const findRelevantDescription = async (val) => {
  console.log("entered");
  val = val.toLowerCase();
  console.log(val);
  const embeddings = await generateEmbeddings(`description:${val}`);
  const response = await index.namespace("description").query({
    vector: embeddings,
    topK: 10,
    includeMetadata: true,
  });
  console.log(response);
  const matches = response.matches.map((match) => {
    return {
      property_name: match.metadata.property_name || "",
      text: match.metadata.text || "", // Assuming 'text' is the key for content
      similarity: match.score || 0, // Assuming 'score' is the similarity score
      country: match.metadata.country || "",
      city: match.metadata.city || "",
      displayPrice: match.metadata.displayPrice || "",
      whatWeLove: match.metadata.whatWeLove || "",
      address: match.metadata.address || "",
    };
  });
  const matchesAsString = matches
    .map(
      (match) =>
        `Name: ${match.property_name}, text:${match.text}, Similarity: ${match.similarity}, Country: ${match.country}, City: ${match.city}, Price: ${match.displayPrice}, WhatWeLove: ${match.whatWeLove}, description: ${match.description},address: ${match.address}`
    )
    .join("\n");
  console.log(matchesAsString);
  const ans = await generateText({
    model: google("models/gemini-1.5-flash-latest"),
    system: `You are provided information about a particular property ${val}.Present it in a user readible format and remove all the fields which you think are unnecessary and return the output in string format.
    You may be given information about many other properties but you stick to the name of the property provided and drop other properties information`,
    prompt: `here is the information about the property:
            ${matchesAsString}`,
  });
  console.log("---------------------------------------------> LLM -2");
  console.log(ans);
  return ans.text;
  // return matchesAsString;
};

//PRICE
export const findRelevantPrice = async (val) => {
  console.log("entered");
  val = val.toLowerCase();
  console.log(val);
  const embeddings = await generateEmbeddings(`price:${val}`);
  const response = await index.namespace("price").query({
    vector: embeddings,
    topK: 5,
    includeMetadata: true,
  });
  console.log(response.matches);
  const matches = response.matches.map((match) => {
    return {
      property_name: match.metadata.property_name || "",
      displayPrice: match.metadata.displayPrice || "", // Assuming 'text' is the key for content
      similarity: match.score || 0, // Assuming 'score' is the similarity score
      country: match.metadata.country || "",
      city: match.metadata.city || "",
      rating: match.metadata.rating || "",
    };
  });
  const matchesAsString = matches
    .map(
      (match) =>
        `Name: ${match.property_name}, minPrice:${match.displayPrice}, Similarity: ${match.similarity}, Country: ${match.country}, City: ${match.city}, Rating: ${match.rating}`
    )
    .join("\n");
  console.log(matchesAsString);
  const ans = await generateText({
    model: google("models/gemini-1.5-flash-latest"),
    system: `You are provided information about a particular property ${val}.Present it's price in a user readible format and remove all the fields which you think are unnecessary and return the output in string format. You can be provided with data of other properties but stick to the property given and filter out the rest`,
    prompt: `here is the information about the property:
            ${matchesAsString}`,
  });
  console.log("---------------------------------------------> LLM -2");
  console.log(ans);
  return ans.text;
  // return matchesAsString;
};

// PROCEDURE
export const findRelevantProcedure = async (val) => {
  console.log("entered");
  val = val.toLowerCase();
  console.log(val);
  const embeddings = await generateEmbeddings(`bookingprocedure:${val}`);
  const response = await index.namespace("bookingprocedure").query({
    vector: embeddings,
    topK: 5,
    includeMetadata: true,
  });
  console.log(response);
  const matches = response.matches.map((match) => {
    return {
      property_name: match.metadata.property_name || "",
      bookingProcedure: match.metadata.bookingProcedure || "", // Assuming 'text' is the key for content
      similarity: match.score || 0, // Assuming 'score' is the similarity score
      country: match.metadata.country || "",
      city: match.metadata.city || "",
      address: match.metadata.address || "",
      text: match.metadata.text || "",
    };
  });
  const matchesAsString = matches
    .map(
      (match) =>
        `Name: ${match.property_name}, bookingProcedure:${match.bookingProcedure}, Similarity: ${match.similarity}, Country: ${match.country}, City: ${match.city}, Address: ${match.address}, Text: ${match.text}`
    )
    .join("\n");
  console.log(matchesAsString);
  const ans = await generateText({
    model: google("models/gemini-1.5-flash-latest"),
    system: `You are provided information about a particular property ${val}.Present it's booking procedure in a user readable format and remove all the fields which you think are unnecessary and return the output in string format. you may be given the procedure of many properties but stick the the property provided to you`,
    prompt: `here is the information about the property:
            ${matchesAsString}`,
  });
  console.log("---------------------------------------------> LLM -2");
  console.log(ans);
  return ans.text;
  // return matchesAsString;
};

//Universities
export const findRelevantUniversities = async (val) => {
  console.log("entered");

  const embeddings = await generateEmbeddings(val);
  console.log(embeddings);
  const response = await index.namespace("Universities").query({
    vector: embeddings,
    topK: 10,
    includeMetadata: true,
  });
  const matches = response.matches.map((match) => {
    console.log(match);
    return {
      university_name: match.metadata.university_name || "",
      lat: match.metadata.lat || "",
      similarity: match.score || 0, // Assuming 'score' is the key for similarity
      country: match.metadata.country || "",
      city: match.metadata.city || "",
      lng: match.metadata.lng || "",
    };
  });
  const matchesAsString = matches
    .map(
      (match) =>
        `Name: ${match.university_name}, lat:${match.lat}, Similarity: ${match.similarity}, Country: ${match.country}, City: ${match.city}, lng: ${match.lng}`
    )
    .join("\n");
  console.log(matchesAsString);
  const ans = await generateText({
    model: google("models/gemini-1.5-flash-latest"),
    system: `You are provided with some data about universities. You may be provided with location or universitiy. The informatio
    provided to you may be different campuses of universities you should return data jata in a json format which should contain 
    name, lat,lng,country,city of the universitites and return the values. This should not contain any additional characters. 
    You must stick to this information. if the name of university has other then dont output that university in you answer json
    . You must show the universities which have lat and lng.

    here is an example:
    Question: universities near United States.
    Answer:[
            {"name": "simon fraser university - burnaby", "lat": 49.2770626, "lng": -122.9161002, "country": "canada", "city": "burnaby"},
            {"name": "recording arts canada (rac toronto)", "lat": 43.6480963, "lng": -79.3925484, "country": "canada", "city": "toronto"},
            {"name": "graduate school of management", "lat": 38.5347704, "lng": -121.7473888, "country": "united states", "city": "davis (california)"},
            ]
    `,

    prompt: `here is the information about the universities:
            ${matchesAsString}`,
  });
  console.log("---------------------------------------------> LLM -2");
  console.log(ans);
  let cleanedString = ans.text.replace(/```json\n/g, "").replace(/```/g, "");
  return cleanedString.trim();
  
};
//ROOMS
// export const findRelevantRooms = async (val) => {
//   console.log("entered");
//   val = val.toLowerCase();
//   console.log(val);
//   const embeddings = await generateEmbeddings(val);
//   const response = await index.namespace("rooms").query({
//     vector: embeddings,
//     filter: { property_name: { $eq: val } },
//     topK: 2,
//     includeMetadata: true,
//   });
//   console.log(response);
//   const matches = response.matches.map((match) => {
//     return {
//       name: match.metadata.property_name || "",
//       text: match.metadata.text || "", // Assuming 'text' is the key for content
//       similarity: match.score || 0, // Assuming 'score' is the similarity score
//       country: match.metadata.country || "",
//       city: match.metadata.city || "",
//       category: match.metadata.category || "",
//     };
//   });
//   const matchesAsString = matches
//     .map(
//       (match) =>
//         `Name: ${match.property_name}, text:${match.text}, Similarity: ${match.similarity}, Country: ${match.country}, City: ${match.city}, category:${match.category}`
//     )
//     .join("\n");
//   console.log(matchesAsString);
//   const ans = await generateText({
//     model: google("models/gemini-1.5-flash-latest"),
//     system: `You are provided information about a particular property ${val}.Present it's category and information about its rooms and amenities in a user readable format and remove all the fields which you think are unnecessary and return the output in string format`,
//     prompt: `here is the information about the property:
//             ${matchesAsString}`,
//   });
//   console.log("---------------------------------------------> LLM -2");
//   console.log(ans);
//   return ans.text;
// };

//OFFERS
// export const findRelevantOffers = async (val) => {
//   console.log("entered");
//   val = val.toLowerCase();
//   console.log(val);
//   const embeddings = await generateEmbeddings(val);
//   const response = await index.namespace("offers").query({
//     vector: embeddings,
//     filter: { property_name: { $eq: val } },
//     topK: 1,
//     includeMetadata: true,
//   });
//   console.log(response);
//   const matches = response.matches.map((match) => {
//     return {
//       text: match.metadata.text || "",
//     };
//   });
//   const matchesAsString = matches
//     .map((match) => `text:${match.text}`)
//     .join("\n");
//   console.log(matchesAsString);
//   const ans = await generateText({
//     model: google("models/gemini-1.5-flash-latest"),
//     system: `You are provided information about a particular property ${val}.Present it's offers in a readable format and remove all the fields which you think are unnecessary and return the output in string format. If you recieve nothing just ouput that there are no offers related to this property`,
//     prompt: `here is the information about the property:
//             ${matchesAsString}`,
//   });
//   console.log("---------------------------------------------> LLM -2");
//   console.log(ans);
//   return ans.text;
// };
