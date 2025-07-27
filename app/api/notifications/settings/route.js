import { connectToDatabase } from '@/app/utils/mongodb';
import jwt from 'jsonwebtoken';

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
    
    // Find notification settings for this user
    const settings = await db.collection('notificationSettings').findOne({ userId });
    
    // Return default settings if none exist
    const defaultSettings = {
      emailNotifications: true,
      pushNotifications: true,
      orderUpdates: true,
      promotions: true,
      newsletter: false
    };
    
    return Response.json(settings || defaultSettings);
  } catch (err) {
    return Response.json({ error: 'Failed to load notification settings', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { emailNotifications, pushNotifications, orderUpdates, promotions, newsletter, userId } = await req.json();
    const db = await connectToDatabase();

    const result = await db.collection('notificationSettings').updateOne(
      { userId },
      {
        $set: {
          emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
          pushNotifications: pushNotifications !== undefined ? pushNotifications : true,
          orderUpdates: orderUpdates !== undefined ? orderUpdates : true,
          promotions: promotions !== undefined ? promotions : true,
          newsletter: newsletter !== undefined ? newsletter : false,
          updatedAt: new Date(),
        }
      },
      { upsert: true }
    );
    
    return Response.json({ 
      success: true,
      message: 'Notification settings updated successfully' 
    });
  } catch (err) {
    return Response.json({ error: 'Failed to update notification settings', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
} 