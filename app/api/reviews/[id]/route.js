import { connectToDatabase } from '@/app/utils/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export async function DELETE(req, { params }) {
  try {
    const { id: reviewId } = params;
    
    console.log('DELETE /api/reviews/[id] - Review ID:', reviewId);
    console.log('DELETE /api/reviews/[id] - Headers:', Object.fromEntries(req.headers.entries()));
    
    if (!reviewId) {
      return Response.json({ error: 'Review ID is required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    
    // Get user from token
    const auth = req.headers.get('authorization');
    console.log('DELETE /api/reviews/[id] - Auth header:', auth);
    
    if (!auth || !auth.startsWith('Bearer ')) {
      console.log('DELETE /api/reviews/[id] - No auth header or invalid format');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = auth.split(' ')[1];
    console.log('DELETE /api/reviews/[id] - Token:', token ? 'Present' : 'Missing');
    
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
      console.log('DELETE /api/reviews/[id] - Decoded userId:', userId);
    } catch (e) {
      console.log('DELETE /api/reviews/[id] - JWT verification failed:', e.message);
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if review exists and belongs to user
    console.log('DELETE /api/reviews/[id] - Looking for review with ID:', reviewId);
    console.log('DELETE /api/reviews/[id] - User ID:', userId);
    
    const review = await db.collection('reviews').findOne({
      _id: new ObjectId(reviewId),
      userId: userId
    });

    console.log('DELETE /api/reviews/[id] - Found review:', review ? 'Yes' : 'No');

    if (!review) {
      console.log('DELETE /api/reviews/[id] - Review not found or unauthorized');
      return Response.json({ error: 'Review not found or you are not authorized to delete it' }, { status: 404 });
    }

    // Delete the review
    await db.collection('reviews').deleteOne({ _id: new ObjectId(reviewId) });

    // Update product average rating
    await updateProductRating(db, review.productId.toString());

    return Response.json({ 
      success: true, 
      message: 'Review deleted successfully'
    });
  } catch (err) {
    return Response.json({ error: 'Failed to delete review', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

async function updateProductRating(db, productId) {
  try {
    // Calculate average rating for the product
    const reviews = await db.collection('reviews')
      .find({ productId: new ObjectId(productId) })
      .toArray();

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;
      const reviewCount = reviews.length;

      // Update product with new rating
      await db.collection('products').updateOne(
        { _id: new ObjectId(productId) },
        { 
          $set: { 
            averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
            reviewCount: reviewCount
          } 
        }
      );
    } else {
      // No reviews left, reset product rating
      await db.collection('products').updateOne(
        { _id: new ObjectId(productId) },
        { 
          $set: { 
            averageRating: 0,
            reviewCount: 0
          } 
        }
      );
    }
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
} 