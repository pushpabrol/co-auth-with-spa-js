# SPA with embedded login form ( Using /co/authentication + SPA JS for PKCE)

This project is a Single Page Application (SPA) that implements user authentication using Auth0. 

### Implementation of Cross-Origin Authentication for Embedded Authenticaiton

In this sample application, we've implemented Auth0's Cross-Origin Authentication to manage user authentication. This method is crucial for the embedded login form experience, especially when our application and the Auth0 server are on different domains ( this will only work on browsers that allow 3rd party cookies). Once the cross orign auth call is completed auth0 responds with a login_ticket and sets the cookies for sso in the response. 
This is then passed as parameter to the auth0 spa js which uses this login_token in the /authorize call to auth0 along with PKCE. NOTE:In order to enforce that this application only supports login via PKCE you would have to disable other grant types such as **implicit** at the application level

#### 1. User Login

For the login functionality, the application posts the user's credentials to Auth0's `/co/authenticate` endpoint. This call returns a `login_ticket`, which is then used to build a URL for Auth0's `/authorize` endpoint using the auth0 spa js. The application then redirects the user to this URL, where Auth0 handles the authentication process. The `/co/authenticate` endpoint plays a vital role in our application. The response from this endpoint is crucial for proceeding with the authentication process.

## Features

- User Login
- User Signup
- Password Reset

## Prerequisites

- Auth0 account and configuration (Domain, Client ID, etc.)
- Web hosting or a local server environment (like Apache, Nginx, or equivalent)

## Installation

1. Clone the repository or download the source code.
2. Place the source code in your web server's public directory.
3. Ensure that the Auth0 configuration details are correctly set up in the application (domain, client ID, etc.).

### Setting Up the Application in Auth0

To ensure the seamless integration of our application with Auth0, certain configurations need to be set up in the Auth0 dashboard. These configurations include specifying callback URLs, logout URLs, web origins, CORS (Cross-Origin Resource Sharing), and Cross-Origin Authentication URLs. 

#### 1. Application Type
   - **Type of Application:** Setup an application in Auth0 of type SPA


#### 2. Callback URLs

- **Setup:** In your Auth0 dashboard, go to the settings of your application. Add the URLs of your application where you want users to be redirected after authentication in the **Callback URLs** field. if your application is hosted at **app.example.com** the callback url will be **https://app.example.com**

#### 3. Logout URLs

- **Setup:** In the same settings section, add the URLs where users should be redirected after logout in the **Logout URLs** field. If your application is hosted at **app.example.com** the logout url in this case will be **https://app.example.com**

#### 4. Allowed Web Origins

- **Setup:** Enter the URL of your application in the **Allowed Web Origins** field to enable CORS requests from your application.If your application is hosted at **app.example.com** this value will be **https://app.example.com**

#### 5. Cross-Origin Authentication & URLS
- **Setup:**
- **Enable Cross-Origin Authentication**
- Enter your application's URL in the **Allowed Origins(CORS)** to be able to post credentials from your application to auth0
- Browsers like chrome, safari etc block 3rd party cookies and so cross origin auth will not work as explained above unless auth0 and the app are on the same top level domain.
- For browsers that are supported ([See](https://auth0.com/docs/get-started/applications/set-up-cors#browser-testing-support), you can use the crossOriginVerification method from the Auth0.js SDK in your application on a dedicated page to handle cases when third-party cookies are disabled. This value can be set in the application setting under **Cross-Origin Verification Fallback URL**. If your application is hosted at **app.example.com** this value can be something like **https://app.example.com/callback-cross-auth.html** where the html file contains the code for auth0's crossOriginVerification. See [auth0 doc](https://auth0.com/docs/get-started/applications/set-up-cors) for more details


### Cross-Origin Authentication and Browser Compatibility

#### Understanding Cross-Origin Authentication

In this application, we utilize Auth0's Cross-Origin Authentication for functionalities like login, signup, and password change. Cross-Origin Authentication is mean to allow your application hosted on one domain to authenticate users against an Auth0 server on a different domain. This is however highly dependent on browser support.

#### Browser Behavior and 3rd Party Cookies

One critical aspect to consider when implementing Cross-Origin Authentication is the handling of 3rd party cookies by different browsers. Cross-Origin Authentication relies heavily on 3rd party cookies. These cookies are set by the Auth0 server (a different domain than the application) and are essential for maintaining the authentication state and session information.

However, many modern browsers have implemented stricter privacy controls that block or restrict 3rd party cookies by default. This change in browser behavior can impact the functionality of Cross-Origin Authentication:

- **Browsers Blocking 3rd Party Cookies:** In browsers where 3rd party cookies are completely blocked, Cross-Origin Authentication might fail, as the browser will not store the cookies set by Auth0, leading to a broken authentication flow.
- **Browsers with Limited 3rd Party Cookie Use:** Some browsers may allow limited use of 3rd party cookies under specific conditions, but this still poses a risk for inconsistent user experience and potential authentication issues.

#### Recommended Use Cases

Given these limitations, it is generally advisable to use Cross-Origin Authentication in situations where both the application and the Auth0 identity provider are hosted under the same Top-Level Domain (TLD). This configuration can effectively bypass the restrictions on 3rd party cookies, as the cookies set by Auth0 would be considered first-party cookies, leading to a more stable and consistent authentication experience.

For instance, if your application is hosted at `app.example.com` and Auth0 is at `auth.example.com`, they share the same TLD (`example.com`), which is a favorable setup for Cross-Origin Authentication.

#### Alternative Approaches

In scenarios where hosting both the application and Auth0 under the same TLD is not feasible, consider alternative authentication methods that do not rely on 3rd party cookies. These methods might include:

- **Universal Login:** Redirecting users to the Auth0 hosted login page (Universal Login) instead of using embedded login forms on your site. This approach circumvents the issues with 3rd party cookies, as the authentication takes place entirely within the Auth0 domain.


## Usage

1. **User Login:**
   - Users can log in using their username and password.
   - This application uses the cross origin authentication for login
2. **User Signup:**
   - New users can sign up by providing their username, email, and password.
   - After signing up, users can log in with their credentials.

3. **Password Reset:**
   - Users can reset their password by clicking on the 'Change Password' link on the login page.
   - They need to provide their email address, and a password reset link will be sent to them.


## Configuration

Ensure you have the following in your Auth0 account:

- A Database Connection (e.g., `db-conn`).
- An Application set up in Auth0 with the correct settings for your SPA.

In your application's code, update the Auth0 configuration details:

```javascript
// Example configuration details
auth0Client = await auth0.createAuth0Client({
    domain: '<YOUR_AUTH0_DOMAIN>',
    clientId: '<YOUR_AUTH0_CLIENT_ID>'
    // Other configurations
});
```

## Password Reset Functionality

The password reset feature uses Auth0's `changePassword` method. Ensure that the email templates and settings in Auth0 are correctly configured for password reset functionality.

```javascript
webAuth.changePassword({
    connection: 'db-conn',
    email: 'foo@bar.com'
}, function (err, resp) {
    if (err) {
        console.log(err.message);
    } else {
        console.log(resp);
    }
});
```


## License

This project is licensed under the MIT License.

