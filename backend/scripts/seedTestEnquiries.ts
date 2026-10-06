import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Product from '../src/models/product.model';
import JobOpening from '../src/models/jobOpening.model';
import ProductEnquiry from '../src/models/productEnquiry.model';
import FranchiseEnquiry from '../src/models/franchiseEnquiry.model';
import CareerApplication from '../src/models/careerApplication.model';

const TARGET_PHONE = '9316227576';

async function seedTestEnquiries() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is missing in .env');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    // 1. Fetch reference products
    const products = await Product.find({}).limit(5);
    if (!products || products.length === 0) {
      console.warn('No products found in DB. Creating dummy fallback IDs...');
    }

    const prod1 = products[0] || { _id: new mongoose.Types.ObjectId(), name: 'Lipvas-40 Tablet' };
    const prod2 = products[1] || { _id: new mongoose.Types.ObjectId(), name: 'Telma 40' };
    const prod3 = products[2] || { _id: new mongoose.Types.ObjectId(), name: 'Pantop 40' };
    const prod4 = products[3] || { _id: new mongoose.Types.ObjectId(), name: 'Glycomet 500' };

    // 2. Fetch reference jobs
    const jobs = await JobOpening.find({}).limit(3);
    const job1 = jobs[0] || null;
    const job2 = jobs[1] || null;
    const job3 = jobs[2] || null;

    console.log('\n--- 1. SEEDING 3 SINGLE PRODUCT ENQUIRIES ---');
    const singleProductEnquiries = [
      {
        enquiryType: 'SINGLE_PRODUCT',
        product: prod1._id,
        name: 'Dr. Rajesh Patel (Cardiologist)',
        email: 'dr.rajeshpatel.cardio@gmail.com',
        phone: TARGET_PHONE,
        whatsappNumber: TARGET_PHONE,
        companyName: 'Patel Heart & Vascular Clinic',
        city: 'Surat',
        state: 'Gujarat',
        pincode: '395006',
        quantity: 200,
        quantityUnit: 'Boxes (10x10 Tablets)',
        message: `Requirement for ${prod1.name} for ongoing clinical cardiology practice. Please share current commercial quotation.`,
        status: 'NEW',
        source: 'PRODUCT_PAGE',
        isConfirmed: true,
        confirmedAt: new Date(),
      },
      {
        enquiryType: 'SINGLE_PRODUCT',
        product: prod2._id,
        name: 'Dr. Sunita Mehta',
        email: 'dr.sunitamehta.md@gmail.com',
        phone: TARGET_PHONE,
        whatsappNumber: TARGET_PHONE,
        companyName: 'Mehta Multispeciality Clinic',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380015',
        quantity: 350,
        quantityUnit: 'Boxes (10x10 Strips)',
        message: `Urgent inquiry for ${prod2.name}. Requesting batch availability and trade price list for clinic dispensing.`,
        status: 'NEW',
        source: 'PRODUCT_PAGE',
        isConfirmed: true,
        confirmedAt: new Date(),
      },
      {
        enquiryType: 'SINGLE_PRODUCT',
        product: prod3._id,
        name: 'Dr. Arvind Dave (Gastroenterologist)',
        email: 'dr.arvind.dave.gastro@gmail.com',
        phone: TARGET_PHONE,
        whatsappNumber: TARGET_PHONE,
        companyName: 'Dave Gastro & Liver Care',
        city: 'Vadodara',
        state: 'Gujarat',
        pincode: '390001',
        quantity: 500,
        quantityUnit: 'Strips (10x10 Tablets)',
        message: `Need regular supply of ${prod3.name}. Require Schedule M Certificate of Analysis (COA).`,
        status: 'NEW',
        source: 'WEBSITE',
        isConfirmed: true,
        confirmedAt: new Date(),
      },
    ];

    const createdSingle = await ProductEnquiry.insertMany(singleProductEnquiries);
    console.log(`Created ${createdSingle.length} Single Product Enquiries with phone: ${TARGET_PHONE}`);

    console.log('\n--- 2. SEEDING 3 BULK PRODUCT ENQUIRIES ---');
    const bulkProductEnquiries = [
      {
        enquiryType: 'BULK_PRODUCT',
        products: [
          {
            product: prod1._id,
            quantity: 2000,
            quantityUnit: 'Boxes',
            message: `${prod1.name} institutional supply`,
          },
          {
            product: prod2._id,
            quantity: 3000,
            quantityUnit: 'Boxes',
            message: `${prod2.name} regular batch`,
          },
        ],
        name: 'Surat Medical Wholesalers',
        email: 'surat.med.wholesalers@gmail.com',
        phone: TARGET_PHONE,
        whatsappNumber: TARGET_PHONE,
        companyName: 'Surat Wholesale Medico Hub',
        city: 'Surat',
        state: 'Gujarat',
        pincode: '395003',
        gstNumber: '24AAACS1234F1Z5',
        drugLicenseNumber: '20B-112233 / 21B-112233',
        quantity: 5000,
        quantityUnit: 'Master Cartons',
        message: 'Commercial bulk procurement for hospital supply chain across South Gujarat. Need best institutional rates and delivery schedule.',
        status: 'NEW',
        source: 'BULK_ENQUIRY',
        isConfirmed: true,
        confirmedAt: new Date(),
      },
      {
        enquiryType: 'BULK_PRODUCT',
        products: [
          {
            product: prod3._id,
            quantity: 4000,
            quantityUnit: 'Units',
            message: `${prod3.name} wholesale supply`,
          },
          {
            product: prod4._id,
            quantity: 4000,
            quantityUnit: 'Units',
            message: `${prod4.name} wholesale supply`,
          },
        ],
        name: 'Gujarat Pharma Syndicate',
        email: 'gujarat.pharma.syndicate@gmail.com',
        phone: TARGET_PHONE,
        whatsappNumber: TARGET_PHONE,
        companyName: 'Gujarat State Pharma Syndicate LLP',
        city: 'Rajkot',
        state: 'Gujarat',
        pincode: '360001',
        gstNumber: '24BBBCD5678K1Z9',
        drugLicenseNumber: '20B-445566 / 21B-445566',
        quantity: 8000,
        quantityUnit: 'Total Packs',
        message: 'Bulk distribution tender inquiry for retail chemist network. Looking for immediate dispatch terms and GST bill.',
        status: 'NEW',
        source: 'BULK_ENQUIRY',
        isConfirmed: true,
        confirmedAt: new Date(),
      },
      {
        enquiryType: 'BULK_PRODUCT',
        products: [
          {
            product: prod1._id,
            quantity: 2500,
            quantityUnit: 'Boxes',
            message: `${prod1.name} tender supply`,
          },
          {
            product: prod3._id,
            quantity: 2500,
            quantityUnit: 'Boxes',
            message: `${prod3.name} tender supply`,
          },
        ],
        name: 'Shreeji Medico Distributors',
        email: 'shreeji.medico.distributors@gmail.com',
        phone: TARGET_PHONE,
        whatsappNumber: TARGET_PHONE,
        companyName: 'Shreeji Medico Distributors Pvt Ltd',
        city: 'Bhavnagar',
        state: 'Gujarat',
        pincode: '364001',
        gstNumber: '24CCCDE9012M1Z3',
        drugLicenseNumber: '20B-778899 / 21B-778899',
        quantity: 5000,
        quantityUnit: 'Packs',
        message: 'Quarterly stock requirement for cardiac and gastro portfolio. Requesting proforma invoice with freight breakdown.',
        status: 'NEW',
        source: 'BULK_ENQUIRY',
        isConfirmed: true,
        confirmedAt: new Date(),
      },
    ];

    const createdBulk = await ProductEnquiry.insertMany(bulkProductEnquiries);
    console.log(`Created ${createdBulk.length} Bulk Product Enquiries with phone: ${TARGET_PHONE}`);

    console.log('\n--- 3. SEEDING 3 FRANCHISE / STOCKIST ENQUIRIES ---');
    const franchiseEnquiries = [
      {
        name: 'Mehta Pharma Associates',
        email: 'mehta.pharma.stockist@gmail.com',
        phone: TARGET_PHONE,
        whatsappNumber: TARGET_PHONE,
        companyName: 'Mehta Pharma Associates',
        businessType: 'PROPRIETORSHIP',
        address: 'Shop 12-14, Billiogo Textile Market Complex, Parvat Patiya',
        city: 'Surat',
        state: 'Gujarat',
        district: 'Surat',
        pincode: '395010',
        pharmaExperience: '10+ Years in Ethical & PCD Pharma Distribution',
        currentBusiness: 'Operating wholesale pharma distribution with 120+ active chemists and 35 doctors',
        investmentBudget: '₹10 Lakh - ₹15 Lakh',
        interestedDivisions: ['General Medicine', 'Cardiac & Diabetic Care', 'Derma Specialty'],
        hasGodownFacility: true,
        godownDetails: '1500 sq.ft licensed AC godown near Ring Road / Parvat Patiya',
        hasTransportFacility: true,
        transportDetails: '2 delivery vans for local city dispatch',
        preferredTerritory: 'Surat City & Varachha / Parvat Patiya Monopoly Territory',
        drugLicenseNumber: '20B-334455 / 21B-334455',
        gstNumber: '24DDDDA1122P1Z0',
        message: 'Interested in sole PCD franchise monopoly rights for Surat region. Ready for immediate initial billing and promotional rollout.',
        status: 'NEW',
        source: 'FRANCHISE_PAGE',
        isConfirmed: true,
        confirmedAt: new Date(),
      },
      {
        name: 'Apex Healthcare Agency',
        email: 'apex.healthcare.agency@gmail.com',
        phone: TARGET_PHONE,
        whatsappNumber: TARGET_PHONE,
        companyName: 'Apex Healthcare Agency LLP',
        businessType: 'PARTNERSHIP',
        address: 'B-402, Trade Square, Near S.G. Highway',
        city: 'Ahmedabad',
        state: 'Gujarat',
        district: 'Ahmedabad',
        pincode: '380054',
        pharmaExperience: '14 Years in PCD Franchise & Institutional Supply',
        currentBusiness: 'Authorized distributor for 3 established pharmaceutical companies',
        investmentBudget: '₹15 Lakh - ₹25 Lakh',
        interestedDivisions: ['Orthopaedic Specialist Range', 'Gastro Care', 'Antibiotics & Injectables'],
        hasGodownFacility: true,
        godownDetails: '2200 sq.ft WHO compliant warehouse storage facility',
        hasTransportFacility: true,
        transportDetails: 'Dedicated logistics partner and 3 dispatch vans',
        preferredTerritory: 'Ahmedabad West & S.G. Highway Zone Monopoly',
        drugLicenseNumber: '20B-667788 / 21B-667788',
        gstNumber: '24EEEFA3344Q1Z1',
        message: 'Seeking monopoly agreement with visual aids, MR samples, product brochures, and quarterly doctor promotional inputs.',
        status: 'NEW',
        source: 'FRANCHISE_PAGE',
        isConfirmed: true,
        confirmedAt: new Date(),
      },
      {
        name: 'Vanguard PCD Distributors',
        email: 'vanguard.pcd.dist@gmail.com',
        phone: TARGET_PHONE,
        whatsappNumber: TARGET_PHONE,
        companyName: 'Vanguard Pharma Distributors',
        businessType: 'PRIVATE_LIMITED',
        address: 'G-11, Alkapuri Commercial Hub, R.C. Dutt Road',
        city: 'Vadodara',
        state: 'Gujarat',
        district: 'Vadodara',
        pincode: '390007',
        pharmaExperience: '8 Years in Pharma Wholesale Distribution',
        currentBusiness: 'Wholesale supply to 80+ retail pharmacies across central Gujarat',
        investmentBudget: '₹8 Lakh - ₹12 Lakh',
        interestedDivisions: ['Pediatric Care', 'Neuro & Psychiatry', 'General Medicine'],
        hasGodownFacility: true,
        godownDetails: '1000 sq.ft temperature controlled medicine storage room',
        hasTransportFacility: true,
        transportDetails: 'Two wheeler and mini tempo delivery fleet',
        preferredTerritory: 'Vadodara District & Central Gujarat Territory',
        drugLicenseNumber: '20B-889900 / 21B-889900',
        gstNumber: '24FFFGB5566R1Z2',
        message: 'Looking for exclusive stockist rights with flexible credit period and monthly promotional product samples.',
        status: 'NEW',
        source: 'WEBSITE',
        isConfirmed: true,
        confirmedAt: new Date(),
      },
    ];

    const createdFranchise = await FranchiseEnquiry.insertMany(franchiseEnquiries);
    console.log(`Created ${createdFranchise.length} Franchise / Stockist Enquiries with phone: ${TARGET_PHONE}`);

    console.log('\n--- 4. SEEDING 3 CAREER APPLICATIONS ---');
    const careerApplications = [
      {
        applicationCode: `APP-${Date.now()}-01`,
        jobOpening: job1 ? job1._id : null,
        positionAppliedFor: 'Area Sales Manager (ASM)',
        department: 'Sales & Marketing',
        fullName: 'Hardik V. Solanki',
        email: 'hardik.solanki.pharma@gmail.com',
        phone: TARGET_PHONE,
        whatsappNumber: TARGET_PHONE,
        currentCity: 'Surat',
        currentState: 'Gujarat',
        preferredLocation: 'Surat / South Gujarat',
        qualification: 'B.Pharma + MBA in Pharmaceutical Marketing',
        totalExperienceYears: 4,
        currentCompany: 'Torrent Pharmaceuticals Ltd.',
        currentDesignation: 'Senior Medical Representative',
        currentCtc: '₹4.5 LPA',
        expectedCtc: '₹6.0 LPA',
        noticePeriod: '15 Days',
        skills: ['Team Leadership', 'Doctor Detailing', 'Chemist Audit', 'PCD Network Expansion'],
        coverNote: 'Passionate pharma sales leader with 4 years proven track record in ethical detailing and distributor relationship management.',
        status: 'NEW',
        source: 'WEBSITE_CAREERS',
        consentGiven: true,
        consentAt: new Date(),
      },
      {
        applicationCode: `APP-${Date.now()}-02`,
        jobOpening: job2 ? job2._id : null,
        positionAppliedFor: 'Quality Assurance & Regulatory Executive',
        department: 'Pharmacy & Quality Check',
        fullName: 'Priyanka S. Joshi',
        email: 'priyanka.joshi.qa@gmail.com',
        phone: TARGET_PHONE,
        whatsappNumber: TARGET_PHONE,
        currentCity: 'Ahmedabad',
        currentState: 'Gujarat',
        preferredLocation: 'Surat / Ahmedabad',
        qualification: 'M.Pharma (Quality Assurance)',
        totalExperienceYears: 3,
        currentCompany: 'Cadila Pharmaceuticals',
        currentDesignation: 'QA Officer',
        currentCtc: '₹3.8 LPA',
        expectedCtc: '₹5.2 LPA',
        noticePeriod: '30 Days',
        skills: ['Schedule M Compliance', 'COA Verification', 'Batch Release Protocol', 'Good Storage Practice'],
        coverNote: 'M.Pharma QA specialist with thorough knowledge of Schedule M, WHO-GMP guidelines, and pharmaceutical documentation.',
        status: 'NEW',
        source: 'WEBSITE_CAREERS',
        consentGiven: true,
        consentAt: new Date(),
      },
      {
        applicationCode: `APP-${Date.now()}-03`,
        jobOpening: job3 ? job3._id : null,
        positionAppliedFor: 'Warehouse & Store Executive',
        department: 'Warehouse & Storage',
        fullName: 'Karan M. Desai',
        email: 'karan.desai.warehouse@gmail.com',
        phone: TARGET_PHONE,
        whatsappNumber: TARGET_PHONE,
        currentCity: 'Surat',
        currentState: 'Gujarat',
        preferredLocation: 'Surat',
        qualification: 'D.Pharma / Science Graduate',
        totalExperienceYears: 2,
        currentCompany: 'Apollo Pharmacy Supply Depot',
        currentDesignation: 'Inventory & Dispatch Associate',
        currentCtc: '₹2.8 LPA',
        expectedCtc: '₹3.5 LPA',
        noticePeriod: 'Immediate Joiner',
        skills: ['FIFO / FEFO Inventory', 'Expiry Management', 'Cold Chain Handling', 'Inward / Outward Audits'],
        coverNote: 'Experienced in pharmaceutical warehouse operations, FEFO picking, temperature monitoring, and dispatch registers.',
        status: 'NEW',
        source: 'WEBSITE_CAREERS',
        consentGiven: true,
        consentAt: new Date(),
      },
    ];

    const createdCareers = await CareerApplication.insertMany(careerApplications);
    console.log(`Created ${createdCareers.length} Career Applications with phone: ${TARGET_PHONE}`);

    console.log('\n======================================================');
    console.log('✅ ALL 12 TEST ENQUIRIES & APPLICATIONS SEEDED SUCCESSFULLY!');
    console.log(`🎯 Recipient Phone: ${TARGET_PHONE}`);
    console.log('======================================================\n');
  } catch (error) {
    console.error('Failed to seed test enquiries:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seedTestEnquiries();
