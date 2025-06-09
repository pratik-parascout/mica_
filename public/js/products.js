document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
});

async function fetchProducts() {
  try {
    const response = await fetch('/api/products');
    const data = await response.json();

    if (data.success) {
      displayProducts(data.data);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

function displayProducts(products) {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = '';

  products.forEach((product) => {
    const card = document.createElement('div');
    card.className =
      'relative bg-white rounded-lg shadow-lg overflow-hidden group transition-transform transform hover:scale-105 border border-green-100';
    card.innerHTML = `
            <div class="relative">
                <img src="${
                  product.image ||
                  'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80'
                }" alt="${
      product.name
    }" class="w-full h-48 object-cover group-hover:opacity-80 transition">
                <div class="absolute inset-0 bg-gradient-to-t from-green-900 via-transparent to-transparent opacity-60"></div>
                <div class="absolute bottom-0 left-0 p-4">
                    <h3 class="text-lg font-semibold text-white drop-shadow">${
                      product.name
                    }</h3>
                </div>
            </div>
            <div class="p-4">
                <p class="mt-2 text-gray-700">${
                  product.description ||
                  'Natural mica stone, perfect for your needs.'
                }</p>
                <button onclick="selectProduct('${
                  product._id
                }', '${product.name.replace(/'/g, "\\'")}')" 
                        class="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow">
                    Inquire About This Product
                </button>
            </div>
        `;
    grid.appendChild(card);
  });
}

function selectProduct(productId, productName) {
  // Store selected product in session storage
  sessionStorage.setItem(
    'selectedProduct',
    JSON.stringify({
      id: productId,
      name: productName,
    })
  );

  // Redirect to contact form
  window.location.href = '/contact.html';
}
