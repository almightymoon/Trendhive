import { connectToDatabase } from '@/app/utils/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    const db = await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return Response.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Get reviews for a specific product
    const reviews = await db.collection('reviews')
      .find({ productId: new ObjectId(productId) })
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(reviews);
  } catch (err) {
    return Response.json({ error: 'Failed to load reviews', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { productId, rating, comment, orderId } = body;
    
    // Validate required fields
    if (!productId || !rating || rating < 1 || rating > 5) {
      return Response.json({ error: 'Product ID and valid rating (1-5) are required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    
    // Get user from token
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

    // Check if user has already reviewed this product
    const existingReview = await db.collection('reviews').findOne({
      productId: new ObjectId(productId),
      userId: userId
    });

    if (existingReview) {
      return Response.json({ error: 'You have already reviewed this product' }, { status: 400 });
    }

    // Get user details
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // Create the review
    const review = {
      productId: new ObjectId(productId),
      userId: userId,
      userName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
      userEmail: user.email,
      rating: parseInt(rating),
      comment: comment || '',
      orderId: orderId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('reviews').insertOne(review);

    // Update product average rating
    await updateProductRating(db, productId);

    return Response.json({ 
      success: true, 
      reviewId: result.insertedId,
      message: 'Review submitted successfully'
    });
  } catch (err) {
    return Response.json({ error: 'Failed to submit review', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
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
    }
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
} 