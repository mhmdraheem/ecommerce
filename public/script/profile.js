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
        console.log(result);
        document.getElementById('avatar-img').src = result.filePath;
        alert('Avatar uploaded successfully!');
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
const editPersonalBtn = document.getElementById('edit-personal');
const savePersonalBtn = document.getElementById('save-personal');

editPersonalBtn.addEventListener('click', () => {
  personalForm.querySelectorAll('input').forEach(input => input.disabled = false);
  savePersonalBtn.disabled = false;
});

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
      personalForm.querySelectorAll('input').forEach(input => input.disabled = true);
      savePersonalBtn.disabled = true;
    } else {
      throw new Error(result.message || 'Failed to save personal info');
    }
  } catch (error) {
    console.error('Error saving personal info:', error);
  }
});

// Address Form
const addressForm = document.getElementById('address-form');
const editAddressBtn = document.getElementById('edit-address');
const saveAddressBtn = document.getElementById('save-address');

editAddressBtn.addEventListener('click', () => {
  addressForm.querySelectorAll('input, select').forEach(input => input.disabled = false);
  saveAddressBtn.disabled = false;
});

addressForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const address = {
    addressLine1: document.getElementById('address-line1').value,
    addressLine2: document.getElementById('address-line2').value,
    country: document.getElementById('country').value,
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
      addressForm.querySelectorAll('input, select').forEach(input => input.disabled = true);
      saveAddressBtn.disabled = true;
    } else {
      throw new Error(result.message || 'Failed to save address');
    }
  } catch (error) {
    console.error('Error saving address:', error);
  }
});

// Payment Form
const paymentForm = document.getElementById('payment-form');
const editPaymentBtn = document.getElementById('edit-payment');
const savePaymentBtn = document.getElementById('save-payment');
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

editPaymentBtn.addEventListener('click', () => {
  paymentForm.querySelectorAll('input').forEach(input => input.disabled = false);
  savePaymentBtn.disabled = false;
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
      paymentForm.querySelectorAll('input').forEach(input => input.disabled = true);
      savePaymentBtn.disabled = true;
    } else {
      throw new Error(result.message || 'Failed to save payment info');
    }
  } catch (error) {
    console.error('Error saving payment info:', error);
  }
});