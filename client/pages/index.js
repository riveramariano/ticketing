import buildClient from "../api/build-client"; 

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>You're signed in</h1> : <h1>You're not signed-in</h1>
};

// Executed during the SSR process
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/current-user');

  return data;
};

export default LandingPage;
