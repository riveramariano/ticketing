import buildClient from "../api/build-client"; 

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);

  return <h1>LandingPage</h1>;
};

// Executed during the SSR process
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/current-user');

  return data;
};

export default LandingPage;
