import * as util from "./util.mjs";

const API_BASE_URL = "/ecom/api/profile";
const UPLOAD_AVATAR_URL = `${API_BASE_URL}/upload-avatar`;
const SUBMIT_INFO_URL = `${API_BASE_URL}/submit-info`;

document.getElementById("upload-btn").addEventListener("click", () => {
  document.getElementById("avatar-upload").click();
});

const uploadBtn = document.getElementById("upload-btn");
document.getElementById("avatar-upload").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append("avatar", file);

    uploadBtn.querySelector(".button-spinner").classList.add("active");
    try {
      const response = await fetch(UPLOAD_AVATAR_URL, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        document.querySelectorAll(".user-avatar").forEach((avatar) => {
          avatar.src = `data:${result.avatar.mimeType};base64,${result.avatar.base64Image}`;
        });
      } else {
        throw new Error(result.message || "Failed to upload avatar");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      util.showErrorToast();
    } finally {
      uploadBtn.querySelector(".button-spinner").classList.remove("active");
    }
  }
});

const personalForm = document.getElementById("personal-info-form");
const savePersonalBtn = document.getElementById("save-personal");

personalForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const countryList = document.querySelector(".dropdown-selected");
  if (!countryList.getAttribute("data-value")) {
    countryList.classList.add("user-invalid");
    console.log("invalid input");

    return;
  }

  const personalInfo = {
    firstName: document.getElementById("first-name").value,
    lastName: document.getElementById("last-name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
  };

  const address = {
    addressLine1: document.getElementById("address-line1").value,
    addressLine2: document.getElementById("address-line2").value,
    country: document.querySelector(".dropdown-selected").getAttribute("data-value"),
    city: document.getElementById("city").value,
    zipCode: document.getElementById("zip-code").value,
  };

  const paymentMethod = {
    type: document.querySelector('input[name="payment"]:checked').value,
    cardNumber: document.getElementById("card-number").value,
    cvv: document.getElementById("cvv").value,
  };

  try {
    savePersonalBtn.querySelector(".button-spinner").classList.add("active");
    const response = await fetch(SUBMIT_INFO_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personalInfo, address, paymentMethod }),
    });
    if (!response.ok) {
      throw new Error("Failed to save personal info");
    }

    document.querySelector(".form-buttons .message").classList.remove("hidden");
  } catch (error) {
    console.error("Error saving personal info:", error);
    util.showErrorToast();
  } finally {
    savePersonalBtn.querySelector(".button-spinner").classList.remove("active");
  }
});

const cardDetails = document.getElementById("card-details");
document.querySelectorAll('input[name="payment"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    if (e.target.value === "card") {
      cardDetails.classList.remove("collapsed");
      setCardDetailsRequired(true);
    } else {
      cardDetails.classList.add("collapsed");
      setCardDetailsRequired(false);
    }
  });
});

function setCardDetailsRequired(required) {
  cardDetails.querySelectorAll("input").forEach((input) => {
    input.required = required;
  });
}

function toggleDropdown() {
  let dropdownList = document.querySelector(".dropdown-list");
  dropdownList.classList.toggle("show");
}

function selectCountry(value, flagUrl, countryName) {
  let selectedDiv = document.querySelector(".dropdown-selected");
  selectedDiv.setAttribute("data-value", value);
  selectedDiv.innerHTML = `<img src="${flagUrl}" alt="${countryName}"><span>${countryName}</span><i class="fa-solid fa-chevron-down arrow"></i>`;
  document.querySelector(".dropdown-list").classList.remove("show");
}

document.addEventListener("click", function (event) {
  let dropdown = document.querySelector(".custom-dropdown");
  if (!dropdown.contains(event.target)) {
    document.querySelector(".dropdown-list").classList.remove("show");
  }
});

document.querySelector(".dropdown-selected").addEventListener("click", toggleDropdown);

document.querySelectorAll(".dropdown-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    selectCountry(item.getAttribute("data-value"), item.getAttribute("data-url"), item.textContent);

    document.querySelector(".dropdown-selected").classList.remove("user-invalid");
    document.querySelector(".dropdown-selected").classList.add("selected", "user-valid");
  });
});

(function loadProfile() {
  util.createFullPageOverlay(true);
  util
    .getUserProfile()
    .then((userData) => {
      if (userData.avatar) {
        document.querySelectorAll(".user-avatar").forEach((avatar) => {
          avatar.src = `data:${userData.avatar.mimeType};base64,${userData.avatar.base64Image}`;
        });
      }

      const profile = userData.profile;
      if (profile && profile.personalInfo) {
        document.getElementById("first-name").value = profile.personalInfo.firstName;
        document.getElementById("last-name").value = profile.personalInfo.lastName;
        document.getElementById("email").value = profile.personalInfo.email;
        document.getElementById("phone").value = profile.personalInfo.phone;
      }

      if (profile && profile.address) {
        document.getElementById("address-line1").value = profile.address.addressLine1;
        document.getElementById("address-line2").value = profile.address.addressLine2;
        console.log(profile.address.country);

        document.querySelector(".dropdown-item[data-value='" + profile.address.country + "']").click();
        document.querySelector(".dropdown-selected").classList.remove("user-valid");
        document.getElementById("city").value = profile.address.city;
        document.getElementById("zip-code").value = profile.address.zipCode;
      }

      if (profile && profile.paymentMethod) {
        if (profile.paymentMethod.type === "card") {
          document.getElementById("card").checked = true;
          document.getElementById("card-details").classList.remove("collapsed");
          document.getElementById("card-number").value = profile.paymentMethod.cardNumber;
          document.getElementById("cvv").value = profile.paymentMethod.cvv;
          setCardDetailsRequired(true);
        } else {
          document.getElementById("cod").checked = true;
          setCardDetailsRequired(false);
        }
      }
    })
    .finally(() => {
      util.removeFullPageOverlay();
    });
})();
