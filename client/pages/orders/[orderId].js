import { useEffect, useState } from 'react';
import Router from 'next/router';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/') 
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const secondsLeft = (new Date(order.expiresAt) - new Date()) / 1000;
      setTimeLeft(Math.round(secondsLeft));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    // Stop the timer when we left the component
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      Time Left to pay: {timeLeft} seconds
      <StripeCheckout 
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51LvNuxHco28exwbTJ08RpZbIQVNHUWo9bXbA1IiWmELkGIknlQ9wlyfK1Q65zuSIKUZH98ZxtZeJZ27Q4q4Apslo00fxNCW1Hh"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
