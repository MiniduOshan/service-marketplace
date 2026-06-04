const token = '432b4373eb4e63a5666d1b330b8e71954d20e7a50f488fe297344744b04db7c7';
fetch('http://localhost:8000/api/v1/auth/me', {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}).then(r => r.json().then(data => console.log('STATUS:', r.status, 'BODY:', data)));
