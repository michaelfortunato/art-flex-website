
import React from 'react';
import GoogleLogin, { useGoogleLogin } from 'react-google-login';
import SignInButton, { SocialButton } from './SignInButton'

const clientId="199567296207-mhdms0kl7hfprapdao6qf55j47r5tmfo.apps.googleusercontent.com"

export default function GoogleSignInButton() {
  const responseGoogle = (response) => {
  console.log(response);
}

  return (
    <GoogleLogin
    clientId={clientId}
    theme = "dark"
    render = {renderProps =>  <SocialButton animate onClick={renderProps.onClick} disabled={renderProps.disabled} isSVG = {true} icon = {'/Google_G_Logo.svg'} text={'Sign in with Google'} />}
    onSuccess={responseGoogle}
    onFailure={responseGoogle}
    cookiePolicy={'single_host_origin'}
  />
  );
}