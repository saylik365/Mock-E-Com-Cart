const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

function headers(token) {
  return { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' };
}

export async function login(data) {
  const res = await fetch(`${API}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify(data) });
  return res.json();
}
export async function register(data) {
  const res = await fetch(`${API}/auth/register`, { method: 'POST', headers: headers(), body: JSON.stringify(data) });
  return res.json();
}
export async function fetchProducts() {
  return (await fetch(`${API}/products`)).json();
}
export async function fetchCart(token) {
  return (await fetch(`${API}/cart`, { headers: headers(token) })).json();
}
export async function addToCart(productId, qty, token) {
  return (await fetch(`${API}/cart`, { method: 'POST', headers: headers(token), body: JSON.stringify({ productId, qty }) })).json();
}
export async function checkout(name, email, token) {
  return (await fetch(`${API}/checkout`, { method: 'POST', headers: headers(token), body: JSON.stringify({ name, email }) })).json();
}
