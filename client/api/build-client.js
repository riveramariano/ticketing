import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    /*
      We're on the server when:
        - Hard refresh of page
        - Clicking link from different domain
        - Typing URL into address bar
      http://SERVICENAME.NAMESPACE.svc.cluster.local/ROUTE
    */

    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    });
  } else {
    /*
      We're on the browser when:
        - Navigating from one page to another while in the app
          - From sign-up to landing page
      No need to specify the ingress-nginx service
    */

    return axios.create({
      baseURL: '/'
    });
  }
};
