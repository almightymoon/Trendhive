import { connectToDatabase } from '@/app/utils/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    const db = await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const userId = searchParams.get('userId');
    
    if (productId) {
      // Get reviews for a specific product
      const reviews = await db.collection('reviews')
        .find({ productId: new ObjectId(productId) })
        .sort({ createdAt: -1 })
        .toArray();

      return Response.json(reviews);
    } else if (userId) {
      // Get reviews by a specific user
      const reviews = await db.collection('reviews')
        .find({ userId: userId })
        .sort({ createdAt: -1 })
        .toArray();

      return Response.json(reviews);
    } else {
      return Response.json({ error: 'Product ID or User ID is required' }, { status: 400 });
    }
  } catch (err) {
    return Response.json({ error: 'Failed to load reviews', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('POST /api/reviews - Request body:', body);
    const { productId, rating, comment, orderId, reviewId, action } = body;
    
    console.log('POST /api/reviews - Extracted values:', {
      action,
      reviewId,
      productId,
      rating,
      hasAction: !!action,
      hasReviewId: !!reviewId,
      isDeleteAction: action === 'delete'
    });
    
    // Handle delete action
    if (action === 'delete' && reviewId) {
      console.log('POST /api/reviews - Delete action detected for reviewId:', reviewId);
      console.log('POST /api/reviews - Headers:', Object.fromEntries(req.headers.entries()));
      console.log('POST /api/reviews - Full request body for delete:', JSON.stringify(body, null, 2));
      
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

      // Check if review exists and belongs to user
      const review = await db.collection('reviews').findOne({
        _id: new ObjectId(reviewId),
        userId: userId
      });

      if (!review) {
        return Response.json({ error: 'Review not found or you are not authorized to delete it' }, { status: 404 });
      }

      // Delete the review
      await db.collection('reviews').deleteOne({ _id: new ObjectId(reviewId) });

      // Update product average rating
      await updateProductRating(db, review.productId.toString());

      console.log('POST /api/reviews - Delete action completed, returning success response');
      return Response.json({ 
        success: true, 
        message: 'Review deleted successfully'
      });
    }
    
    // Handle regular review submission/update
    // Variables already declared above, no need to redeclare
    
    console.log('POST /api/reviews - NOT a delete action, processing as regular review submission/update');
    console.log('POST /api/reviews - Processing review submission/update:', {
      productId,
      rating,
      comment,
      reviewId,
      isUpdate: !!reviewId
    });
    
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

    // Get user details
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    if (reviewId) {
      console.log('POST /api/reviews - Updating existing review with ID:', reviewId);
      // Update existing review
      const existingReview = await db.collection('reviews').findOne({
        _id: new ObjectId(reviewId),
        userId: userId
      });

      console.log('POST /api/reviews - Found existing review:', existingReview ? 'Yes' : 'No');

      if (!existingReview) {
        console.log('POST /api/reviews - Review not found or unauthorized');
        return Response.json({ error: 'Review not found or you are not authorized to edit it' }, { status: 404 });
      }

      // Update the review
      await db.collection('reviews').updateOne(
        { _id: new ObjectId(reviewId) },
        {
          $set: {
            rating: parseInt(rating),
            comment: comment || '',
            updatedAt: new Date()
          }
        }
      );

      // Update product average rating
      await updateProductRating(db, productId);

      return Response.json({ 
        success: true, 
        message: 'Review updated successfully'
      });
    } else {
      console.log('POST /api/reviews - Creating new review');
      // Create new review
      // Check if user has already reviewed this product
      const existingReview = await db.collection('reviews').findOne({
        productId: new ObjectId(productId),
        userId: userId
      });

      console.log('POST /api/reviews - Found existing review for product:', existingReview ? 'Yes' : 'No');

      if (existingReview) {
        console.log('POST /api/reviews - User already reviewed this product');
        return Response.json({ error: 'You have already reviewed this product' }, { status: 400 });
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
    }
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

