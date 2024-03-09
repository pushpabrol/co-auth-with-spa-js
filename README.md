# Single Page Application (SPA) with Auth0 Authentication

This project is a Single Page Application (SPA) that implements user authentication using Auth0. It includes features for user login, signup, and password reset.

## Features

- User Login
- User Signup
- Password Reset

## Prerequisites

- Auth0 account and configuration (Domain, Client ID, etc.)
- Web hosting or a local server environment (like Apache, Nginx, or equivalent)


### Cross-Origin Authentication and Browser Compatibility

#### Understanding Cross-Origin Authentication

In this application, we utilize Auth0's Cross-Origin Authentication for functionalities like login, signup, and password change. Cross-Origin Authentication allows our application hosted on one domain to authenticate users against an Auth0 server on a different domain.

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

## Installation

1. Clone the repository or download the source code.
2. Place the source code in your web server's public directory.
3. Ensure that the Auth0 configuration details are correctly set up in the application (domain, client ID, etc.).

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

### Implementation of Cross-Origin Authentication in Our Sample

In this sample application, we've implemented Auth0's Cross-Origin Authentication to manage user authentication. This method is crucial for securely handling user credentials and sessions, especially when our application and the Auth0 server are on different domains. Below is an overview of how Cross-Origin Authentication is employed in various functionalities of our application:

#### 1. User Login

For the login functionality, the application posts the user's credentials to Auth0's `/co/authenticate` endpoint. This call returns a `login_ticket`, which is then used to build a URL for Auth0's `/authorize` endpoint using the auth0 spa js. The application then redirects the user to this URL, where Auth0 handles the authentication process. The `/co/authenticate` endpoint plays a vital role in our application. It is the initial step in the Cross-Origin Authentication flow, where the application sends the user's credentials to Auth0. The response from this endpoint is crucial for proceeding with the authentication process.


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

## Contributing

Contributions to this project are welcome. Please ensure that your code adheres to the project's coding standards and include appropriate tests.

## License

This project is licensed under the MIT License.

---

This README provides a basic overview of your project, including how to set it up and use it. You can expand each section with more detailed information as necessary, especially under the "Configuration" section, to provide specific instructions based on how your application is set up in Auth0.
