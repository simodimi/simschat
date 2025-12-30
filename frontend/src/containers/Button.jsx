import React from "react";
import "../styles/button.css";

const Button = ({
  children,
  className = "",
  onClick,
  type = "button",
  disabled,
  style,
}) => {
  return (
    <div>
      <button
        className={`btnbutton ${className}`}
        type={type}
        onClick={onClick}
        disabled={disabled}
        style={style}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
