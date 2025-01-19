import { useState } from "react";
import { Link } from "react-router-dom";
import "../cssfile/signup.css";

const Register = () => {
    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        password: "",
        age: ""
    });

    const [message, setMessage] = useState({
        type: "invisible-msg",
        text: "Dummy Msg"
    });

    const [ageError, setAgeError] = useState("");

    function handleInput(event) {
        const { name, value } = event.target;

        if (name === "age") {
            const age = parseInt(value, 10);
            if (age < 8) {
                setAgeError("Age should not be less than 8.");
            } else if (age > 100) {
                setAgeError("Age should not exceed 100.");
            } else {
                setAgeError("");
            }
        }

        setUserDetails((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        const age = parseInt(userDetails.age, 10);
        if (age < 8) {
            setAgeError("Age should not be less than 8.");
            return;
        } else if (age > 100) {
            setAgeError("Age should not exceed 100.");
            return;
        }

        fetch("http://localhost:8000/register", {
            method: "POST",
            body: JSON.stringify(userDetails),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response) => response.json())
        .then((data) => {
            setMessage({ type: "success", text: data.message });

            setUserDetails({
                name: "",
                email: "",
                password: "",
                age: ""
            });

            setTimeout(() => {
                setMessage({ type: "invisible-msg", text: "Dummy Msg" });
            }, 5000);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    return (
        <section className="auth-container">
            <img src="img9.avif" alt="Fitness" />
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Start Your Fitness</h1>

                <input
                    className="auth-input"
                    type="text"
                    required
                    onChange={handleInput}
                    placeholder="Enter Name"
                    name="name"
                    value={userDetails.name}
                />

                <input
                    className="auth-input"
                    type="email"
                    required
                    onChange={handleInput}
                    placeholder="Enter Email"
                    name="email"
                    value={userDetails.email}
                />

                <input
                    className="auth-input"
                    type="password"
                    required
                    maxLength={8}
                    onChange={handleInput}
                    placeholder="Enter Password"
                    name="password"
                    value={userDetails.password}
                />

                <input
                    className="auth-input"
                    type="number"
                    required
                    onChange={handleInput}
                    placeholder="Enter Age"
                    name="age"
                    value={userDetails.age}
                    min={8}
                    max={100}
                />
                {ageError && <p className="error-msg">{ageError}</p>}

                <button className="auth-button">Register</button>

                <p>Already Registered? <Link to="/login">Login</Link></p>

                <p className={message.type}>{message.text}</p>
            </form>
        </section>
    );
};

export default Register;
