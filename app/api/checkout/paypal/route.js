import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { amount, products = [] } = await req.json();
    console.log('Received create_order request:', { amount, products });

    // 1. Get access token
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const base = 'https://api-m.sandbox.paypal.com';

    if (!clientId || !clientSecret) {
      console.error('Missing PayPal credentials');
      return NextResponse.json({ error: 'Missing PayPal credentials' }, { status: 500 });
    }

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenRes = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('PayPal token error:', errText);
      return NextResponse.json({
        error: 'Failed to get PayPal access token',
        status: tokenRes.status,
        details: errText,
      }, { status: 500 });
    }

    const tokenData = await tokenRes.json();
    console.log('PayPal access token:', tokenData);

    // 2. Create order
    const orderRes = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: amount,
            },
            items: products.map(p => ({
              name: p.title,
              unit_amount: {
                currency_code: 'USD',
                value: p.price,
              },
              quantity: p.quantity,
              description: p.description || '',
              category: 'PHYSICAL_GOODS',
            })),
          },
        ],
      }),
    });

    const orderData = await orderRes.json();
    console.log('PayPal order response:', orderData);

    if (!orderRes.ok) {
      return NextResponse.json({
        error: 'Failed to create PayPal order',
        status: orderRes.status,
        details: orderData,
      }, { status: 500 });
    }

    if (!orderData.id) {
      console.error('No order id in PayPal response:', orderData);
      return NextResponse.json({ error: 'No order id in PayPal response', details: orderData }, { status: 500 });
    }

    console.log('Returning to frontend:', { id: orderData.id, products });
    // Return the order ID and products array
    return NextResponse.json({ id: orderData.id, products });
  } catch (err) {
    console.error('Unexpected server error:', err);
    return NextResponse.json({
      error: 'Unexpected server error',
      details: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }
} 