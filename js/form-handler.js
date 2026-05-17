const INQUIRY_EMAIL = "voltrixelectrical@protonmail.com";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

const contactForm = document.getElementById("contactForm");
let cachedWeb3FormsKey = null;

if (contactForm) {
  if (new URLSearchParams(window.location.search).get("inquiry") === "sent") {
    showSuccessMessage();
    window.history.replaceState({}, "", window.location.pathname);
  }

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalLabel = submitBtn?.textContent || "Send Inquiry";

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      hideFormError();

      const payload = buildPayload(new FormData(contactForm));
      await submitInquiry(payload);

      showSuccessMessage();
      contactForm.reset();
    } catch (err) {
      console.error("Form submission error:", err);
      showFormError(
        err.message ||
          `We could not send your inquiry. Please email us at ${INQUIRY_EMAIL} or contact us on WhatsApp.`
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    }
  });
}

function buildPayload(formData) {
  const interests = formData.getAll("interest");
  return {
    name: formData.get("name")?.toString().trim() || "",
    email: formData.get("email")?.toString().trim() || "",
    phone: formData.get("phone")?.toString().trim() || "",
    propertyType: formData.get("propertyType")?.toString() || "",
    message: formData.get("message")?.toString().trim() || "",
    interests,
    subscribe: formData.get("subscribe") === "on",
  };
}

async function submitInquiry(payload) {
  const web3formsKey = await resolveWeb3FormsKey();
  if (web3formsKey) {
    await submitViaWeb3Forms(web3formsKey, payload);
    return;
  }

  const apiResponse = await fetch("/api/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const apiResult = await apiResponse.json().catch(() => ({}));

  if (apiResponse.ok && apiResult.success) {
    return;
  }

  throw new Error(
    apiResult.message ||
      "Inquiry delivery is not configured. Add WEB3FORMS_ACCESS_KEY in Vercel (recommended) or RESEND_API_KEY."
  );
}

async function resolveWeb3FormsKey() {
  const localKey = window.VOLTIX_CONFIG?.web3formsAccessKey?.trim();
  if (localKey) return localKey;

  if (cachedWeb3FormsKey !== null) return cachedWeb3FormsKey;

  try {
    const response = await fetch("/api/config", { cache: "no-store" });
    if (!response.ok) {
      cachedWeb3FormsKey = "";
      return "";
    }
    const config = await response.json();
    cachedWeb3FormsKey = config.web3formsAccessKey?.trim() || "";
    return cachedWeb3FormsKey;
  } catch {
    cachedWeb3FormsKey = "";
    return "";
  }
}

async function submitViaWeb3Forms(accessKey, payload) {
  const interestList = payload.interests?.length ? payload.interests.join(", ") : "Not specified";

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: "New Voltix Website Inquiry",
      from_name: payload.name,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      property_type: payload.propertyType,
      primary_interests: interestList,
      marketing_updates: payload.subscribe ? "Yes" : "No",
      message: [
        `Property type: ${payload.propertyType || "Not specified"}`,
        `Primary interests: ${interestList}`,
        `Marketing updates: ${payload.subscribe ? "Yes" : "No"}`,
        "",
        payload.message || "No additional message.",
      ].join("\n"),
    }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Unable to send inquiry via Web3Forms.");
  }
}

function validateForm() {
  let isValid = true;
  hideFormError();

  const name = document.getElementById("name");
  if (!name?.value.trim()) {
    showError("nameError", "Name is required");
    name?.classList.add("error");
    isValid = false;
  } else {
    clearError("nameError");
    name?.classList.remove("error");
  }

  const email = document.getElementById("email");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email?.value || "")) {
    showError("emailError", "Valid email is required");
    email?.classList.add("error");
    isValid = false;
  } else {
    clearError("emailError");
    email?.classList.remove("error");
  }

  const phone = document.getElementById("phone");
  const phoneRegex = /^[\d\s+\-()]{10,}$/;
  if (!phoneRegex.test(phone?.value || "")) {
    showError("phoneError", "Valid phone number is required");
    phone?.classList.add("error");
    isValid = false;
  } else {
    clearError("phoneError");
    phone?.classList.remove("error");
  }

  const propertyType = document.getElementById("propertyType");
  if (!propertyType?.value) {
    propertyType?.classList.add("error");
    isValid = false;
  } else {
    propertyType?.classList.remove("error");
  }

  const interests = contactForm?.querySelectorAll('input[name="interest"]:checked');
  if (!interests?.length) {
    isValid = false;
    showFormError("Please select at least one primary interest.");
  }

  return isValid;
}

function showError(id, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
}

function clearError(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = "";
  el.classList.remove("show");
}

function showSuccessMessage() {
  hideFormError();
  const msg = document.getElementById("successMessage");
  if (!msg) return;
  msg.classList.add("show");
  setTimeout(() => msg.classList.remove("show"), 8000);
}

function showFormError(message) {
  const msg = document.getElementById("formSubmitError");
  if (!msg) return;
  msg.textContent = message;
  msg.classList.add("show");
}

function hideFormError() {
  const msg = document.getElementById("formSubmitError");
  if (!msg) return;
  msg.textContent = "";
  msg.classList.remove("show");
}
