import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { getDashboardOverview } from "../src/services/dashboard.service";

dotenv.config();

const BASE_URL = "http://localhost:5000/api";

const logHeader = (title: string) => {
  console.log("\n================================================================================");
  console.log(`  ${title}`);
  console.log("================================================================================");
};

const runPhase3Suite = async () => {
  const report: {
    careerModule: boolean;
    cmsAboutUs: boolean;
    cmsCertifications: boolean;
    cmsFaqs: boolean;
    cmsBanners: boolean;
    dashboardAnalytics: boolean;
  } = {
    careerModule: false,
    cmsAboutUs: false,
    cmsCertifications: false,
    cmsFaqs: false,
    cmsBanners: false,
    dashboardAnalytics: false,
  };

  try {
    // -------------------------------------------------------------------------
    // 1. CAREER & JOB APPLICATIONS MODULE VERIFICATION
    // -------------------------------------------------------------------------
    logHeader("1. TESTING CAREER MODULE (Job Openings & PDF Resume Application)");
    const jobsRes = await fetch(`${BASE_URL}/careers/jobs`);
    const jobsData = await jobsRes.json();
    console.log(`Job Openings List Status: HTTP ${jobsRes.status}`);
    console.log(`Active Vacancies Found: ${jobsData.data?.total || 0}`);
    const vacancies = jobsData.data?.jobs || [];
    for (const v of vacancies) {
      console.log(`- [${v.department}] ${v.title} (${v.location}) - Exp: ${v.experienceRequired}`);
    }

    // Submit a candidate application
    const dummyCvPath = path.resolve(process.cwd(), "test_phase3_cv.pdf");
    fs.writeFileSync(dummyCvPath, "%PDF-1.4 Zeal Pharma Candidate CV");

    const formData = new FormData();
    formData.append("fullName", "Nikhil Shah");
    formData.append("email", "nikhil.shah.pharma@gmail.com");
    formData.append("phone", "9876543210");
    formData.append("currentCity", "Surat");
    formData.append("currentState", "Gujarat");
    formData.append("preferredLocation", "Surat HQ");
    formData.append("positionAppliedFor", "Area Sales Manager (ASM)");
    formData.append("department", "Sales & Marketing");
    formData.append("qualification", "B.Pharma + MBA");
    formData.append("totalExperienceYears", "5 Years");
    formData.append("expectedCtc", "₹6.5 LPA");
    formData.append("noticePeriod", "30 Days");

    const fileBuf = fs.readFileSync(dummyCvPath);
    formData.append("resume", new Blob([fileBuf], { type: "application/pdf" }), "Nikhil_Shah_Resume.pdf");

    const applyRes = await fetch(`${BASE_URL}/careers/apply`, {
      method: "POST",
      body: formData,
    });
    const applyData = await applyRes.json();
    console.log(`Candidate Application Submit Status: HTTP ${applyRes.status}`);
    console.log(`Uploaded Resume Path: ${applyData.data?.resumeUrl}`);
    console.log(`WhatsApp Alert Delivered to HR: ${applyData.data?.whatsAppAlertSent}`);

    if (fs.existsSync(dummyCvPath)) fs.unlinkSync(dummyCvPath);

    report.careerModule = jobsRes.status === 200 && applyRes.status === 201;

    // -------------------------------------------------------------------------
    // 2. CMS & CONTENT MODULE VERIFICATION (About Us, Certifications, FAQs, Banners)
    // -------------------------------------------------------------------------
    logHeader("2. TESTING CMS & CONTENT MODULE");

    // A. About Us
    const aboutRes = await fetch(`${BASE_URL}/content/about-us`);
    const aboutData = await aboutRes.json();
    console.log(`About Us Page Status: HTTP ${aboutRes.status}`);
    console.log(`Company Title: ${aboutData.data?.title}`);
    console.log(`Vision: "${aboutData.data?.content?.vision?.slice(0, 70)}..."`);
    console.log(`Stats Badges: ${aboutData.data?.content?.stats?.map((s: any) => `${s.label}: ${s.value}`).join(" | ")}`);
    report.cmsAboutUs = aboutRes.status === 200 && Boolean(aboutData.data?.content?.companyStory);

    // B. Manufacturing Certifications
    const certRes = await fetch(`${BASE_URL}/content/certifications`);
    const certData = await certRes.json();
    console.log(`\nCertifications Page Status: HTTP ${certRes.status}`);
    const certItems = certData.data?.content?.items || [];
    console.log(`Manufacturing Standards Count: ${certItems.length}`);
    for (const c of certItems) {
      console.log(`- [${c.code}] ${c.title} (Issuer: ${c.issuer})`);
    }
    report.cmsCertifications = certRes.status === 200 && certItems.length >= 3;

    // C. FAQs
    const faqRes = await fetch(`${BASE_URL}/content/faqs`);
    const faqData = await faqRes.json();
    console.log(`\nFAQs Page Status: HTTP ${faqRes.status}`);
    const faqItems = faqData.data?.content?.items || [];
    console.log(`Frequently Asked Questions Count: ${faqItems.length}`);
    for (const f of faqItems.slice(0, 3)) {
      console.log(`- Q: ${f.question}`);
    }
    report.cmsFaqs = faqRes.status === 200 && faqItems.length >= 3;

    // D. Homepage Banners
    const bannerRes = await fetch(`${BASE_URL}/content/banners`);
    const bannerData = await bannerRes.json();
    console.log(`\nHomepage Banners Status: HTTP ${bannerRes.status}`);
    const bannerItems = Array.isArray(bannerData.data?.content) ? bannerData.data.content : [];
    console.log(`Hero Carousel Banners Count: ${bannerItems.length}`);
    for (const b of bannerItems) {
      console.log(`- Banner: "${b.title}" [Badge: ${b.badge}] -> CTA: ${b.ctaText}`);
    }
    report.cmsBanners = bannerRes.status === 200 && bannerItems.length >= 2;

    // -------------------------------------------------------------------------
    // 3. DASHBOARD ANALYTICS MODULE VERIFICATION
    // -------------------------------------------------------------------------
    logHeader("3. TESTING DASHBOARD ANALYTICS & METRICS AGGREGATION");

    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/zeal_pharma";
    await mongoose.connect(mongoUri);

    const stats = await getDashboardOverview();
    console.log("Summary KPI Metrics:");
    console.log(`- Total Products in Catalog: ${stats.summary.totalProducts} (Active: ${stats.summary.activeProducts}, Featured: ${stats.summary.featuredProducts})`);
    console.log(`- Master Categories: ${stats.summary.totalCategories}`);
    console.log(`- Total Enquiries Received: ${stats.summary.totalEnquiries}`);
    console.log(`- Total PCD Franchise Monopoly Applications: ${stats.summary.totalFranchiseEnquiries}`);
    console.log(`- Total Career Applications: ${stats.summary.totalApplications} (New: ${stats.summary.newApplications}, Shortlisted: ${stats.summary.shortlistedApplications})`);
    console.log(`- Platform Doctor Rating: ★ ${stats.summary.averagePlatformRating}`);

    console.log("\nBreakdown Metrics:");
    console.log(`- Enquiries By Status: ${stats.enquiryBreakdowns.byStatus.map((s) => `${s.status}: ${s.count}`).join(", ")}`);
    console.log(`- Enquiries By Type: ${stats.enquiryBreakdowns.byType.map((t) => `${t.type}: ${t.count}`).join(", ")}`);
    console.log(`- Top Franchise States: ${stats.enquiryBreakdowns.byTopStates.map((st) => `${st.state}: ${st.count}`).join(", ")}`);
    console.log(`- Products by Dosage: ${stats.productBreakdowns.byDosageForm.map((df) => `${df.dosageForm}: ${df.count}`).join(", ")}`);

    console.log("\nRecent Activity Streams:");
    console.log(`- Recent Enquiries Loaded: ${stats.recentActivities.recentEnquiries.length} (with instant 1-tap WhatsApp links)`);
    console.log(`- Recent Job Candidates Loaded: ${stats.recentActivities.recentApplications.length}`);
    console.log(`- 30-Day Lead Trend Data Points: ${stats.trends.enquiriesLast30Days.length}`);

    report.dashboardAnalytics =
      stats.summary.totalProducts > 0 &&
      stats.summary.totalEnquiries > 0 &&
      stats.summary.totalApplications > 0 &&
      stats.enquiryBreakdowns.byStatus.length > 0;

    await mongoose.disconnect();

    // -------------------------------------------------------------------------
    // FINAL PHASE 3 SCORECARD
    // -------------------------------------------------------------------------
    logHeader("PHASE 3 COMPREHENSIVE VERIFICATION SCORECARD");
    console.log(`1. Career & Job Applications Module:             [${report.careerModule ? "PASS ✓" : "FAIL ✗"}]`);
    console.log(`2. CMS About Us Page:                            [${report.cmsAboutUs ? "PASS ✓" : "FAIL ✗"}]`);
    console.log(`3. CMS Manufacturing Certifications (WHO-GMP):   [${report.cmsCertifications ? "PASS ✓" : "FAIL ✗"}]`);
    console.log(`4. CMS PCD Franchise FAQs:                       [${report.cmsFaqs ? "PASS ✓" : "FAIL ✗"}]`);
    console.log(`5. CMS Homepage Hero Banners:                    [${report.cmsBanners ? "PASS ✓" : "FAIL ✗"}]`);
    console.log(`6. Dashboard Analytics & KPIs Aggregation:       [${report.dashboardAnalytics ? "PASS ✓" : "FAIL ✗"}]`);

    const passed = Object.values(report).filter(Boolean).length;
    const total = 6;
    const pct = Math.round((passed / total) * 100);

    console.log("\n================================================================================");
    console.log(`  OVERALL PHASE 3 RATING: ${pct}% (${passed}/${total} MODULES PERFECT)`);
    console.log("================================================================================");

    process.exit(pct === 100 ? 0 : 1);
  } catch (err) {
    console.error("Phase 3 test failed:", err);
    process.exit(1);
  }
};

runPhase3Suite();
