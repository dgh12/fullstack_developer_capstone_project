import React, { useState } from "react";
import "./Register.css";
import user_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import close_icon from "../assets/close.png";
import Header from '../Header/Header';
import go_home from '../assets/scripts';

const Register = () => {
    //state variables for form inputs
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    // Registration endpoint
    const register_url = "/djangoapp/registration";
    // Handle form submission
    const register = async (e) => {
        e.preventDefault();

        // Send POST request to register endpoint
        console.log(register_url);
        const res = await fetch(register_url, {    
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "userName": userName,
                "password": password,
                "firstName": firstName,
                "lastName": lastName,
                "email": email
            }),
        });
    
        const json = await res.json();
        if (json.status) {
        // save username in session and redirect to home page
            sessionStorage.setItem("username", json.userName);
            go_home();
        //    window.location.href = "/"; --- IGNORE ---
        }
        else if (json.error === "Already exists") {
            alert("The user with the same username is already registered");
        }

};

    return (
        <div className="register_panel">
            <Header/>
            <div className="register_container" style={{width: "50%"}}>
                <div className="header" style={{display: "flex",flexDirection: "row", justifyContent: "space-between"}}>
                    <span className="text" style={{flexGrow: 1}}>SignUp</span>
                    <div style={{display: "flex",flexDirection: "row", justifySelf: "end", alignSelf: "start"}}>
                        <a href="/" onClick={(e) => { e.preventDefault(); go_home(e); }} style={{justifyContent: "space-between", alignItems:"flex-end"}}>
                            <img src={close_icon} alt="X" style={{width:"1cm"}}/>
                        </a>
                    </div>
                </div>
                <form className="form" onSubmit={register}>
                    <div className="inputs">
                        <div className="input">
                            <img src={user_icon} alt="Username" className="img_icon" />
                            <input
                                type="text"
                                placeholder="Username"
                                name="username"
                                className="input_field"
                                required
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                        <div className="input">
                            <img src={user_icon} alt="First Name" className="img_icon" />
                            <input
                                type="text"
                                placeholder="First Name"
                                name="firstName"
                                className="input_field"
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="input">
                            <img src={user_icon} alt="Last Name" className="img_icon" />
                            <input
                                type="text"
                                placeholder="Last Name"
                                name="lastName"
                                className="input_field"
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="input">
                            <img src={email_icon} alt="Email" className="img_icon" />
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                className="input_field"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="input">
                            <img src={password_icon} alt="Password" className="img_icon" />
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                className="input_field"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="Submit_panel">
                        <input className="submit" type="Submit" value="Register"/>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default Register;
