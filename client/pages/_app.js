import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <h1>{currentUser.email}</h1>
      <Component {...pageProps} />
    </div>
  )
};

// Executed during the SSR process
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/current-user');

  // Ability to access children components initialProps
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return { pageProps, ...data }
};

export default AppComponent;
