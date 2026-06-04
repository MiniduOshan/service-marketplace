const token = '0phnozvfLALyLo4P6gw4kK5YDCNbdZNwFDcw9aYfpR7hU5DTRsn36YdmiwHYS1Qn';
fetch('http://localhost:8000/api/v1/auth/user/pricing-plan', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ pricing_plan_id: null })
}).then(r => r.json().then(data => console.log('STATUS:', r.status, 'BODY:', data)));
