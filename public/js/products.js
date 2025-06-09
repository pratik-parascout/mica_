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

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md overflow-hidden';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900">${product.name}</h3>
                <p class="mt-2 text-gray-600">${product.description || ''}</p>
                <button onclick="selectProduct('${product._id}', '${product.name}')" 
                        class="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Inquire About This Product
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function selectProduct(productId, productName) {
    // Store selected product in session storage
    sessionStorage.setItem('selectedProduct', JSON.stringify({
        id: productId,
        name: productName
    }));
    
    // Redirect to contact form
    window.location.href = '/contact.html';
}