import { google } from "@ai-sdk/google";
import { z } from "zod";
import { convertToCoreMessages, streamText, tool } from "ai";
import { findRelevantProperties } from "@/app/utils/FindProperties";
import { getPropertiesModel } from "@/app/utils/schema";
import { connectDB } from "@/app/utils/DB";
import { findRelevantDescription, findRelevantPrice, findRelevantProcedure , findRelevantUniversities} from "@/app/utils/Tools";

// Allow streaming responses up to 30 seconds

export const maxDuration = 30;

export async function POST(req) {
  const { messages } = await req.json();

  messages.forEach((message) => {
    if (message.role === "user") return;

    if (!message.content && message.toolInvocations) {
      // console.log("XXXXXXXX",message.toolInvocations[0].result);
      if( message.toolInvocations[0].result.component ==='text')
        {
          message.content = message?.toolInvocations?.[0]?.result.res;
        }
      if(message.toolInvocations[0].result.component ==="card"){
        message.content="Here are some list of properties as per your requirement ";
      }
      if(message.toolInvocations[0].result.component ==='option'){
        message.content="Here are some options of universities as per you requirement"
      }
      delete message.toolInvocations;
    }
  });

  const result = await streamText({
    model: google("models/gemini-1.5-flash-latest"),
    system: `You are an intelligent chatbot ULBOT your task is to help users to find properties 
    as per their mentioned requirements. You must rely getProperties tool for this information. 
    Do not answer them by saying that you do not know information about properties you must use 
    tools to fecth the properties. 
    
    You may aslo be asked the description, price or booking procedure of the properties,
    for this you must rely on tools getPropertyDescription or getPropertyProcedure or getPropertyPrice tools to fetch 
    this information. You may be provided with information regarding many properties but you must stay focused on
    the name of the property provided to you and answer only that information asked to you by th user. Do not reply
    with much additional information of other properties.
    
    you must stick to the instructions provided to you.`,
    messages: convertToCoreMessages(messages),
    tools: {
      // MONGODB_FETCH
      getProperties: tool({
        description:
          "Help user find properties as per their requirements",
        parameters: z.object({
          message: z.string().describe("the entire prompt entered by the user"),
        }),
        execute: async ({ message }) => {
          try {
            const query = await findRelevantProperties(message);
            console.log(query);
            if (!query) {
              throw new Error("can not create query");
            }
            await connectDB();
            const Property = await getPropertiesModel();
            const response = await Property.aggregate([
              ...eval(query),
              { $limit: 5 },
            ]);
            // console.log(response);
            
            if(response.length===0)
            {
              return {
                component:'text',
                res: "No properties found as per your requirements",
              };
            }
            else{
              return {
                component:'card',
                res:response,
              }
            }
          } catch (error) {
            console.log(error);
          }
        },
      }),


      //PRICE
      getPropertyPrice: tool({
        description:
          "Help student find the price of the property they are searching for",
        parameters: z.object({
          propertyName: z
            .string()
            .describe("The name of the property user is searching about"),
        }),
        execute: async ({ propertyName }) => {
          try {
            const response=await findRelevantPrice(propertyName);
            return {
              component:'text',
              res:response,
            };
          } catch (error) {
            return "some this went wrong please try again";
          }
        },
      }),


      //DESCRIPTION
      getPropertyDescription: tool({
        description:
          "Help student find the description of the property they are searching for",
        parameters: z.object({
          propertyName: z
            .string()
            .describe("The name of the property user is searching about"),
        }),
        execute: async ({ propertyName }) => {
          try {
            const response=await findRelevantDescription(propertyName);
            return {
              res:response,
              component:'text'
            };
          } catch (error) {
            return "some this went wrong please try again";
          }
        },
      }),


      //BOKKING PROCEDURE
      getPropertyProcedure: tool({
        description:
          "Help student find the booking procedure of the property they are searching for",
        parameters: z.object({
          propertyName: z
            .string()
            .describe("The name of the property user is searching about"),
        }),
        execute: async ({ propertyName }) => {
          try {
            const response= await findRelevantProcedure(propertyName);
            return {
              component:'text',
              res:response,
            };
          } catch (error) {
            return "some this went wrong please try again";
          }
        },
      }),

      //UNIVERSITIES
      getUniversities: tool({
        description:
          "help user find the universities they are looking for in different location",
        parameters: z.object({
          universityName: z.string().describe("entire prompt by the user"),
        }),
        execute: async ({ universityName }) => {
          try {
               const response=await findRelevantUniversities(universityName);
               const ans=JSON.parse(response);
              // console.log(response)
               if(typeof response==='string'){
                console.log(response);
                console.log("STRINGGGGGGGGGGGGG")
               }
               else{
                console.log("is not a string");
               }
               return {
                component:'option',
                res:ans,
              };
            } catch (error) {
              return "something went wrong please try again";
            }        
           
        },
      }),

    },
    onFinish: ({ toolCalls, toolResults }) => {
      console.log(toolCalls, "<-===========================calls");
      console.log(toolResults, "<===============results");
    },
  });

  return result.toDataStreamResponse();
}
