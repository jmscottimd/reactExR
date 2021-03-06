import auth0 from "auth0-js";
import history from "../history";

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: "gtd-307.auth0.com",
    clientID: process.env.REACT_APP_CLIENTID,
    redirectUri: process.env.REACT_APP_REDIRECTURI,
    responseType: "token id_token",
    scope: "openid"
  });
  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
      this.auth0.parseHash((err, authResult) => {
         if (authResult && authResult.accessToken && authResult.idToken) {
            this.setSession(authResult);
            history.replace('/manage');
         } else if (err) {
             history.replace('/manage');
             console.log(err);
         }
      });
    }

    setSession(authResult) {
        // set the time that the Acess Token will expire
        let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('acess_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
        localStorage.setItem('sub', authResult.idTokenPayload.sub);
        // navigate to the home route
        history.replace('/manage');

    }
    logout(){
        // Clear Access Token and Id Token from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('sub');
        //  navigate to home route
        history.replace('/manage');
    }
    isAuthenticated(){
        // Check whether the current time is pas the Access token's expiry time
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }
}
