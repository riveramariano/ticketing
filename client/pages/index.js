import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);

  return <h1>LandingPage</h1>;
};

// Executed during the SSR process
LandingPage.getInitialProps = async ({ req }) => {
  if (typeof window === 'undefined') {
    /*
      We're on the server when:
        - Hard refresh of page
        - Clicking link from different domain
        - Typing URL into address bar
    */
    const { data } = await axios.get(
      // http://SERVICENAME.NAMESPACE.svc.cluster.local/ROUTE
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/current-user', {
        headers: req.headers
      }
    );

    return data;
  } else {
    /*
      We're on the browser when:
        - Navigating from one page to another while in the app
          - From sign-up to landing page
    */
    const { data } = await axios.get('/api/users/current-user');

    return data;
  }
};

export default LandingPage;
