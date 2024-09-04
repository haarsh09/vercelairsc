import { google } from "@ai-sdk/google";
import { z } from "zod";
import { convertToCoreMessages, streamText, tool } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  const { messages } = await req.json();

  messages.forEach((message) => {
    if (message.role === "user") return;

    if (!message.content && message.toolInvocations) {
      message.content = message?.toolInvocations?.[0]?.result;
      delete message.toolInvocations;
    }
  });

  const result = await streamText({
    model: google("models/gemini-1.5-flash-latest"),
    system:
      "You are an helpful ai assistant, your name is UL bot and you are here to help students going to study abroad find accommodation and help their queries related to accommodation woldwide",
    messages: convertToCoreMessages(messages),
    tools: {
      getPropertyDescription: tool({
        description:
          "help to find description related to a property and solve student queries related to basic info of properties",
        parameters: z.object({
          propertyName: z
            .string()
            .describe("The name of the property user is searching about"),
        }),
        execute: async ({ propertyName }) => {
          try {
            console.log(propertyName);
            return `here is data about ${propertyName}`;
          } catch (error) {
            return "some this went wrong please try again";
          }
        },
      }),

      getPropertyPrice: tool({
        description:
          "help to find price of property and solve student queries related to pricing of properties",
        parameters: z.object({
          propertyName: z
            .string()
            .describe("The name of the property user is searching about"),
        }),
        execute: async ({ propertyName }) => {
          try {
            console.log(propertyName);
            return `here is data about ${propertyName}`;
          } catch (error) {
            return "some this went wrong please try again";
          }
        },
      }),

      getPropertyBooking: tool({
        description:
          "help students in booking a property and solve student queries related to booking and booking procedure of properties",
        parameters: z.object({
          propertyName: z
            .string()
            .describe("The name of the property user is searching about"),
        }),
        execute: async ({ propertyName }) => {
          try {
            console.log(propertyName);
            return `here is data about ${propertyName}`;
          } catch (error) {
            return "some this went wrong please try again";
          }
        },
      }),

      getPropertyRooms: tool({
        description:
          "provide students with the room related data of a property and tell them all the info related to all of rooms in a selected property",
        parameters: z.object({
          propertyName: z
            .string()
            .describe("The name of the property user is searching about"),
        }),
        execute: async ({ propertyName }) => {
          try {
            console.log(propertyName);
            return `here is data about ${propertyName}`;
          } catch (error) {
            return "some this went wrong please try again";
          }
        },
      }),

      getPropertyAmenities: tool({
        description:
          "give the data about all the different amenities that are present in the property the student wants",
        parameters: z.object({
          propertyName: z
            .string()
            .describe("The name of the property user is searching about"),
        }),
        execute: async ({ propertyName }) => {
          try {
            console.log(propertyName);
            return `here is data about ${propertyName}`;
          } catch (error) {
            return "some this went wrong please try again";
          }
        },
      }),

      getPropertyOffers: tool({
        description:
          "provide students with all the offers that are present currently in the perticular property that the student wants",
        parameters: z.object({
          propertyName: z
            .string()
            .describe("The name of the property user is searching about"),
        }),
        execute: async ({ propertyName }) => {
          try {
            console.log(propertyName);
            return `here is data about ${propertyName}`;
          } catch (error) {
            return "some this went wrong please try again";
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