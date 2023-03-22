import { useRef, useEffect } from "react";

import classes from "./LoginForm.module.scss";
import usernameIcon from "../assets/akar-icons_person.svg";
import passwordIcon from "../assets/carbon_password.svg";
import Navbar from "./Navbar";
//import ValidUserContext from "../authCheck";

let isInitial = true;

function Login() {
//  const validUserContext = useContext("ValidUserContext");
const test = true;
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  useEffect(() => {
    if (isInitial) {
     // validUserContext.localAuthCheck();
      isInitial = false;
    }
  }, [test]);

  const submitHandler = (event) => {
    event.preventDefault();

   /* validUserContext.apiAuthCheck(
      emailInputRef.current.value,
      passwordInputRef.current.value
    );*/
  };

  return (
    <div className="content">
      <Navbar/>
    <form onSubmit={submitHandler} className={classes.form}>
      <div>
        <img
          className={classes.icon}
          src={usernameIcon}
          alt="Username icon"
          htmlFor="user-name"
        ></img>
        <input
          className={classes.input}
          type="email"
          id="user-name"
          name="user-name"
          autoComplete="on"
          placeholder="Username or E-mail"
          ref={emailInputRef}
          required={!test}
        ></input>
      </div>

      <div>
        <img
          className={classes.icon}
          src={passwordIcon}
          alt="Password icon"
          htmlFor="user-password"
        ></img>
        <input
          className={classes.input}
          type="password"
          id="user-password"
          name="user-password"
          autoComplete="off"
          placeholder="Password"
          ref={passwordInputRef}
          required={!test}
        ></input>
      </div>
      <button
        className={classes.loginBtn}
        disabled={test}
      >
        {test ? "Already logged in" : "Login"}
      </button>
    </form></div>
  );
}

export default Login;
