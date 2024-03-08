// The Auth0 client, initialized in configureClient()
let auth0Client = null;
let webAuth = null;
let config = null;

/**
 * Starts the authentication flow
 */
const login = async (targetUrl) => {

  try {
    console.log("Logging in", targetUrl);
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    const loginTicket = await coauth_login_silent('Username-Password-Authentication', username, password);

    const options = {
      authorizationParams: {
        redirect_uri: window.location.origin,
        login_ticket : loginTicket,
        audience: config.audience,
        scope: config.scope
      }
    };

    if (targetUrl) {
      options.appState = { targetUrl };
    }

    await auth0Client.loginWithRedirect(options);
  } catch (err) {
    console.log("Log in failed", err);
  }
};

const signup = async () => {
  const password = document.getElementById('signupPassword').value;
  const email = document.getElementById('signupEmail').value;

  try {
    

    webAuth.signup({
      connection: 'Username-Password-Authentication',
      email: email,
      password: password
    }, async function (err) {
      if (err) return alert('Something went wrong: ' + err.message);
      const loginTicket = await coauth_login_silent('Username-Password-Authentication', email, password);

      const options = {
        authorizationParams: {
          redirect_uri: window.location.origin,
          login_ticket : loginTicket,
          audience: config.audience,
          scope: config.scope
        }
      };
      
      await auth0Client.loginWithRedirect(options);
  
      // After successful signup, you may want to automatically log the user in or redirect them to the login page
      console.log('Signup successful');
  });


  } catch (err) {
    console.log('Error during signup:', err);
  }
};
function backToLogin(){
  updateUI()
}
document.getElementById('changePasswordBtn').addEventListener('click', async function() {

  var email = document.getElementById('changePasswordEmail').value;
  
  webAuth.changePassword({
    connection: 'Username-Password-Authentication',
    email: email
  }, function (err, resp) {
    if(err){
      console.log(err.message);
    } else {
      alert(resp);

    }
  });
});

document.getElementById('changePasswordLink').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('loginArea').classList.add('hidden');
  document.getElementById('changePasswordArea').classList.remove('hidden');
});




async function coauth_login_silent(realm, username, password) {

  let url = `https://${config.domain}/co/authenticate`;

  let data = {
      client_id: config.clientId,
      username: username,
      password: password,
      realm: realm,
      credential_type: "http://auth0.com/oauth/grant-type/password-realm"
  };

  const params = {
      headers: {
          'content-type': 'application/json'
      },
      method: 'POST',
      credentials: "include",
      body: JSON.stringify(data)
  };

  try {
      const response = await fetch(url, params);
      const value = await response.json();
      let login_ticket = value['login_ticket'];
      console.log('login_ticket: ' + login_ticket);
      return login_ticket;
      
  } catch (err) {
      throw err;
  }
}

/**
 * Executes the logout flow
 */
const logout = async () => {
  try {
    console.log("Logging out");
    await auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  } catch (err) {
    console.log("Log out failed", err);
  }
};

/**
 * Retrieves the auth configuration from the server
 */
const fetchAuthConfig = () => fetch("/auth_config.json");

/**
 * Initializes the Auth0 client
 */
const configureClient = async () => {
  const response = await fetchAuthConfig();
  config = await response.json();

  auth0Client = await auth0.createAuth0Client({
    domain: config.domain,
    clientId: config.clientId
  });

  webAuth = new auth0jsAuth0.WebAuth({
    domain:       config.domain,
    clientID:     config.clientId
  });
};

/**
 * Checks to see if the user is authenticated. If so, `fn` is executed. Otherwise, the user
 * is prompted to log in
 * @param {*} fn The function to execute if the user is logged in
 */
const requireAuth = async (fn, targetUrl) => {
  const isAuthenticated = await auth0Client.isAuthenticated();

  if (isAuthenticated) {
    return fn();
  }

  return login(targetUrl);
};

// Will run when page finishes loading
window.onload = async () => {
  await configureClient();


  // If unable to parse the history hash, default to the root URL
  if (!showContentFromUrl(window.location.pathname)) {
    showContentFromUrl("/");
    window.history.replaceState({ url: "/" }, {}, "/");
  }

  const bodyElement = document.getElementsByTagName("body")[0];

  // Listen out for clicks on any hyperlink that navigates to a #/ URL
  bodyElement.addEventListener("click", (e) => {
    if (isRouteLink(e.target)) {
      const url = e.target.getAttribute("href");

      if (showContentFromUrl(url)) {
        e.preventDefault();
        window.history.pushState({ url }, {}, url);
      }
    }
  });

  const isAuthenticated = await auth0Client.isAuthenticated();

  if (isAuthenticated) {
    console.log("> User is authenticated");
    window.history.replaceState({}, document.title, window.location.pathname);
    updateUI();
    showContentFromUrl("/profile")
    return;
  }
  console.log("> User not authenticated");

  const query = window.location.search;
  const shouldParseResult = query.includes("code=") && query.includes("state=");

  if (shouldParseResult) {
    console.log("> Parsing redirect");
    try {
      const result = await auth0Client.handleRedirectCallback();

      if (result.appState && result.appState.targetUrl) {
        showContentFromUrl(result.appState.targetUrl);
      } else showContentFromUrl("/profile")

      console.log("Logged in!");
    } catch (err) {
      console.log("Error parsing redirect:", err);
    }

    window.history.replaceState({}, document.title, "/");
  }

  updateUI();
};

function toggleForms() {
  const loginArea = document.getElementById('loginArea');
  const signupArea = document.getElementById('signupArea');

  if (loginArea.classList.contains('hidden')) {
      loginArea.classList.remove('hidden');
      signupArea.classList.add('hidden');
  } else {
      loginArea.classList.add('hidden');
      signupArea.classList.remove('hidden');
  }
}

