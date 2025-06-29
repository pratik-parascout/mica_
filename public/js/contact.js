document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    setupForm();
});

async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (data.success) {
            populateProductSelect(data.data);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function populateProductSelect(products) {
    const select = document.getElementById('interestedProduct');
    const selectedProduct = JSON.parse(sessionStorage.getItem('selectedProduct'));
    
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product._id;
        option.textContent = product.name;
        
        if (selectedProduct && selectedProduct.id === product._id) {
            option.selected = true;
        }
        
        select.appendChild(option);
    });
}

function setupForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: form.name.value,
            email: form.email.value,
            mobileNumber: form.mobileNumber.value,
            interestedProduct: form.interestedProduct.value,
            message: form.message.value
        };
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Thank you for your inquiry! We will contact you soon.');
                form.reset();
                sessionStorage.removeItem('selectedProduct');
            } else {
                alert('There was an error submitting your inquiry. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting your inquiry. Please try again.');
        }
    });
}