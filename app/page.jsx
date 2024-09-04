"use client";
import ChatInput from "@/components/custom/ChatInput";
import { useChat } from "ai/react";
import ReactMarkdown from "react-markdown";
import Card from "@/components/Card";
import ContactForm from "@/components/form/Form";
import { useState } from "react";
import Options from "@/components/options";

export default function Home() {
  const {messages, input, handleInputChange, handleSubmit } = useChat();
  const [showForm, setShowForm] = useState(true);
  const updatedMessages = [...messages].reverse();

  return (
    <div className="bg-white h-screen w-screen flex flex-col relative justify-end p-6">
      {/* The container for the messages */}
      <div className="flex-1 w-full overflow-y-scroll flex flex-col-reverse no-scrollbar">
        {updatedMessages.map((ele) => {
          return ele.role === "assistant" ? (
            <div key={ele.id} className="bg-white w-1/2 p-4 rounded-md my-4">
              <div> 
                <img src="app\openlogo.png" alt="img"></img>
              </div>
              {ele.content.length > 0 ? 
              (
                <div>
                  <ReactMarkdown>{ele.content}</ReactMarkdown>
                </div>
              ) : showForm ? 
              (
                <ContactForm setShowForm={setShowForm} />
              ) 
              : !showForm && ele?.toolInvocations?.[0]?.result?.component === "text" ? 
              (
                <div>
                  <ReactMarkdown>{ele.toolInvocations[0].result.res}</ReactMarkdown>
                </div>
              ) 
              : !showForm && ele?.toolInvocations?.[0]?.result?.component === "card" ? 
              (
                <div className="grid grid-cols-2 gap-2">
                  {ele?.toolInvocations?.[0]?.result?.res.map((property) => (
                    <Card
                      key={property.slug} // It's good practice to add a key prop when rendering a list of components
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
              ) 
              : !showForm && ele?.toolInvocations?.[0]?.result?.component === "option"?
              (
                <div className="flex flex-col space-y-4">
                  {ele.toolInvocations?.[0]?.result?.res.map((university,i)=>(
                    <Options key={i} name={university.name} messages={updatedMessages} lat={university.lat} lng={university.lng} />
                  ))}
                </div>
              )
              : null}
            </div>
          ) : 
          // USER
          (
            <div
              key={ele.id}
              className="bg-gray-200 w-1/4 p-3 rounded-md my-4 self-end"
            >
              <ReactMarkdown>{ele.content}</ReactMarkdown>
            </div>
          );
        })}
      </div>

      {/* The input area */}
      <div className="flex justify-center">
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
