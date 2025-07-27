const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb+srv://moon:947131@cluster0.gvga3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = process.env.DB_NAME || "trendhive";

async function connectToDatabase() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log("Connected to MongoDB!");
  return client.db(dbName);
}

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    price: 89.99,
    shortDescription: "Premium wireless headphones with noise cancellation",
    description: "High-quality wireless Bluetooth headphones featuring active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.",
    category: "Electronics",
    mainImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500"
    ],
    brand: "AudioTech",
    featured: true,
    createdAt: new Date()
  },
  {
    name: "Smart Fitness Tracker",
    price: 149.99,
    shortDescription: "Advanced fitness tracking with heart rate monitoring",
    description: "Comprehensive fitness tracker with heart rate monitoring, GPS tracking, sleep analysis, and 7-day battery life. Tracks steps, calories, and 15+ workout modes.",
    category: "Electronics",
    mainImage: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500",
    images: [
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500",
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500"
    ],
    brand: "FitTech",
    featured: true,
    createdAt: new Date()
  },
  {
    name: "Premium Laptop Backpack",
    price: 79.99,
    shortDescription: "Durable laptop backpack with multiple compartments",
    description: "Water-resistant laptop backpack with dedicated 15-inch laptop compartment, multiple storage pockets, and ergonomic design. Perfect for students and professionals.",
    category: "Fashion",
    mainImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500"
    ],
    brand: "TravelPro",
    featured: true,
    createdAt: new Date()
  },
  {
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    shortDescription: "Comfortable organic cotton t-shirt",
    description: "Made from 100% organic cotton, this comfortable t-shirt is perfect for everyday wear. Available in multiple colors and sizes.",
    category: "Fashion",
    mainImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500"
    ],
    brand: "EcoWear",
    featured: false,
    createdAt: new Date()
  },
  {
    name: "Smart Home Speaker",
    price: 199.99,
    shortDescription: "Voice-controlled smart speaker with premium sound",
    description: "High-quality smart speaker with voice control, premium audio, and smart home integration. Compatible with all major smart home platforms.",
    category: "Electronics",
    mainImage: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500"
    ],
    brand: "SmartAudio",
    featured: false,
    createdAt: new Date()
  },
  {
    name: "Yoga Mat Premium",
    price: 49.99,
    shortDescription: "Non-slip yoga mat for all types of yoga",
    description: "Premium non-slip yoga mat made from eco-friendly materials. Perfect thickness for comfort and stability during all types of yoga practice.",
    category: "Sports",
    mainImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500"
    ],
    brand: "YogaLife",
    featured: false,
    createdAt: new Date()
  }
];

async function addSampleProducts() {
  try {
    const db = await connectToDatabase();
    
    // Clear existing products (optional - remove this line if you want to keep existing products)
    // await db.collection("products").deleteMany({});
    
    // Add sample products
    const result = await db.collection("products").insertMany(sampleProducts);
    
    console.log(`✅ Successfully added ${result.insertedCount} sample products to the database!`);
    console.log("Sample products added:");
    sampleProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding sample products:", error);
    process.exit(1);
  }
}

addSampleProducts(); 