import mongoose from "mongoose";
import dotenv from "dotenv";
import JobOpening from "../src/models/jobOpening.model";
import { generateUniqueSlug } from "../src/utils/slug";
import type { JobType } from "../src/types/career.types";

dotenv.config();

const SINGLE_LOCATION = "Zeal Pharma, 7015, Billingo, Parvat Patiya, Sita Nagar, Surat";

interface ISampleJob {
  title: string;
  department: string;
  location: string;
  jobType: JobType;
  experienceRequired: string;
  openingsCount: number;
  salaryRange: string;
  qualificationRequired: string;
  responsibilities: string[];
  requirements: string[];
  description: string;
  status: "OPEN" | "CLOSED" | "DRAFT";
  isActive: boolean;
  isFeatured: boolean;
}

export const WHOLESALE_STOCKIST_ROLES: ISampleJob[] = [
  {
    title: "Pharmacist",
    department: "Pharmacy & Quality Check",
    location: SINGLE_LOCATION,
    jobType: "FULL_TIME",
    experienceRequired: "1 - 4 Years (Registered Pharmacist)",
    openingsCount: 2,
    salaryRange: "₹3.0 LPA - ₹4.5 LPA",
    qualificationRequired: "B.Pharma / D.Pharma (Valid State Pharmacy Council License)",
    responsibilities: [
      "Medicine-related supervision across storage and dispatch.",
      "Check incoming and outgoing batch numbers and expiry dates.",
      "Product and tamper-evident packaging integrity verification.",
      "Provide proper temperature and humidity storage guidance (cold chain & dry room).",
      "Maintain regulatory registers, drug licensing compliance, and inspection documentation.",
    ],
    requirements: [
      "Must hold active Registered Pharmacist license.",
      "Knowledge of Good Storage & Distribution Practices (GSDP).",
      "Coordination: Purchase, Receiving, Checker, and Local Drug Authorities.",
      "Error Impact: Wrong medicine or expired stock could cause severe patient harm and statutory license cancellation.",
    ],
    description:
      "Responsible for statutory pharmaceutical oversight, expiry & batch verification, and storage compliance across our wholesale stockist distribution operations in Surat.",
    status: "OPEN",
    isActive: true,
    isFeatured: true,
  },
  {
    title: "Purchase Executive",
    department: "Purchase & Procurement",
    location: SINGLE_LOCATION,
    jobType: "FULL_TIME",
    experienceRequired: "2 - 5 Years (Pharma Wholesale Procurement)",
    openingsCount: 2,
    salaryRange: "₹3.5 LPA - ₹5.5 LPA",
    qualificationRequired: "B.Com / B.Pharma / Any Graduate with Pharma Buying Experience",
    responsibilities: [
      "Communicate with pharmaceutical manufacturers and authorized suppliers across India.",
      "Purchase medicines in bulk lots, negotiate prices, cash discounts, and payment terms.",
      "Compare supplier prices, lead times, and batch validity before finalizing deals.",
      "Prepare and issue Purchase Orders (PO) in ERP system.",
      "Coordinate incoming stock shipments and track delivery schedules.",
    ],
    requirements: [
      "Prior procurement experience in pharmaceutical stockist or distribution company.",
      "Commercial negotiation and inventory forecasting capabilities.",
      "Coordination: Manufacturers, Suppliers, Accounts, Inward, and Inventory Controller.",
      "Error Impact: Purchasing wrong products or paying excess prices ties up working capital and causes out-of-stock shortages.",
    ],
    description:
      "Manage bulk wholesale medicine procurement from top pharma manufacturers, negotiate commercial terms, and ensure 100% stock catalog availability.",
    status: "OPEN",
    isActive: true,
    isFeatured: true,
  },
  {
    title: "Receiving / Inward Executive",
    department: "Inward & Receiving",
    location: SINGLE_LOCATION,
    jobType: "FULL_TIME",
    experienceRequired: "1 - 3 Years (Godown Receiving)",
    openingsCount: 2,
    salaryRange: "₹2.2 LPA - ₹3.2 LPA",
    qualificationRequired: "Graduate / Higher Secondary (10+2)",
    responsibilities: [
      "Receive incoming medicine consignments and manufacturer cartons at loading bay.",
      "Inspect carton seals, physical condition, and check received quantity against lorry receipts (LR).",
      "Match incoming products line-by-line with manufacturer purchase invoice.",
      "Check batch numbers, manufacturing dates, and expiry dates on master cartons.",
      "Record incoming stock accurately into the computer system (Goods Inward Note).",
    ],
    requirements: [
      "Strong attention to detail and physical counting discipline.",
      "Basic computer entry skills for inventory logging.",
      "Coordination: Transporters, Purchase Executive, Pharmacist, and Store Executive.",
      "Error Impact: Missing shortages or accepting damaged cartons causes direct financial loss to the company.",
    ],
    description:
      "Inspect, count, and log inbound manufacturer medicine shipments at our Surat distribution hub, ensuring 100% physical invoice matching.",
    status: "OPEN",
    isActive: true,
    isFeatured: false,
  },
  {
    title: "Warehouse / Store Executive",
    department: "Warehouse & Storage",
    location: SINGLE_LOCATION,
    jobType: "FULL_TIME",
    experienceRequired: "2 - 5 Years (Pharma Godown Operations)",
    openingsCount: 2,
    salaryRange: "₹3.0 LPA - ₹4.5 LPA",
    qualificationRequired: "Graduate / Diploma in Supply Chain Management",
    responsibilities: [
      "Manage godown and warehouse layout across racks, cold room, and storage aisles.",
      "Arrange incoming medicines properly according to therapeutic category and SKU codes.",
      "Maintain physical stock records matching ERP system counts.",
      "Follow strict FIFO (First-In-First-Out) and FEFO (First-Expiry-First-Out) movement protocols.",
      "Maintain proper storage conditions (temperature, humidity, pest control, hygiene).",
    ],
    requirements: [
      "Demonstrated experience managing pharmaceutical storage and bin systems.",
      "Deep understanding of FEFO discipline and cold chain compliance.",
      "Coordination: Inward, Pickers, Pharmacist, and Warehouse Supervisor.",
      "Error Impact: Disorganized storage leads to expired medicine write-offs and delayed order fulfillment.",
    ],
    description:
      "Oversee proper pharmaceutical storage, bin locations, temperature controls, and strict FEFO stock rotation across our warehouse facility.",
    status: "OPEN",
    isActive: true,
    isFeatured: true,
  },
  {
    title: "Picker / Warehouse Staff",
    department: "Order Picking",
    location: SINGLE_LOCATION,
    jobType: "FULL_TIME",
    experienceRequired: "1 - 3 Years (Warehouse Picking)",
    openingsCount: 3,
    salaryRange: "₹2.0 LPA - ₹2.8 LPA",
    qualificationRequired: "10th / 12th Pass / Any Stream",
    responsibilities: [
      "Receive customer picking slips and order indents from order processing desk.",
      "Locate medicines quickly from warehouse racks and bin shelves.",
      "Pick correct product name, strength (mg/ml), pack size, quantity, and specified batch.",
      "Carefully move picked medicines to the verification and checking counter.",
    ],
    requirements: [
      "Quick reading skills for pharmaceutical brand names and formulation strengths.",
      "High picking speed with zero error rate in count and batch.",
      "Coordination: Store Executive, Checker, and Warehouse Supervisor.",
      "Error Impact: Picking wrong medicine or strength sends incorrect drugs to medical stores and end patients.",
    ],
    description:
      "Accurately identify and pick ordered formulations, strengths, and batches from warehouse racks according to chemist and hospital orders.",
    status: "OPEN",
    isActive: true,
    isFeatured: false,
  },
  {
    title: "Checker / Verification Executive",
    department: "Verification & Quality Inspection",
    location: SINGLE_LOCATION,
    jobType: "FULL_TIME",
    experienceRequired: "1 - 4 Years (Pharma Order Verification)",
    openingsCount: 2,
    salaryRange: "₹2.5 LPA - ₹3.6 LPA",
    qualificationRequired: "D.Pharma / B.Sc / B.Com / Experienced Pharma Checker",
    responsibilities: [
      "Double-verify product name, brand, dosage strength, and composition.",
      "Verify physical quantity against customer invoice / delivery challan.",
      "Verify batch number and expiry date matching the billing document.",
      "Check packaging condition, seal intactness, and bottle/strip integrity.",
      "Match all picked items with invoice and clear verified goods for packing.",
    ],
    requirements: [
      "Meticulous eye for detail in pharmaceutical packaging and batch numbering.",
      "High concentration and zero-tolerance policy for dispatch discrepancies.",
      "Coordination: Pickers, Invoicing, Packing Executive, and Pharmacist.",
      "Error Impact: Failing to catch wrong items results in returned deliveries, lost customer trust, and chemist claims.",
    ],
    description:
      "Perform mandatory second-line physical inspection verifying formulation name, batch, expiry, and quantity before orders are approved for packing.",
    status: "OPEN",
    isActive: true,
    isFeatured: true,
  },
  {
    title: "Packing Executive",
    department: "Packing & Parceling",
    location: SINGLE_LOCATION,
    jobType: "FULL_TIME",
    experienceRequired: "1 - 3 Years (Carton Packaging)",
    openingsCount: 2,
    salaryRange: "₹2.0 LPA - ₹2.8 LPA",
    qualificationRequired: "Higher Secondary (10+2) / Any Stream",
    responsibilities: [
      "Pack verified medicines safely and securely into corrugated boxes.",
      "Select appropriate box sizes, cushioning bubble wraps, and partitions for glass liquids/vials.",
      "Prepare parcel according to order size and carrier weight limits.",
      "Attach printed invoice, delivery challan, and destination labels securely on outer cartons.",
      "Keep sealed parcels organized at the dispatch staging bay ready for transport handover.",
    ],
    requirements: [
      "Good packing speed and knowledge of packaging materials.",
      "Careful handling of thermo-sensitive cold pack inserts and breakable items.",
      "Coordination: Checker, Dispatch Executive, and Loaders.",
      "Error Impact: Poor packaging leads to broken bottles, leaking liquids, and transit damage disputes.",
    ],
    description:
      "Package verified pharmaceutical formulations into tamper-proof cartons with protective bubble wrap, labels, and customer invoices for safe transport.",
    status: "OPEN",
    isActive: true,
    isFeatured: false,
  },
  {
    title: "Dispatch / Logistics Executive",
    department: "Dispatch & Logistics",
    location: SINGLE_LOCATION,
    jobType: "FULL_TIME",
    experienceRequired: "2 - 5 Years (Logistics Coordination)",
    openingsCount: 2,
    salaryRange: "₹3.0 LPA - ₹4.5 LPA",
    qualificationRequired: "Graduate / Diploma in Logistics",
    responsibilities: [
      "Prepare daily dispatch manifests, gate passes, and transport receipts (bilty).",
      "Handover parcels to regional transporters, courier partners, and local delivery fleet.",
      "Update real-time dispatch status and courier tracking numbers in the system.",
      "Maintain comprehensive tracking records until delivery confirmation is logged.",
      "Coordinate with delivery partners and transport agencies for route optimization.",
    ],
    requirements: [
      "Familiarity with transport hubs, courier cutoff timings, and regional logistics routes.",
      "Competency in dispatch software and shipping documentation.",
      "Coordination: Packing Team, Transporters, Delivery Executives, and Sales Team.",
      "Error Impact: Dispatch delays or wrong transport handover results in stockist stock-outs and customer frustration.",
    ],
    description:
      "Coordinate courier handovers, prepare transport manifests, update consignment tracking, and manage outbound logistics to regional stockists.",
    status: "OPEN",
    isActive: true,
    isFeatured: false,
  },
  {
    title: "Delivery Executive",
    department: "Local Delivery & Field Logistics",
    location: SINGLE_LOCATION,
    jobType: "FULL_TIME",
    experienceRequired: "1 - 4 Years (City Delivery)",
    openingsCount: 4,
    salaryRange: "₹2.2 LPA - ₹3.0 LPA + Fuel Allowance",
    qualificationRequired: "10th / 12th Pass with Valid Driving License",
    responsibilities: [
      "Deliver medicine consignments punctually to local medical stores, clinics, and hospitals.",
      "Collect signed delivery challans, shop stamps, or digital OTP Proof of Delivery (POD).",
      "Collect Cash on Delivery (COD) or signed cheques where applicable.",
      "Confirm successful delivery completion in real time with the dispatch desk.",
    ],
    requirements: [
      "Valid two-wheeler driving license and clean driving record.",
      "Polite customer handling and strong knowledge of local city road routes.",
      "Coordination: Dispatch Executive, Customer Support, and Retail Chemists.",
      "Error Impact: Late delivery or lost goods delays patient treatment at pharmacies and causes lost payment receipts.",
    ],
    description:
      "Perform punctual and secure local doorstep deliveries of pharmaceutical consignments to retail pharmacies and hospitals across the city.",
    status: "OPEN",
    isActive: true,
    isFeatured: false,
  },
  {
    title: "Sales Executive",
    department: "Sales & Customer Relations",
    location: SINGLE_LOCATION,
    jobType: "FULL_TIME",
    experienceRequired: "1 - 4 Years (Pharma Distribution Sales)",
    openingsCount: 3,
    salaryRange: "₹3.2 LPA - ₹5.0 LPA + Attractive Incentives",
    qualificationRequired: "B.Sc / B.Com / D.Pharma / Any Graduate",
    responsibilities: [
      "Contact retail medical stores, hospitals, clinics, and sub-distributors daily.",
      "Explain available medicine catalogs, price slabs, and wholesale schemes.",
      "Generate new chemist accounts and expand wholesale trade penetration.",
      "Book daily orders via phone calls, WhatsApp, and field visits.",
      "Follow up regularly with existing customers for repeat order cycles.",
    ],
    requirements: [
      "Strong relationship-building personality and communication skills.",
      "Knowledge of common generic and branded pharmaceutical formulations.",
      "Coordination: Chemists, Doctors, Order Processing, Accounts, and Dispatch.",
      "Error Impact: Poor follow-up leads to lost trade volume and chemist churn to competitor stockists.",
    ],
    description:
      "Drive daily wholesale medicine sales, build trusted trade partnerships with retail chemist shops and clinics, and achieve monthly distribution targets.",
    status: "OPEN",
    isActive: true,
    isFeatured: true,
  },
  {
    title: "Customer Support / Order Processing Executive",
    department: "Customer Support & Order Processing",
    location: SINGLE_LOCATION,
    jobType: "FULL_TIME",
    experienceRequired: "1 - 3 Years (Order Processing / Support)",
    openingsCount: 2,
    salaryRange: "₹2.6 LPA - ₹3.8 LPA",
    qualificationRequired: "Graduate with Good Communication & Typing Skills",
    responsibilities: [
      "Receive customer phone calls, orders, and inquiries promptly.",
      "Handle incoming wholesale trade inquiries received via website and email.",
      "Understand chemist medicine requirements and check real-time stock availability.",
      "Prepare sales quotations and enter verified orders into billing system.",
      "Coordinate closely with sales, warehouse picking, and dispatch teams for swift order release.",
    ],
    requirements: [
      "Pleasant voice, patient listening, and fast typing/entry skills.",
      "Familiarity with pharmaceutical product nomenclature.",
      "Coordination: Customers, Sales Executives, Warehouse Staff, and Billing Desk.",
      "Error Impact: Booking wrong quantities or missing customer urgent notes causes fulfillment delays and disputes.",
    ],
    description:
      "Handle inbound customer calls, qualify trade requirements, book verified sales orders into ERP, and coordinate swift warehouse dispatch.",
    status: "OPEN",
    isActive: true,
    isFeatured: false,
  },
  {
    title: "Website / Enquiry Executive",
    department: "Digital Enquiries & Lead Management",
    location: SINGLE_LOCATION,
    jobType: "FULL_TIME",
    experienceRequired: "1 - 3 Years (Digital CRM & Lead Handling)",
    openingsCount: 1,
    salaryRange: "₹2.8 LPA - ₹4.0 LPA",
    qualificationRequired: "B.Com / BBA / Graduate with Computer Expertise",
    responsibilities: [
      "Manage all wholesale and bulk stockist inquiries received through company website portal.",
      "Call interested medical store owners and institutional buyers within 15 minutes of inquiry.",
      "Understand customer molecule requirements, required pack quantities, and location.",
      "Forward qualified bulk leads immediately to the field sales and key account team.",
      "Maintain detailed inquiry tracking records, lead status, and CRM conversion analytics.",
    ],
    requirements: [
      "Excellent telephonic communication in Hindi and Gujarati.",
      "High responsiveness and disciplined CRM record management.",
      "Coordination: Website Visitors, Sales Team, Customer Support, and Management.",
      "Error Impact: Delayed response to web leads causes prospective bulk buyers to purchase from other distributors.",
    ],
    description:
      "Promptly respond to wholesale website inquiries, qualify prospective bulk medicine buyers, and route hot leads to sales managers for swift closure.",
    status: "OPEN",
    isActive: true,
    isFeatured: false,
  },
  {
    title: "Inventory / Data Entry Executive",
    department: "Inventory Management & Data Entry",
    location: SINGLE_LOCATION,
    jobType: "FULL_TIME",
    experienceRequired: "2 - 4 Years (Pharma ERP & Inventory Entry)",
    openingsCount: 2,
    salaryRange: "₹2.8 LPA - ₹4.2 LPA",
    qualificationRequired: "B.Com / B.Sc / Graduate with Advanced Excel & ERP Skills",
    responsibilities: [
      "Enter daily purchase inward bills and sales dispatch entries into ERP software.",
      "Update computer stock balances to match physical warehouse stock levels with zero variance.",
      "Maintain accurate batch number, manufacturing date, and expiry records for every SKU.",
      "Maintain updated product master information, wholesale MRP, and trade rate slabs.",
      "Generate daily inventory movement reports, slow-moving stock alerts, and near-expiry reports.",
    ],
    requirements: [
      "Typing speed >35 WPM and high numerical accuracy.",
      "Hands-on expertise with pharma software (Marg, Busy, Tally, or ERP).",
      "Coordination: Purchase, Store Executive, Warehouse Supervisor, and Accounts.",
      "Error Impact: Incorrect stock data entry leads to billing non-existent stock or stock-out blunders.",
    ],
    description:
      "Maintain 100% digital stock accuracy in ERP, log daily inward/sales transactions, track batch expiry timelines, and generate inventory analytics.",
    status: "OPEN",
    isActive: true,
    isFeatured: true,
  },
  {
    title: "Accounts Executive",
    department: "Accounts & Finance",
    location: SINGLE_LOCATION,
    jobType: "FULL_TIME",
    experienceRequired: "2 - 5 Years (Pharma Distribution Accounts)",
    openingsCount: 2,
    salaryRange: "₹3.2 LPA - ₹4.8 LPA",
    qualificationRequired: "B.Com / M.Com / Inter CA",
    responsibilities: [
      "Prepare GST-compliant sales invoices, delivery challans, and e-way bills.",
      "Manage customer outstanding balances, credit periods, and payment ledger reconciliations.",
      "Maintain accurate records of supplier purchase bills, transport freight, and godown expenses.",
      "Handle monthly GST filing (GSTR-1, GSTR-3B) and bank reconciliations.",
      "Coordinate with customers and suppliers regarding payment clearance, cheques, and RTGS.",
    ],
    requirements: [
      "Deep understanding of pharmaceutical GST rates, trade credit terms, and ledger management.",
      "Proficiency in Tally Prime / Marg ERP and double-entry accounting.",
      "Coordination: Retail Chemists, Suppliers, Sales Team, and Bank Authorities.",
      "Error Impact: Billing errors or delayed payment follow-up leads to bad debts, GST notices, and cash flow strain.",
    ],
    description:
      "Oversee GST billing, customer debtor ledgers, supplier payments, cash flow management, and monthly tax reconciliations.",
    status: "OPEN",
    isActive: true,
    isFeatured: false,
  },
  {
    title: "Warehouse Helper / Loader",
    department: "Warehouse & Physical Handling",
    location: SINGLE_LOCATION,
    jobType: "FULL_TIME",
    experienceRequired: "Entry Level / 1+ Year (Material Handling)",
    openingsCount: 3,
    salaryRange: "₹1.8 LPA - ₹2.5 LPA + Overtime",
    qualificationRequired: "Primary / Secondary Schooling",
    responsibilities: [
      "Carefully unload incoming manufacturer medicine master cartons from transport vehicles.",
      "Move medicine boxes safely using manual pallet jacks and hand trolleys.",
      "Arrange cartons neatly onto designated warehouse storage racks.",
      "Assist pickers and packing executives by moving packed parcels to the dispatch counter.",
      "Maintain godown floor cleanliness, pallet stacking order, and loading dock safety.",
    ],
    requirements: [
      "Good physical stamina and careful handling to prevent dropping fragile medicine boxes.",
      "Punctuality, reliability, and respect for godown safety instructions.",
      "Coordination: Inward Executive, Store Executive, Packing Team, and Warehouse Supervisor.",
      "Error Impact: Rough handling causes bottle breakages, crushed boxes, and warehouse safety hazards.",
    ],
    description:
      "Support daily physical loading, unloading, carton movement, and warehouse housekeeping to ensure smooth material flow.",
    status: "OPEN",
    isActive: true,
    isFeatured: false,
  },
  {
    title: "Warehouse Supervisor",
    department: "Warehouse Management & Operations",
    location: SINGLE_LOCATION,
    jobType: "FULL_TIME",
    experienceRequired: "4 - 8 Years (Pharma Distribution Supervisor)",
    openingsCount: 1,
    salaryRange: "₹4.5 LPA - ₹6.5 LPA",
    qualificationRequired: "Graduate / B.Pharma / Diploma in Supply Chain",
    responsibilities: [
      "Supervise and lead daily warehouse staff (pickers, checkers, packers, and helpers).",
      "Monitor end-to-end operational flow: inward receiving, binning, picking, checking, and packing.",
      "Ensure fast fulfillment turnaround with zero dispatch queue bottlenecks.",
      "Coordinate closely with sales, customer support, and dispatch teams.",
      "Resolve operational floor issues, stock mismatches, and maintain strict warehouse discipline.",
    ],
    requirements: [
      "Strong leadership and workforce management skills.",
      "Deep understanding of pharmaceutical wholesale distribution workflow.",
      "Coordination: Management, Pharmacist, Sales, Transporters, and Warehouse Workforce.",
      "Error Impact: Operational mismanagement leads to delayed order dispatches, stock damage, and customer dissatisfaction.",
    ],
    description:
      "Supervise daily godown operations, lead the 23-member operational team, maintain 100% order accuracy, and ensure rapid same-day dispatches.",
    status: "OPEN",
    isActive: true,
    isFeatured: true,
  },
];

const seedJobs = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/zeal_pharma";
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    // Remove all previous jobs so database only contains the 16 exact wholesale stockist roles at the single Surat location
    await JobOpening.deleteMany({});
    console.log("Cleared old jobs from database.");

    for (const item of WHOLESALE_STOCKIST_ROLES) {
      const slug = await generateUniqueSlug(item.title, async (cand) => {
        const exists = await JobOpening.findOne({ slug: cand });
        return Boolean(exists);
      });

      await JobOpening.create({
        ...item,
        slug,
      });
      console.log(`Created wholesale vacancy: ${item.title} at ${item.location}`);
    }

    console.log("All 16 Pharmaceutical Wholesale Stockist Distribution vacancies seeded successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding wholesale job openings:", err);
    process.exit(1);
  }
};

seedJobs();
