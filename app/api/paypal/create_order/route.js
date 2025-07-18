import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { amount, products = [] } = await req.json();

    // Calculate item total
    const itemTotal = products.reduce((sum, p) => sum + (Number(p.price) * Number(p.quantity)), 0).toFixed(2);

    // 1. Get access token
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || process.env.PAYPAL_CLIENT_ID || `c3OrLFIor_JZu9J1hYkn73XEDY2CRX7qy_rACf0vmtC36u2kWJcckfriyTEIa3rRgxtu_Kr_r9NJJgD`;
    const clientSecret = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET || process.env.PAYPAL_CLIENT_SECRET || `ECx8Vne53CEhravWhNcAmju19eD0VR8H-DtQPcfJ7691GgieSa420e-jx5t7C3-M4KRmp5t38WlXm_Cb`;
    const base = 'https://api-m.sandbox.paypal.com'; // Use 'https://api-m.paypal.com' for production

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
      return NextResponse.json({
        error: 'Failed to get PayPal access token',
        status: tokenRes.status,
        details: errText,
      }, { status: 500 });
    }

    const tokenData = await tokenRes.json();

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
              value: itemTotal,
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: itemTotal,
                }
              }
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

    if (!orderRes.ok) {
      return NextResponse.json({
        error: 'Failed to create PayPal order',
        status: orderRes.status,
        details: orderData,
      }, { status: 500 });
    }

    // Return the order ID and products array
    return NextResponse.json({ id: orderData.id, products });
  } catch (err) {
    return NextResponse.json({
      error: 'Unexpected server error',
      details: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }
} 