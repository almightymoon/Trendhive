import { connectToDatabase } from '@/app/utils/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, products, orderId } = body;

    if (!userId || !products || !Array.isArray(products)) {
      return Response.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const db = await connectToDatabase();
    
    // Get user from token for verification
    const auth = req.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = auth.split(' ')[1];
    let tokenUserId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      tokenUserId = decoded.userId;
    } catch (e) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Verify the user is saving their own pending reviews
    if (tokenUserId !== userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Save pending reviews for each product
    const pendingReviews = products.map(product => ({
      userId: userId,
      productId: product._id || product.id,
      productName: product.name || product.title,
      productImage: product.mainImage || product.image || product.images?.[0],
      productPrice: product.price,
      orderId: orderId,
      createdAt: new Date(),
      status: 'pending'
    }));

    // Remove any existing pending reviews for these products by this user
    const productIds = products.map(p => p._id || p.id);
    await db.collection('pendingReviews').deleteMany({
      userId: userId,
      productId: { $in: productIds }
    });

    // Insert new pending reviews
    if (pendingReviews.length > 0) {
      await db.collection('pendingReviews').insertMany(pendingReviews);
    }

    return Response.json({ 
      success: true, 
      message: 'Pending reviews saved successfully',
      count: pendingReviews.length
    });
  } catch (err) {
    console.error('Error saving pending reviews:', err);
    return Response.json({ error: 'Failed to save pending reviews', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    
    // Get user from token for verification
    const auth = req.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = auth.split(' ')[1];
    let tokenUserId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      tokenUserId = decoded.userId;
    } catch (e) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Verify the user is requesting their own pending reviews
    if (tokenUserId !== userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get pending reviews for the user
    const pendingReviews = await db.collection('pendingReviews')
      .find({ userId: userId, status: 'pending' })
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(pendingReviews);
  } catch (err) {
    console.error('Error fetching pending reviews:', err);
    return Response.json({ error: 'Failed to fetch pending reviews', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 