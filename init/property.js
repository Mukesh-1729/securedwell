const mongoose = require('mongoose');
const Property = require('../models/property'); // Adjust path if needed

const MONGO_URI = 'mongodb://localhost:27017/securedwell2'; // Replace with your DB name
// const MONGO_URI = 'mongodb+srv://admin:admin@cluster0.zqzqy.mongodb.net/securedwell2?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your DB name

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const seedProperties = async () => {
  try {
    await Property.deleteMany(); // Optional: Clean slate

    const dummySellerId = new mongoose.Types.ObjectId(); // Replace with real seller _id if needed
    const sampleImages = [
      'https://via.placeholder.com/600x400.png?text=Property+1',
      'https://via.placeholder.com/600x400.png?text=Property+2',
      'https://via.placeholder.com/600x400.png?text=Property+3'
    ];

    const sampleLocations = ['Hyderabad', 'Bangalore', 'Chennai', 'Delhi', 'Mumbai'];

    const sampleProperties = [];

    for (let i = 1; i <= 100; i++) {
      const property = {
        seller: dummySellerId,
        title: `Sample Property ${i}`,
        description: `This is a detailed description of Sample Property ${i}. It is a well-located and spacious property.`,
        price: 500000 + (i * 10000), // Incremental price
        location: `${sampleLocations[i % sampleLocations.length]} Sector ${i % 10}`,
        bedrooms: 2 + (i % 4),
        bathrooms: 1 + (i % 3),
        squareFeet: 800 + (i * 10),
        images: [sampleImages[i % sampleImages.length]],
        landDocument: `/documents/land_doc_${i}.pdf`,
        permitOrder: `/documents/permit_order_${i}.pdf`,
        status: 'Pending', // Always seed as pending
        createdAt: new Date()
      };

      sampleProperties.push(property);
    }

    await Property.insertMany(sampleProperties);
    console.log('✅ 100 dummy properties inserted!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Seeding error:', err);
    mongoose.connection.close();
  }
};

seedProperties();
