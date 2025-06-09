document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupEventListeners();
  fetchProducts();
});

async function checkAuth() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/admin/login.html';
      return;
    }

    const response = await fetch('/api/admin/check-auth', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (!data.success) {
      window.location.href = '/admin/login.html';
    }
  } catch (error) {
    console.error('Error checking auth:', error);
    window.location.href = '/admin/login.html';
  }
}

// Expose editProduct and deleteProduct to global scope for dynamic HTML onclick
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;

function setupEventListeners() {
  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await fetch('/api/admin/logout', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          localStorage.removeItem('token');
        }
        window.location.href = '/admin/login.html';
      } catch (error) {
        console.error('Error logging out:', error);
        window.location.href = '/admin/login.html';
      }
    });
  }

  // Add product button
  const addProductBtn = document.getElementById('add-product-btn');
  if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
      showModal();
    });
  }

  // Close modal button
  const closeModalBtn = document.getElementById('close-modal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      hideModal();
    });
  }

  // Product form
  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', handleProductSubmit);
  }
}

async function fetchProducts() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/admin/login.html';
      return;
    }

    const response = await fetch('/api/products', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (data.success) {
      displayProducts(data.data);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

function displayProducts(products) {
  // Use tbody for products-table
  const tbody = document.querySelector('#products-table tbody') || document.getElementById('products-table');
  if (!tbody) return;
  tbody.innerHTML = '';

  products.forEach((product) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <img src="${product.image}" alt="${product.name}" class="h-20 w-20 object-cover rounded">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">${product.name}</td>
            <td class="px-6 py-4">${product.description || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <button onclick="editProduct('${product._id}')" 
                        class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                <button onclick="deleteProduct('${product._id}')"
                        class="text-red-600 hover:text-red-900">Delete</button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

async function handleProductSubmit(e) {
  e.preventDefault();

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/admin/login.html';
    return;
  }

  const form = e.target;
  const formData = new FormData();

  formData.append('name', form['product-name'].value);
  formData.append('description', form['product-description'].value);

  const imageFile = form['product-image'].files[0];
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const productId = form.dataset.productId;
  const method = productId ? 'PUT' : 'POST';
  const url = productId ? `/api/products/${productId}` : '/api/products';

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      hideModal();
      fetchProducts();
    } else {
      alert('Error saving product. Please try again.');
    }
  } catch (error) {
    console.error('Error saving product:', error);
    alert('Error saving product. Please try again.');
  }
}

async function editProduct(productId) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/admin/login.html';
      return;
    }

    const response = await fetch(`/api/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (data.success) {
      const product = data.data;
      document.getElementById('product-name').value = product.name;
      document.getElementById('product-description').value =
        product.description || '';
      document.getElementById('product-form').dataset.productId = productId;
      document.getElementById('modal-title').textContent = 'Edit Product';
      showModal();
    }
  } catch (error) {
    console.error('Error fetching product:', error);
  }
}

async function deleteProduct(productId) {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/admin/login.html';
        return;
      }

      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        fetchProducts();
      } else {
        alert('Error deleting product. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  }
}

function showModal() {
  document.getElementById('product-modal').classList.remove('hidden');
}

function hideModal() {
  document.getElementById('product-modal').classList.add('hidden');
  document.getElementById('product-form').reset();
  document.getElementById('product-form').dataset.productId = '';
  document.getElementById('modal-title').textContent = 'Add New Product';
}
