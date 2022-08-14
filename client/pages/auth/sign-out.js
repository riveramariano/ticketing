import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
  const { doRequest } = useRequest({
    url: '/api/users/sign-out',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/')
  })

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div>Chao Chao</div>
  );
};
