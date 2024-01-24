import React, { useState } from "react";
import "./Signin.css";
import { useNavigate } from "react-router-dom";

interface SigninProps {
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

const Signin: React.FC<SigninProps> = ({ setIsAuth }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
        credentials: "include",
      });
      if (response.ok) {
        console.log("Login successful");
        setIsAuth(true);
        navigate("/");
      } else {
        const errorData = await response.json();
        setError(`Login failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} id="signup-form" className="signup_form">
        <h1 className="signup-form_h1">Authorization</h1>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <button className="sign_up_btn" type="submit">
          Sign In
        </button>
        <h1 className="error-signup">{error}</h1>
      </form>
    </div>
  );
};

export default Signin;
