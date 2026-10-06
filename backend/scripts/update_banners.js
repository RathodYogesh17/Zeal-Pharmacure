const mongoose = require('mongoose');

const mongoUri = 'mongodb://yogeshrd1708:yogesh1708@ac-2tdi0hf-shard-00-00.8rdbura.mongodb.net:27017,ac-2tdi0hf-shard-00-01.8rdbura.mongodb.net:27017,ac-2tdi0hf-shard-00-02.8rdbura.mongodb.net:27017/ZealPharma?ssl=true&replicaSet=atlas-sdtbqe-shard-0&authSource=admin&appName=Cluster0';

async function updateBanners() {
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
  const Content = mongoose.model('Content', new mongoose.Schema({}, { strict: false }), 'contents');
  
  const banners = [
    {
      id: 'banner-1',
      title: 'Partner with India’s Most Trusted Stockists Distribution Network',
      subtitle: 'Over 250+ WHO-GMP & ISO certified pharmaceutical formulations with authorized stockists distribution rights and high profit margins.',
      badge: 'Leading Stockists Distribution in India',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
      ctaText: 'Apply for Stockists Distribution',
      ctaLink: '/contact',
      isActive: true
    },
    {
      id: 'banner-2',
      title: 'WHO-GMP & ISO Certified Manufacturing Excellence',
      subtitle: 'State-of-the-art cGMP formulation facilities adhering to stringent international Schedule M quality standards for zero-defect products.',
      badge: 'Certified Quality Formulations',
      imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      ctaText: 'Explore Our Products',
      ctaLink: '/products',
      isActive: true
    },
    {
      id: 'banner-3',
      title: 'Complete Marketing & Visual Aid Promotional Support',
      subtitle: 'Boost your business with premium Visual Aids, MR Bags, Reminder Cards, Product Catch Covers, and fast 24-48 hours national dispatch.',
      badge: 'Stockists Distribution Benefits',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      ctaText: 'Request Stockists Kit',
      ctaLink: '/contact',
      isActive: true
    }
  ];

  const res = await Content.findOneAndUpdate(
    { key: 'banners' },
    { $set: { content: banners, updatedAt: new Date() } },
    { new: true, upsert: true }
  );

  console.log('Banners updated successfully! Count:', res.content?.length);
  await mongoose.disconnect();
}

updateBanners().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
