const testDraftAndConfirmFlow = async () => {
  try {
    const draftPayload = {
      name: "Amit Sharma",
      phone: "8849166766",
      email: "amit.sharma.pharma@gmail.com",
      companyName: "Sharma Pharma Agency",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
      territoryDistrict: "Jaipur & North Rajasthan Monopoly",
      investmentBudget: "₹10 Lakh - ₹15 Lakh",
      pharmaExperience: "12 Years in Pharma Marketing & PCD",
      interestedDivisions: ["Derma & Cosmeceuticals", "Orthopaedic Specialist Range", "Pediatric Care"],
      hasGodownFacility: true,
      hasTransportFacility: true,
      drugLicenseNumber: "20B-987654 / 21B-987654",
      gstNumber: "08AABCS1234D1Z2",
      message: "Looking for sole PCD monopoly rights for Jaipur. Have existing network of 150+ doctors.",
      isConfirmed: false, // Draft submission
    };

    console.log("1. Submitting draft franchise enquiry...");
    const draftRes = await fetch("http://localhost:5000/api/enquiries/franchise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draftPayload),
    });
    const draftData = await draftRes.json();
    console.log("Draft response confirmationRequired:", draftData.data?.confirmationRequired);
    const enquiryId = draftData.data?._id;

    if (!enquiryId) {
      console.error("Failed to get enquiryId from draft");
      return;
    }

    console.log(`2. Confirming draft franchise enquiry ID: ${enquiryId}...`);
    const confirmRes = await fetch(`http://localhost:5000/api/enquiries/${enquiryId}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const confirmData = await confirmRes.json();
    console.log("Confirm Status:", confirmRes.status);
    console.log("Confirmed enquiry isConfirmed:", confirmData.data?.isConfirmed);
    console.log("WhatsApp alert sent:", confirmData.data?.whatsAppAlertSent);
    console.log("Territory District:", confirmData.data?.territoryDistrict);
  } catch (err) {
    console.error("Test failed:", err);
  }
};

testDraftAndConfirmFlow();
