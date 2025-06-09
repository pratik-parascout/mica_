document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      email: form.email.value,
      password: form.password.value,
    };

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = '/admin/dashboard';
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('There was an error logging in. Please try again.');
    }
  });
});
