import { OllamaEmbeddings } from "@langchain/ollama";



//EMBEDDING
export const generateEmbeddings = async (val) => {
    val = val.toLowerCase();
    console.log(val);
    const text = val;
    const embeddings = new OllamaEmbeddings({
      model: "mxbai-embed-large", // Default value
      baseUrl: "http://localhost:11434", // Default value
    });
    const singleVector = await embeddings.embedQuery(text);
    console.log(singleVector);
    return singleVector;
  };