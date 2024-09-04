"use client";
import { Input } from "@/components/ui/input";
import { SendIcon } from "lucide-react";

const ChatInput = ({ placeholder, handleSubmit, handleInputChange, input }) => {
  return (
    <form onSubmit={handleSubmit} className="w-1/2 relative">
      <Input
        onChange={handleInputChange}
        value={input}
        placeholder={placeholder}
        className="py-3"
      />
      <button className="absolute top-2 right-4">
        <SendIcon className="text-black cursor-pointer" />
      </button>
    </form>
  );
};

export default ChatInput;
