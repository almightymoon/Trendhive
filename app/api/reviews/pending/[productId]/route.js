import { connectToDatabase } from '@/app/utils/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export async function DELETE(req, { params }) {
  try {
    const { productId } = params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId || !productId) {
      return Response.json({ error: 'User ID and Product ID are required' }, { status: 400 });
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

    // Verify the user is removing their own pending review
    if (tokenUserId !== userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Remove the pending review
    const result = await db.collection('pendingReviews').deleteOne({
      userId: userId,
      productId: productId
    });

    if (result.deletedCount === 0) {
      return Response.json({ error: 'Pending review not found' }, { status: 404 });
    }

    return Response.json({ 
      success: true, 
      message: 'Pending review removed successfully'
    });
  } catch (err) {
    console.error('Error removing pending review:', err);
    return Response.json({ error: 'Failed to remove pending review', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 