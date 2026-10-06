const test = async () => {
  const baseUrl = "http://localhost:5000";

  console.log("--- 1. Testing DL Validation (Valid DL) ---");
  try {
    const res1 = await fetch(`${baseUrl}/api/enquiries/validate-dl`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        drugLicenseNumber: "20B/MH-TZ-45678",
        state: "Maharashtra",
      }),
    });
    console.log("Status:", res1.status);
    const data1 = await res1.json();
    console.log("Data:", JSON.stringify(data1, null, 2));
  } catch (e) {
    console.error("Test 1 error:", e);
  }

  console.log("\n--- 2. Testing DL Validation (Invalid DL) ---");
  try {
    const res2 = await fetch(`${baseUrl}/api/enquiries/validate-dl`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        drugLicenseNumber: "INVALID1",
        state: "Rajasthan",
      }),
    });
    console.log("Status:", res2.status);
    const data2 = await res2.json();
    console.log("Data:", JSON.stringify(data2, null, 2));
  } catch (e) {
    console.error("Test 2 error:", e);
  }

  console.log("\n--- 3. Testing Visual Aid PDF Generation ---");
  try {
    const res3 = await fetch(`${baseUrl}/api/products/cal-zeal-500/visual-aid`);
    console.log("Status:", res3.status);
    console.log("Content-Type:", res3.headers.get("content-type"));
    console.log("Content-Disposition:", res3.headers.get("content-disposition"));
    const arrayBuffer = await res3.arrayBuffer();
    console.log("PDF Buffer Size:", arrayBuffer.byteLength, "bytes");
    const header = Buffer.from(arrayBuffer.slice(0, 5)).toString();
    console.log("PDF Magic bytes header:", header); // Should be %PDF-
  } catch (e) {
    console.error("Test 3 error:", e);
  }

  console.log("\n--- 4. Testing B2B Enquiry Submission with WhatsApp ping & DL Validator ---");
  try {
    const res4 = await fetch(`${baseUrl}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Dr. Rajesh Sharma",
        email: "dr.rajesh@orthocare.com",
        phone: "9876543210",
        city: "Jaipur",
        state: "Rajasthan",
        companyName: "Sharma Orthopaedic Hospital",
        drugLicenseNumber: "DL-RAJ-2024-55891",
        productSlug: "cal-zeal-500",
        quantity: "500 Boxes",
        message: "Need exclusive PCD franchise for Jaipur district.",
        enquiryType: "FRANCHISE",
      }),
    });
    console.log("Status:", res4.status);
    const data4 = await res4.json();
    console.log("Data:", JSON.stringify(data4, null, 2));
  } catch (e) {
    console.error("Test 4 error:", e);
  }
};

test();
