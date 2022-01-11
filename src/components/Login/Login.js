import React from "react";
import localforage from "localforage";
import { GoogleLogin } from "react-google-login";
import { Calendar } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import "./styles.css";

function Login({ setIsLoggedIn }) {
  const responseGoogleOnSuccess = (response) => {
    if (response?.accessToken) {
      localforage.setItem("access_token", response.accessToken).then(() => {
        setIsLoggedIn(true);
      });
    }
  };

  const responseGoogleOnFailure = () => {
    toast.error("Something went wrong while logging in");
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
