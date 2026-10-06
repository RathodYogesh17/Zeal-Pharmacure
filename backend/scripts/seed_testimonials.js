const mongoose = require('mongoose');
const mongoUri = 'mongodb://yogeshrd1708:yogesh1708@ac-2tdi0hf-shard-00-00.8rdbura.mongodb.net:27017,ac-2tdi0hf-shard-00-01.8rdbura.mongodb.net:27017,ac-2tdi0hf-shard-00-02.8rdbura.mongodb.net:27017/ZealPharma?ssl=true&replicaSet=atlas-sdtbqe-shard-0&authSource=admin&appName=Cluster0';

async function seedTestimonials() {
  await mongoose.connect(mongoUri);
  const Content = mongoose.model('Content', new mongoose.Schema({}, { strict: false }), 'contents');
  
  const testimonials = [
    {
      id: 'rev-1',
      name: 'Dr. Amit Shah',
      role: 'Consultant Physician & Cardiologist',
      clinic: 'Apex Multispeciality Hospital, Ahmedabad',
      rating: 5,
      comment: 'Zeal Pharma formulations like Telma and Pantop have demonstrated exceptional clinical efficacy in our outpatient department. Bioavailability and batch consistency are truly unmatched.',
      verified: true
    },
    {
      id: 'rev-2',
      name: 'Rajesh V. Patel',
      role: 'PCD Franchise Partner',
      clinic: 'Shreeji Pharma Distributors, Surat',
      rating: 5,
      comment: 'Associated with Zeal Pharma for over 4 years. The district monopoly support is genuine, dispatch is completed within 24 hours, and promotional visual aids are highest standard.',
      verified: true
    },
    {
      id: 'rev-3',
      name: 'Dr. Sneha Kulkarni',
      role: 'Consultant Gynecologist',
      clinic: 'Mothercare Maternity Hospital, Pune',
      rating: 5,
      comment: 'Prescribing Folvite and Shelcal formulations regularly. Patients have shown zero gastrointestinal tolerance issues. Highly recommend their WHO-GMP certified therapeutics.',
      verified: true
    },
    {
      id: 'rev-4',
      name: 'Sunil Aggarwal',
      role: 'Pharma Wholesaler & PCD Distributor',
      clinic: 'Aggarwal Lifesciences, Jaipur',
      rating: 5,
      comment: 'Top quality Alu-Alu and blister packaging. In the PCD pharmaceutical business, brand reputation is everything, and Zeal Pharma delivers 100% on its promises.',
      verified: true
    },
    {
      id: 'rev-5',
      name: 'Dr. Ramesh Menghrajani',
      role: 'Senior Pediatrician',
      clinic: 'Child Healthcare Clinic, Indore',
      rating: 5,
      comment: 'Calpol suspension and pediatric antibiotics are well accepted by children due to great palatable taste masking and precision dosing syringes.',
      verified: true
    },
    {
      id: 'rev-6',
      name: 'Vikas Deshmukh',
      role: 'Exclusive PCD Franchisee',
      clinic: 'Sai Care Distributors, Nagpur',
      rating: 5,
      comment: 'The monopoly rights protected my marketing investments. Sales margins are healthy and the customer support helpline resolves queries instantly.',
      verified: true
    }
  ];

  await Content.findOneAndUpdate(
    { key: 'testimonials' },
    { $set: { key: 'testimonials', title: 'Healthcare & Franchise Partner Testimonials', content: testimonials, updatedAt: new Date() } },
    { returnDocument: 'after', upsert: true }
  );

  console.log('Testimonials seeded in MongoDB successfully!');
  await mongoose.disconnect();
}
seedTestimonials().catch(err => {
  console.error(err);
  process.exit(1);
});
