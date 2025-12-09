import React from "react";
import EmojiPicker from "emoji-picker-react";

const Emojis = ({ handleEmojiSelect }) => {
  return (
    <EmojiPicker onEmojiClick={handleEmojiSelect} style={{ width: "100%" }} />
  );
};

export default Emojis;
