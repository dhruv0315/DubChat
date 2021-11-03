import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import { useFirestoreQuery } from "../hooks";
// Components
import Message from "./Message";
import ig from "../instagram.png";
import lkdn from "../linkedin.png";
import yt from "../youtube.png";
import gh from "../github-logo.png";

const Channel = ({ user = null }) => {
  const db = firebase.firestore();
  const messagesRef = db.collection("messages");
  const messages = useFirestoreQuery(
    messagesRef.orderBy("createdAt", "desc").limit(100)
  );

  const [newMessage, setNewMessage] = useState("");

  const inputRef = useRef();
  const bottomListRef = useRef();

  const { uid, displayName, photoURL } = user;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleOnChange = (e) => {
    setNewMessage(e.target.value);
  };

  const scrollToBottom = () => {
    bottomListRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    const trimmedMessage = newMessage.trim();
    if (trimmedMessage) {

      messagesRef.add({
        text: trimmedMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        displayName,
        photoURL,
      });

      setNewMessage("");

      {
        scrollToBottom();
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-auto h-full">
        <div className="py-4 max-w-screen-lg mx-auto">
          <div className="border-b dark:border-gray-600 border-gray-200 py-8 mb-4">
            <div className="font-bold text-3xl text-center">
              <p className="mb-3 text-primary-500">Welcome to DubChats</p>
            </div>
            <p className="text-gray-400 text-center">Start Chatting!</p>
            <div className="flex flex-row justify-center mt-3">
              <a href="https://www.youtube.com/channel/UCfgqyHNgoX77CS-fFqPvqMw" target="_blank"><img src={yt} width={25} className="mx-2"/></a>
              <a href="https://github.com/dhruvthakkar0315" target="_blank"><img src={gh} width={25} className="mx-2"/></a>
              <a href="https://www.instagram.com/dhruvv.t_/" target="_blank"><img src={ig} width={25} className="mx-2"/></a>
              <a href="https://www.linkedin.com/in/dhruv-thakkar-75175820b/" target="_blank"><img src={lkdn} width={25} className="mx-2"/></a>
            </div>
          </div>
          <ul>
            {messages
              ?.sort((first, second) =>
                first?.createdAt?.seconds <= second?.createdAt?.seconds ? -1 : 1
              )
              ?.map((message) => (
                <li key={message.id}>
                  <Message {...message} />
                </li>
              ))}
          </ul>
          <div ref={bottomListRef} />
        </div>
      </div>
      <div className="mb-6 mx-4">
        <form
          onSubmit={handleOnSubmit}
          className="flex flex-row bg-gray-200 dark:bg-coolDark-400 rounded-md px-4 py-3 z-10 max-w-screen-lg mx-auto dark:text-white shadow-md"
        >
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleOnChange}
            placeholder="Say Something..."
            className="flex-1 bg-transparent outline-none"
          />
          <button
            type="submit"
            disabled={!newMessage}
            className="uppercase font-semibold text-sm tracking-wider text-primary-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

Channel.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }),
};

export default Channel;
