import React from "react";
import { GoogleLogin } from "react-google-login";
import localforage from "localforage";
import { Calendar } from "react-bootstrap-icons";
import "./styles.css";

function Login({ setIsLoggedIn }) {
  const responseGoogleOnSuccess = (response) => {
    console.log("googleresSucc", response);
    if (response?.accessToken) {
      localforage.setItem("access_token", response.accessToken).then(() => {
        setIsLoggedIn(true);
      });
    }
  };

  const responseGoogleOnFailure = (response) => {
    console.log("googleresFail", response);
  };

  return (
    <div className="login_wrapper">
      <div className="login_popup">
        <Calendar height={50} width={50} />
        <h2>Welcome to Calendar list App</h2>
        <p>Login with your Google account</p>
        <div className="login_button">
          <GoogleLogin
            clientId="306213266656-u16acf1jm9n3c93c88nvvkeq29girmho.apps.googleusercontent.com"
            buttonText="Login with Google"
            onSuccess={responseGoogleOnSuccess}
            onFailure={responseGoogleOnFailure}
            cookiePolicy={"single_host_origin"}
            scope="https://www.googleapis.com/auth/calendar"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
