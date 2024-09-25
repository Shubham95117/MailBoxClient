import React, { useState } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./CreateMail.css";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const CreateEmail = () => {
  const navigate = useNavigate(); // Use useNavigate
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const handleSend = () => {
    const mailBody = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const mailData = {
      to,
      subject,
      body: mailBody,
      from: "your-email@example.com",
      date: new Date().toISOString(),
    };

    fetch("https://mailboxclient-a3f-default-rtdb.firebaseio.com/mails.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mailData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Mail sent successfully:", data);
        navigate("/"); // Navigate back to EmailPage after sending
      })
      .catch((error) => {
        console.error("Error sending mail:", error);
      });
  };

  return (
    <div className="create-email-container">
      <div className="email-header">
        <button onClick={() => navigate("/")}>Back</button>{" "}
        {/* Navigate back */}
        <input
          type="email"
          placeholder="To"
          className="to-input"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Subject"
          className="subject-input"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div className="email-body">
        <Editor
          editorState={editorState}
          toolbarClassName="toolbar-class"
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          onEditorStateChange={onEditorStateChange}
        />
      </div>
      <div className="email-footer">
        <button className="send-button" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default CreateEmail;
