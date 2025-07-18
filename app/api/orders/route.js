import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/utils/mongodb';

export async function POST(req) {
  try {
    const { amount, products, paymentMethod, paypalOrderId, status, currency, paypalDetails } = await req.json();
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
      date,
      createdAt: new Date(),
    });
    return NextResponse.json({ success: true, orderId: result.insertedId });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save order', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 