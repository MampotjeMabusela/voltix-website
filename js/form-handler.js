const INQUIRY_EMAIL = "voltrixelectrical@protonmail.com";
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${encodeURIComponent(INQUIRY_EMAIL)}`;

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalLabel = submitBtn?.textContent || "Send Inquiry";

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      hideFormError();

      const formData = new FormData(contactForm);
      const interests = formData.getAll("interest");
      formData.delete("interest");
      formData.append("Primary interests", interests.join(", ") || "Not specified");
      formData.append("_subject", "New Voltix Website Inquiry");
      formData.append("_template", "table");
      formData.append("_captcha", "false");

      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to send inquiry");
      }

      showSuccessMessage();
      contactForm.reset();
    } catch (err) {
      console.error("Form submission error:", err);
      showFormError(
        "We could not send your inquiry. Please email us at " +
          INQUIRY_EMAIL +
          " or contact us on WhatsApp."
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    }
  });
}

function validateForm() {
  let isValid = true;

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
