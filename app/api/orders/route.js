import { connectToDatabase } from '@/app/utils/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    const db = await connectToDatabase();
    const auth = req.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = auth.split(' ')[1];
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (e) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Find orders for this user
    const orders = await db.collection('orders').find({ userId }).sort({ createdAt: -1 }).toArray();
    
    // Ensure all orders have proper fields
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber || order._id.toString().slice(-8).toUpperCase(),
      orderId: order._id,
      amount: order.amount || 0,
      total: order.amount || order.price || 0,
      price: order.price || order.amount || 0,
      products: order.products || order.items || [],
      items: order.items || order.products || [],
      productName: order.productName || '',
      paymentMethod: order.paymentMethod || 'Unknown',
      paypalOrderId: order.paypalOrderId || null,
      status: order.status || 'Pending',
      currency: order.currency || 'usd',
      paypalDetails: order.paypalDetails || null,
      user: order.user || {},
      userId: order.userId,
      date: order.date || order.createdAt,
      createdAt: order.createdAt,
      shippingInfo: order.shippingInfo || {},
      paymentIntentId: order.paymentIntentId || null
    }));
    
    return Response.json(formattedOrders);
  } catch (err) {
    return Response.json({ error: 'Failed to load orders', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, orderId, ...orderData } = body;
    
    // If action is delete, handle order deletion
    if (action === 'delete') {
      const db = await connectToDatabase();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const token = auth.split(' ')[1];
      let userId;
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (e) {
        return Response.json({ error: 'Invalid token' }, { status: 401 });
      }

      if (!orderId) {
        return Response.json({ error: 'Order ID is required' }, { status: 400 });
      }

      // Delete the order (only if it belongs to the user)
      const result = await db.collection('orders').deleteOne({ 
        _id: new ObjectId(orderId), 
        userId: userId 
      });

      if (result.deletedCount === 0) {
        return Response.json({ error: 'Order not found or not authorized to delete' }, { status: 404 });
      }

      return Response.json({ 
        success: true, 
        message: 'Order deleted successfully' 
      });
    }
    
    // Otherwise, handle order creation (existing logic)
    const { amount, products, paymentMethod, paypalOrderId, status, currency, paypalDetails, userId } = orderData;
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
    return Response.json({ success: true, orderId: result.insertedId });
  } catch (err) {
    return Response.json({ error: 'Failed to process order request', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 

export async function DELETE(req) {
  try {
    const db = await connectToDatabase();
    const auth = req.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = auth.split(' ')[1];
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (e) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { orderId } = await req.json();
    
    if (!orderId) {
      return Response.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Delete the order (only if it belongs to the user)
    const result = await db.collection('orders').deleteOne({ 
      _id: new ObjectId(orderId), 
      userId: userId 
    });

    if (result.deletedCount === 0) {
      return Response.json({ error: 'Order not found or not authorized to delete' }, { status: 404 });
    }

    return Response.json({ 
      success: true, 
      message: 'Order deleted successfully' 
    });
  } catch (err) {
    return Response.json({ 
      error: 'Failed to delete order', 
      details: err instanceof Error ? err.message : String(err) 
    }, { status: 500 });
  }
} 