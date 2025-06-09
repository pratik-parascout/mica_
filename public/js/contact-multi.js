document.addEventListener('DOMContentLoaded', async () => {
  // Fetch products for the select
  try {
    const response = await fetch('/api/products');
    const data = await response.json();
    if (data.success) {
      const select = document.getElementById('interestedProduct');
      select.innerHTML = '';
      data.data.forEach((product) => {
        const option = document.createElement('option');
        option.value = product._id;
        option.textContent = product.name;
        select.appendChild(option);
      });
      // Pre-select if sessionStorage has selectedProduct
      const selectedProductJson = sessionStorage.getItem('selectedProduct');
      if (selectedProductJson) {
        const selectedProduct = JSON.parse(selectedProductJson);
        Array.from(select.options).forEach((opt) => {
          if (selectedProduct.id === opt.value) {
            opt.selected = true;
          }
        });
      }
    }
  } catch (error) {
    console.error('Error loading products:', error);
  }

  // Handle form submission
  document
    .getElementById('contact-form')
    .addEventListener('submit', async (e) => {
      e.preventDefault();
      document.getElementById('success-message').classList.add('hidden');
      document.getElementById('error-message').classList.add('hidden');

      const select = document.getElementById('interestedProduct');
      const selectedOptions = Array.from(select.selectedOptions);
      const productIds = selectedOptions.map((opt) => opt.value);
      const productNames = selectedOptions.map((opt) => opt.textContent);

      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('mobileNumber').value,
        productIds,
        productNames,
        message: document.getElementById('message').value || '',
      };

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok)
          throw new Error(`Server responded with status: ${response.status}`);
        const data = await response.json();

        if (data.success) {
          document.getElementById('success-message').classList.remove('hidden');
          document.getElementById('contact-form').reset();
          sessionStorage.removeItem('selectedProduct');
        } else {
          document.getElementById('error-message').classList.remove('hidden');
        }
      } catch (error) {
        document.getElementById('error-message').classList.remove('hidden');
      }
    });
});
