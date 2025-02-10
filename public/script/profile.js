import * as util from './util.js';

// API Endpoints
const API_BASE_URL = 'http://localhost:3000/api/profile';
const UPLOAD_AVATAR_URL = `${API_BASE_URL}/upload-avatar`;
const SUBMIT_INFO_URL = `${API_BASE_URL}/submit-info`;

// Avatar Upload
document.getElementById('upload-btn').addEventListener('click', () => {
  document.getElementById('avatar-upload').click();
});

document.getElementById('avatar-upload').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch(UPLOAD_AVATAR_URL, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        document.querySelectorAll('.user-avatar').forEach(avatar => {
          avatar.src = result.filePath;
        });

      } else {
        throw new Error(result.message || 'Failed to upload avatar');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  }
});

// Personal Info Form
const personalForm = document.getElementById('personal-info-form');
const savePersonalBtn = document.getElementById('save-personal');

personalForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const personalInfo = {
    firstName: document.getElementById('first-name').value,
    lastName: document.getElementById('last-name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
  };

  try {
    console.log(personalInfo);
    const response = await fetch(SUBMIT_INFO_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personalInfo }),
    });
    const result = await response.json();
    if (response.ok) {
    } else {
      throw new Error(result.message || 'Failed to save personal info');
    }
  } catch (error) {
    console.error('Error saving personal info:', error);
  }
});

// Address Form
const addressForm = document.getElementById('address-form');
const saveAddressBtn = document.getElementById('save-address');

addressForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const address = {
    addressLine1: document.getElementById('address-line1').value,
    addressLine2: document.getElementById('address-line2').value,
    country: document.querySelector('.dropdown-selected').getAttribute('data-value'),
    city: document.getElementById('city').value,
    zipCode: document.getElementById('zip-code').value,
  };

  try {
    const response = await fetch(SUBMIT_INFO_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    });
    const result = await response.json();
    if (response.ok) {
    } else {
      throw new Error(result.message || 'Failed to save address');
    }
  } catch (error) {
    console.error('Error saving address:', error);
  }
});

// Payment Form
const paymentForm = document.getElementById('payment-form');
const cardDetails = document.getElementById('card-details');

document.querySelectorAll('input[name="payment"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (e.target.value === 'card') {
      cardDetails.classList.remove('collapsed');
    } else {
      cardDetails.classList.add('collapsed');
    }
  });
});

paymentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const paymentMethod = {
    type: document.querySelector('input[name="payment"]:checked').value,
    cardNumber: document.getElementById('card-number').value,
    cvv: document.getElementById('cvv').value,
  };

  try {
    const response = await fetch(SUBMIT_INFO_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethod }),
    });
    const result = await response.json();
    if (response.ok) {
    } else {
      throw new Error(result.message || 'Failed to save payment info');
    }
  } catch (error) {
    console.error('Error saving payment info:', error);
  }
});

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

// Close dropdown when clicking outside
document.addEventListener("click", function(event) {
  let dropdown = document.querySelector(".custom-dropdown");
  if (!dropdown.contains(event.target)) {
    document.querySelector(".dropdown-list").classList.remove("show");
  }
});

document.querySelector('.dropdown-selected').addEventListener('click', toggleDropdown);

document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', (e) => {
    selectCountry(item.getAttribute('data-value'), item.getAttribute('data-url'), item.textContent);
    document.querySelector('.dropdown-selected').classList.add('selected', 'user-valid');
  });
});

(function loadProfile() {
  util.getUserProfile().then((profile) => {
    document.getElementById('first-name').value = profile.personalInfo.firstName;
    document.getElementById('last-name').value = profile.personalInfo.lastName;
    document.getElementById('email').value = profile.personalInfo.email;
    document.getElementById('phone').value = profile.personalInfo.phone;
  
    document.getElementById('address-line1').value = profile.address.addressLine1;
    document.getElementById('address-line2').value = profile.address.addressLine2;
    document.querySelector(".dropdown-item[data-value='"+profile.address.country+"']").click();
    document.querySelector('.dropdown-selected').classList.remove('user-valid');
    document.getElementById('city').value = profile.address.city;
    document.getElementById('zip-code').value = profile.address.zipCode;
  
    if(profile.paymentMethod.type === 'card') {
      document.getElementById('card').checked = true;
      document.getElementById('card-details').classList.remove('collapsed');
      document.getElementById('card-number').value = profile.paymentMethod.cardNumber;
      document.getElementById('cvv').value = profile.paymentMethod.cvv;
    } else {
      document.getElementById('cod').checked = true;
    }
  });
})();
