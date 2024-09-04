import React, { useState } from "react";

const ContactForm = ({ setShowForm,append }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // try {
    //   const response = await fetch('backendapi', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData),
    //   });

    //   if (response.ok) {
    //     setFormSubmitted(true);
    //   } else {
    //     console.error('Failed to submit the form');
    //   }
    // } catch (error) {
    //   console.error('Error:', error);
    // }
    try {
      console.log("submitted data to database");
      // const x=await append({role:"assistant",content:`Hello ${formData.name} How may I assist you today`});
      // console.log(x);
      setShowForm(false);
      setFormSubmitted(true);
    } catch (error) {
      console.log("couldn't submit the form");
      console.log("setShowForm failed");
    }
  };

  if (formSubmitted) {
    return <p>Thank you! Your information has been submitted.</p>;
  }

  return (
    <form className="bg-gray-200 w-1/2 rounded-md"onSubmit={handleSubmit}>
      <div className="p-2">
        <label>Name: </label>
        <input className="rounded-md"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="p-2 space-x-1">
        <label>Email: </label>
        <input className="rounded-md"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="p-2">
        <label>Phone:</label>
        <input className="rounded-md"
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      <button
        className="bg-gray-200 rounded text-center font-black"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default ContactForm;