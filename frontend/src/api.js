const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

function getHeaders(token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function fetchProducts() {
  const r = await fetch(`${API_BASE}/products`);
  return r.json();
}

export async function fetchCart(token) {
  const r = await fetch(`${API_BASE}/cart`, { headers: getHeaders(token) });
  return r.json();
}

export async function addToCart(productId, token) {
  const r = await fetch(`${API_BASE}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify({ productId, qty: 1 }),
  });
  return r.json();
}

export async function updateCartItem(id, qty, token) {
  const r = await fetch(`${API_BASE}/cart/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify({ qty })
  });
  return r.json();
}

export async function deleteCartItem(id, token) {
  const r = await fetch(`${API_BASE}/cart/${id}`, { method: 'DELETE', headers: getHeaders(token) });
  return r.json();
}

export async function checkout(name, email, token) {
  const r = await fetch(`${API_BASE}/checkout`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ name, email })
  });
  return r.json();
}

export async function register(payload) {
  const r = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return r.json();
}

export async function login(payload) {
  const r = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return r.json();
}

export async function fetchOrders(token) {
  const r = await fetch(`${API_BASE}/orders`, { headers: getHeaders(token) });
  return r.json();
}

