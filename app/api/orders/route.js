import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/mongodb';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    const db = await connectToDatabase();
    const auth = req.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = auth.split(' ')[1];
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    // Find orders for this user
    const orders = await db.collection('orders').find({ userId }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load orders', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { amount, products, paymentMethod, paypalOrderId, status, currency, paypalDetails, userId } = await req.json();
    const db = await connectToDatabase();

    // Extract user info for PayPal orders
    let user = undefined;
    let price = amount;
    let productName = Array.isArray(products) && products.length > 0 ? products[0].title || products[0].name : undefined;
    let date = new Date();
    if (paymentMethod === 'paypal' && paypalDetails) {
      // Extract name and address from PayPal details
      const payer = paypalDetails.payer || {};
      const shipping = paypalDetails.purchase_units?.[0]?.shipping || {};
      user = {
        name: payer.name?.given_name && payer.name?.surname ? `${payer.name.given_name} ${payer.name.surname}` : payer.name?.given_name || '-',
        email: payer.email_address || '-',
        address: shipping.address?.address_line_1
          ? `${shipping.address.address_line_1}, ${shipping.address.admin_area_2 || ''}, ${shipping.address.admin_area_1 || ''}, ${shipping.address.postal_code || ''}, ${shipping.address.country_code || ''}`.replace(/, +/g, ', ').replace(/, $/, '')
          : '-',
      };
      // Use PayPal's amount if available
      price = paypalDetails.purchase_units?.[0]?.amount?.value || amount;
      // Use first item name if available
      productName = paypalDetails.purchase_units?.[0]?.items?.[0]?.name || productName;
      // Use PayPal's update_time or create_time if available
      date = paypalDetails.update_time || paypalDetails.create_time || date;
    }

    const result = await db.collection('orders').insertOne({
      amount,
      price,
      products,
      productName,
      paymentMethod,
      paypalOrderId,
      status,
      currency,
      paypalDetails,
      user,
      userId,
      date,
      createdAt: new Date(),
    });
    return NextResponse.json({ success: true, orderId: result.insertedId });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save order', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 