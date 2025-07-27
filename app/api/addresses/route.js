import { connectToDatabase } from '@/app/utils/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb'; // Added for PUT/DELETE by _id

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
    
    // Find addresses for this user
    const addresses = await db.collection('addresses').find({ userId }).sort({ createdAt: -1 }).toArray();
    return Response.json(addresses);
  } catch (err) {
    return Response.json({ error: 'Failed to load addresses', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { fullName, address, city, state, country, zipCode, phone, isDefault, userId } = await req.json();
    const db = await connectToDatabase();

    // If this is the first address or marked as default, unset other defaults
    if (isDefault) {
      await db.collection('addresses').updateMany(
        { userId },
        { $set: { isDefault: false } }
      );
    }

    const result = await db.collection('addresses').insertOne({
      fullName,
      address,
      city,
      state,
      country,
      zipCode,
      phone,
      isDefault: isDefault || false,
      userId,
      createdAt: new Date(),
    });
    
    return Response.json({ 
      success: true, 
      addressId: result.insertedId,
      message: 'Address added successfully' 
    });
  } catch (err) {
    return Response.json({ error: 'Failed to add address', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { addressId, fullName, address, city, state, country, zipCode, phone, isDefault, userId } = await req.json();
    const db = await connectToDatabase();

    // If this address is marked as default, unset other defaults
    if (isDefault) {
      await db.collection('addresses').updateMany(
        { userId, _id: { $ne: new ObjectId(addressId) } }, // Use ObjectId for comparison
        { $set: { isDefault: false } }
      );
    }

    const result = await db.collection('addresses').updateOne(
      { _id: new ObjectId(addressId), userId }, // Use ObjectId for comparison
      { 
        $set: {
          fullName,
          address,
          city,
          state,
          country,
          zipCode,
          phone,
          isDefault: isDefault || false,
          updatedAt: new Date(),
        }
      }
    );
    
    if (result.modifiedCount === 0) {
      return Response.json({ error: 'Address not found or no changes made' }, { status: 404 });
    }
    
    return Response.json({ 
      success: true,
      message: 'Address updated successfully' 
    });
  } catch (err) {
    return Response.json({ error: 'Failed to update address', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { addressId, userId } = await req.json();
    const db = await connectToDatabase();

    const result = await db.collection('addresses').deleteOne({ _id: new ObjectId(addressId), userId }); // Use ObjectId for comparison
    
    if (result.deletedCount === 0) {
      return Response.json({ error: 'Address not found' }, { status: 404 });
    }
    
    return Response.json({ 
      success: true,
      message: 'Address deleted successfully' 
    });
  } catch (err) {
    return Response.json({ error: 'Failed to delete address', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 