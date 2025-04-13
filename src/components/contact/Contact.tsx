import React from "react";
import "./Contact.css";
import emailjs from "emailjs-com";

interface ContactProps {
  id: string;
}
export const Contact: React.FC<ContactProps> = ({ id }) => {
  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_nbqu8z5",
        "template_rlu2k5c",
        e.currentTarget,
        "CPqj8tXgHxo2XUrio",
      ) 
      .then(
        (result) => {
          console.log("SUCCESS!", result.text);
          alert("Your message has been sent successfully!");
        },
        (error) => {
          console.log("FAILED...", error.text);
          alert("Failed to send message. Please try again later.");
        },
      );
    e.currentTarget.reset();
  };

  return (
    <>
      <div className="contact-container" id={id}>
        <h1 className="text">CONTACT ME</h1>
        <div className="contact-text">
          <p>
            I am available for freelance work. Connect with me via email or
            social media.
          </p>
          <code>Don't worry, the form works </code>
        </div>
        <div className="contact-content">
          <form onSubmit={sendEmail} className="contact-form">
            <label>Name</label>
            <input title="text" type="text" name="name" required />
            <label>Email</label>
            <input title="text" type="text" name="email" required />
            <label>Subject</label>
            <input title="text" type="text" name="subject" required />
            <label>Message</label>
            <textarea title="text" name="message" />
            <button title="submit" type="submit" value="Send">
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
