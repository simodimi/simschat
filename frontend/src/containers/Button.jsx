import React from "react";
import "../styles/button.css";

const Button = ({ children, className = "", onClick, type = "button" }) => {
  return (
    <div>
      <button
        className={`btnbutton ${className}`}
        type={type}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
