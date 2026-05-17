const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());
    data.interests = formData.getAll("interest");

    try {
      const stored = JSON.parse(localStorage.getItem("voltix_inquiries") || "[]");
      stored.push({ ...data, submittedAt: new Date().toISOString() });
      localStorage.setItem("voltix_inquiries", JSON.stringify(stored));
      showSuccessMessage();
      contactForm.reset();
    } catch (err) {
      console.error("Form submission error:", err);
      alert("Something went wrong. Please try again or contact us via WhatsApp.");
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
  const msg = document.getElementById("successMessage");
  if (!msg) return;
  msg.classList.add("show");
  setTimeout(() => msg.classList.remove("show"), 6000);
}
