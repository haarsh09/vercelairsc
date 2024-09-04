import Image from "next/image";
import Link from "next/link";
import React from "react";
import Markdown from "react-markdown";

const GetChat = ({ messages }) => {
  return messages.map((message) => {
    return message.role === "assistant" ? (
      <AiResponse message={message} />
    ) : (
      <UserResponse message={message} />
    );
  });
};

export default GetChat;

const AiResponse = ({ message }) => {
  const isProperties = message.toolInvocations?.[0]?.result?.isProperties;

  if (isProperties) {
    return (
      <div className="bg-white my-4 rounded-md p-4">
        <p className="font-bold text-xl">
          The top 5 properties based on your search are shown here.
        </p>
        <PropertyCard
          properties={message.toolInvocations?.[0]?.result?.properties}
        />
      </div>
    );
  }

  return (
    <div key={message.id} className="bg-blue-200 w-1/2 p-4 rounded-md my-4">
      <Markdown>
        {message.content || message.toolInvocations?.[0]?.result}
      </Markdown>
    </div>
  );
};

const UserResponse = ({ message }) => (
  <div
    key={message.id}
    className="bg-green-200 w-1/2 p-4 rounded-md my-4 self-end"
  >
    <Markdown>{message.content || message.content.isProperties}</Markdown>
  </div>
);

const PropertyCard = ({ properties }) => (
  <div className="my-4 flex flex-row items-center justify-between space-x-4">
    {properties?.map((property) => (
      <Link
        className="w-1/5 bg-gray-200 rounded-md"
        target="_blank"
        href={`https://www.universityliving.com/${property.countrySlug}/${property.citySlug}/property/${property.slug}`}
      >
        <div className="rounded-md overflow-hidden w-full h-52 relative">
          <Image src={property.media?.[0].url} fill />
        </div>
        <div className="p-2">
          <p className="font-bold mt-2">{property.name}</p>
          <p className="text-xs mb-4">
            {property.city}, {property.country}
          </p>
          <p className="text-xs">Starting at</p>
          <p className="font-bold text-lg">{property.displayPrice}</p>
        </div>
      </Link>
    ))}
  </div>
);







"use client";
import ChatInput from "@/components/custom/ChatInput";
import { useChat } from "ai/react";
import ReactMarkdown from "react-markdown";
import Card from "@/components/Card";
import ContactForm from "@/components/form/Form";
import { useState } from "react";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [showForm, setShowForm] = useState(true);

  const updatedMessages = [...messages].reverse();

  // Function to handle form submission and hide the form afterward
  const handleFormSubmit = (code) => {
    // Process the code, then hide the form
    console.log(`Form submitted with code: ${code}`);
    setShowForm(false);
  };

  return (
    <div className="bg-gray-900 h-screen w-screen flex flex-col relative justify-end p-6">
      {/* The container for the messages */}
      <div className="flex-1 w-full overflow-y-scroll flex flex-col-reverse no-scrollbar">
        {updatedMessages.map((ele) => {
          return ele.role === "assistant" ? (
            <div key={ele.id} className="bg-blue-200 w-1/2 p-4 rounded-md my-4">
              {/* Insert ContactForm if showForm is true and this is the first message */}
              {showForm && ele.id === 1 && (
                <ContactForm onSubmit={handleFormSubmit} />
              )}
              {ele.content.length > 0 ? (
                <ReactMarkdown>{ele.content}</ReactMarkdown>
              ) : typeof ele?.toolInvocations?.[0]?.result === "string" ? (
                <ReactMarkdown>{ele?.toolInvocations?.[0]?.result}</ReactMarkdown>
              ) : (
                ele?.toolInvocations?.[0]?.result?.map((property) => (
                  <Card
                    key={property.id}
                    name={property.name}
                    address={property.address}
                    imgSrc={property.thumbnail.url}
                    price={property.displayPrice}
                  />
                ))
              )}
            </div>
          ) : (
            <div
              key={ele.id}
              className="bg-green-200 w-1/2 p-4 rounded-md my-4 self-end"
            >
              <ReactMarkdown>{ele.content}</ReactMarkdown>
            </div>
          );
        })}
      </div>

      {/* The input area */}
      <div className="w-full flex items-center space-x-4 mt-4">
        <ChatInput
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          input={input}
          placeholder={"Please enter your prompt"}
        />
      </div>
    </div>
  );
}





ele.content.length > 0 ? (
  <ReactMarkdown>{ele.content}</ReactMarkdown>
) : (
  // Conditionally render based on the result component type
  ele?.toolInvocations?.[0]?.result?.component === "text" ? (
    <div>
      <ReactMarkdown>{ele?.toolInvocations?.[0]?.result?.res}</ReactMarkdown>
    </div>
  ) : (
    <div>
      {showForm ? (
        <ContactForm setShowForm={setShowForm} />
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {ele?.toolInvocations?.[0]?.result?.res?.map((property) => (
            <Card
              // key={property.slug} // It's good practice to add a key prop when rendering a list of components
              name={property.name}
              address={property.address}
              imgSrc={property.thumbnail.url}
              price={property.displayPrice}
              countrySlug={property.countrySlug}
              citySlug={property.citySlug}
              slug={property.slug}
            />
          ))}
        </div>
      )}
    </div>
  )
)