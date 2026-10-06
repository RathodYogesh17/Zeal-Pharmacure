import fs from "fs";
import path from "path";

const testCareerFlow = async () => {
  try {
    console.log("1. Testing GET /api/careers/jobs...");
    const jobsRes = await fetch("http://localhost:5000/api/careers/jobs");
    const jobsData = await jobsRes.json();
    console.log("Jobs Status:", jobsRes.status);
    console.log("Total Active Vacancies:", jobsData.data?.total);
    console.log(
      "Sample Vacancies:",
      jobsData.data?.jobs?.map((j) => `${j.title} (${j.location})`)
    );

    const firstJob = jobsData.data?.jobs?.[0];
    if (firstJob) {
      console.log(`\n2. Testing GET /api/careers/jobs/${firstJob.slug}...`);
      const singleJobRes = await fetch(`http://localhost:5000/api/careers/jobs/${firstJob.slug}`);
      const singleJobData = await singleJobRes.json();
      console.log("Single Job Fetch Status:", singleJobRes.status);
      console.log("Fetched Job Title:", singleJobData.data?.title);
    }

    console.log("\n3. Testing POST /api/careers/apply (Candidate Application with Resume)...");
    // Create a dummy resume text file for testing upload
    const dummyResumePath = path.resolve(process.cwd(), "scratch_test_resume.pdf");
    fs.writeFileSync(dummyResumePath, "%PDF-1.4 Resume of Rahul Verma - B.Pharma Medical Representative");

    const formData = new FormData();
    formData.append("fullName", "Rahul Verma");
    formData.append("email", "rahul.verma.mr@gmail.com");
    formData.append("phone", "9876543210");
    formData.append("whatsappNumber", "9876543210");
    formData.append("currentCity", "Surat");
    formData.append("currentState", "Gujarat");
    formData.append("preferredLocation", "Surat, Navsari, or South Gujarat HQ");
    formData.append("positionAppliedFor", "Medical Representative (MR) - PCD Franchise Division");
    formData.append("department", "Sales & Marketing");
    formData.append("qualification", "B.Pharma (Gujarat Technological University)");
    formData.append("totalExperienceYears", "2.5 Years (Pharma PCD Sales)");
    formData.append("currentCompany", "Apex Lifesciences Pvt Ltd");
    formData.append("currentDesignation", "Medical Representative");
    formData.append("currentCtc", "₹3.0 LPA");
    formData.append("expectedCtc", "₹4.2 LPA");
    formData.append("noticePeriod", "15 Days");
    formData.append("coverNote", "I have 2.5 years of strong doctor relationships in Surat Ortho and Derma segments. Eager to join Zeal Pharma.");
    if (firstJob) {
      formData.append("jobOpeningId", firstJob._id);
    }

    const fileBuffer = fs.readFileSync(dummyResumePath);
    const blob = new Blob([fileBuffer], { type: "application/pdf" });
    formData.append("resume", blob, "Rahul_Verma_CV.pdf");

    const applyRes = await fetch("http://localhost:5000/api/careers/apply", {
      method: "POST",
      body: formData,
    });

    const applyData = await applyRes.json();
    console.log("Apply Status:", applyRes.status);
    console.log("Apply Response:", JSON.stringify(applyData, null, 2));

    // Cleanup scratch file
    if (fs.existsSync(dummyResumePath)) {
      fs.unlinkSync(dummyResumePath);
    }
  } catch (err) {
    console.error("Career flow test failed:", err);
  }
};

testCareerFlow();
