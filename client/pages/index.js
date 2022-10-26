const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>You're signed in</h1> : <h1>You're not signed-in</h1>
};

// Executed during the SSR process
LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default LandingPage;
