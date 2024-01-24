import React, { useState } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';

interface SignupProps {
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

const Signup: React.FC<SignupProps> = ({ setIsAuth }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        cpassword: '',
    });

    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password || !formData.cpassword) {
            setError('All fields are required.');
            return;
        }

        if (formData.password !== formData.cpassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
                credentials: 'include',
            });

            if (response.ok) {
                console.log('Registration successful');
                setIsAuth(true);
                navigate('/');
            } else {
                const errorData = await response.json();
                setError(`Registration failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setError('An error occurred during registration.');
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} id="signup-form" className="signup_form">
                <h1 className="signup-form_h1">Create Account</h1>
                <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <input
                    type="text"
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
                <input
                    type="password"
                    name="cpassword"
                    placeholder="Confirm password"
                    value={formData.cpassword}
                    onChange={handleChange}
                />
                <button className="sign_up_btn" type="submit">
                    Sign Up
                </button>
                <h1 className="error-signup">{error}</h1>
            </form>
        </div>
    );
};

export default Signup;
