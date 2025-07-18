"use client";
import { PayPalButtons } from '@paypal/react-paypal-js';

const PayPalButton = ({ amount, products = [], currency = 'USD', onSuccess, onError }) => {
  return (
    <PayPalButtons
      style={{ layout: 'vertical', height: 55, width: '100%', borderRadius: 8, fontSize: '1.1rem', fontWeight: 600 }}
      createOrder={async () => {
        try {
          const res = await fetch('/api/paypal/create_order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount, products }),
          });
          const data = await res.json();
          console.log('PayPal Order Created:', data);
          if (!data.id) {
            throw new Error(data.error || 'Failed to create PayPal order: No order ID returned');
          }
          return data.id;
        } catch (error) {
          console.error('Create order error:', error);
          throw error;
        }
      }}
      onApprove={async (data, actions) => {
        try {
          const details = await actions.order.capture();
          console.log('Payment Approved: ', details);
          // Ensure products array is populated
          let orderProducts = products;
          if ((!orderProducts || orderProducts.length === 0) && details && details.purchase_units) {
            // Try to extract product info from PayPal details
            const items = details.purchase_units[0]?.items;
            if (items && items.length > 0) {
              orderProducts = items.map(item => ({
                title: item.name,
                price: Number(item.unit_amount?.value) || 0,
                quantity: Number(item.quantity) || 1
              }));
            }
          }
          // Save order to database
          const orderRes = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: Number(amount),
              products: orderProducts,
              paymentMethod: 'paypal',
              paypalOrderId: data.orderID,
              status: 'paid',
              currency,
              paypalDetails: details,
            }),
          });
          const orderData = await orderRes.json();
          if (orderRes.ok) {
            if (onSuccess) onSuccess({ details, orderId: orderData.orderId });
          } else {
            if (onError) onError(orderData.error || 'Failed to save PayPal order');
          }
        } catch (error) {
          console.error('PayPal order save error:', error);
          if (onError) onError(error.message);
        }
      }}
      onError={(err) => {
        console.error('PayPal Checkout Error: ', err);
        if (onError) onError(err.message);
      }}
    />
  );
};

export default PayPalButton; 