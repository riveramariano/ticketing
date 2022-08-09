import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);

  return <h1>LandingPage</h1>;
};

// Executed during the SSR process
LandingPage.getInitialProps = async () => {
  const response = axios.get('/api/users/current-user').catch((err) => {
    console.log(err.message);
  }); 

  return response.data;
};

export default LandingPage;
