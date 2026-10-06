const test = async () => {
  console.log("--- TEST 1: Client fills form (isConfirmed: false) ---");
  const res1 = await fetch("http://localhost:5000/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Dr. Ramesh Kumar (Client)",
      email: "dr.ramesh@gmail.com",
      phone: "9316227576",
      city: "Ahmedabad",
      state: "Gujarat",
      productSlug: "cal-zeal-500",
      quantity: "400 Packs",
      message: "Testing double confirmation",
      enquiryType: "PRODUCT",
      isConfirmed: false,
    }),
  });
  const data1 = await res1.json();
  const enquiryId = data1.data?._id;
  console.log("Status:", res1.status);
  console.log("Enquiry ID:", enquiryId);
  console.log("Confirmation Required:", data1.data?.confirmationRequired);
  console.log("WhatsApp Alert Sent to Manager?:", data1.data?.whatsAppAlertSent || false);

  console.log("\n--- TEST 2: Client clicks CONFIRM BUTTON on modal ---");
  const res2 = await fetch(`http://localhost:5000/api/enquiries/${enquiryId}/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const data2 = await res2.json();
  console.log("Status:", res2.status);
  console.log("Message:", data2.message);
  console.log("Is Confirmed?:", data2.data?.isConfirmed);
  console.log("Confirmed At:", data2.data?.confirmedAt);
  console.log("WhatsApp Alert Dispatched to 9316227576?:", data2.data?.whatsAppAlertSent);
  console.log("Target Link for 9316227576:", data2.data?.adminDirectWhatsAppUrl);
};

test();
