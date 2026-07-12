import axios from 'axios'

// Points at the real Express/PostgreSQL backend. Set VITE_API_URL in a
// .env file for whichever environment this is running in (see .env.example
// in this project's root) — e.g. http://localhost:4000/api for a backend
// running locally, or your deployed Railway URL + /api in production. Falls
// back to same-origin '/api', which only works if something (a dev proxy,
// or the backend and frontend being served from the same host) routes it
// through.
const baseURL = import.meta.env.VITE_API_URL || '/api'

export const http = axios.create({
  baseURL,
  timeout: 15000,
})

// ---- Auth token handling --------------------------------------------------
// The only thing this app keeps in localStorage now is the JWT itself — not
// products, bills, or any other business data, all of which live in
// Postgres and are fetched fresh from the API on every request. A token is
// the standard way to persist a login across page reloads without forcing a
// re-login every time; if you'd rather it not survive a browser restart,
// swap TOKEN_KEY's storage for sessionStorage instead of localStorage below.
const TOKEN_KEY = 'ayini-pos-v2:token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// A 401 means the token is missing/expired/invalid — clear it and bounce to
// login rather than leaving the app stuck showing failed requests. For every
// error, also replace axios's generic "Request failed with status code 4xx"
// with the backend's actual { error: "..." } message, since every existing
// catch (err) { ... err.message ... } block across this app (toasts, form
// errors, Login's error banner) already expects a human-readable message,
// not an HTTP status line.
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      setToken(null)
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login')
      }
    }
    const message = err.response?.data?.error || err.message
    return Promise.reject(new Error(message))
  }
)

// Postgres NUMERIC/DECIMAL columns come back from `pg` as strings (to avoid
// silent float rounding), and a couple of model functions pass raw DB rows
// through without renaming snake_case columns to camelCase. Rather than
// trust each endpoint's shape from memory, these helpers explicitly build
// the exact object shape every page already expects, reading whichever raw
// field is actually present.
function normalizeBillSummary(b) {
  return {
    id: b.id,
    createdAt: b.createdAt ?? b.created_at,
    customerName: b.customerName ?? b.customer_name,
    customerMobile: b.customerMobile ?? b.customer_mobile,
    paymentMode: b.paymentMode ?? b.payment_mode,
    creditStatus: b.creditStatus ?? b.credit_status,
    creditClosedMode: b.creditClosedMode ?? b.credit_closed_mode ?? null,
    creditClosedAt: b.creditClosedAt ?? b.credit_closed_at ?? null,
    items: b.items,
    total: Number(b.total),
  }
}

function normalizeBillDetail(b) {
  return {
    ...normalizeBillSummary(b),
    subtotal: Number(b.subtotal),
    gstAmount: Number(b.gstAmount ?? b.gst_amount),
    discountAmount: Number(b.discountAmount ?? b.discount_amount),
    discountPercent: Number(b.discountPercent ?? b.discount_percent ?? 0),
    items: (b.items || []).map((i) => ({
      name: i.name,
      price: Number(i.price),
      gst: Number(i.gst),
      qty: i.qty,
      lineTotal: Number(i.lineTotal ?? i.line_total ?? i.price * i.qty),
    })),
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

// ---- Auth ------------------------------------------------------------------
export async function login(username, password) {
  const { data } = await http.post('/auth/login', { username, password })
  setToken(data.token)
  return data.user
}

export function logout() {
  setToken(null)
}

export async function changePassword({ currentPassword, newPassword }) {
  const { data } = await http.post('/auth/change-password', { currentPassword, newPassword })
  return data
}

// ---- Dashboard -------------------------------------------------------------
export async function getDashboardStats({ from, to } = {}) {
  const { data } = await http.get('/dashboard/summary', { params: { from, to } })
  return data
}

export async function getSalesTrend({ from, to } = {}) {
  const { data } = await http.get('/dashboard/sales-trend', { params: { from, to } })
  return data
}

export async function getBestSellers({ limit, from, to } = {}) {
  const { data } = await http.get('/dashboard/best-sellers', { params: { limit, from, to } })
  return data
}

export async function getRecentSales(limit) {
  const { data } = await http.get('/dashboard/recent-sales', { params: { limit } })
  return data
}

// ---- Products ----------------------------------------------------------
export async function getProducts() {
  const { data } = await http.get('/products')
  return data
}

export async function getCategories() {
  const { data } = await http.get('/products/categories')
  return data
}

export async function createProduct(payload) {
  const { data } = await http.post('/products', payload)
  return data
}

export async function updateProduct(id, payload) {
  const { data } = await http.put(`/products/${id}`, payload)
  return data
}

export async function deleteProduct(id) {
  await http.delete(`/products/${id}`)
  return { id, deleted: true }
}

export async function adjustStock(id, delta, reason) {
  const { data } = await http.patch(`/products/${id}/stock`, { delta, reason })
  return data
}

export async function getStockHistory(id) {
  const { data } = await http.get(`/products/${id}/stock-history`)
  return data
}

// ---- Billing / POS ----------------------------------------------------
export async function createBill(payload) {
  const { data } = await http.post('/bills', payload)
  return data
}

// ---- Customers ----------------------------------------------------------
export async function searchCustomers(mobilePrefix) {
  const { data } = await http.get('/customers/search', { params: { mobile: mobilePrefix } })
  return data
}

// ---- History / Bills --------------------------------------------------
export async function getBills({ from, to, q, page = 1, limit = 25 } = {}) {
  const { data } = await http.get('/bills', { params: { from, to, q, page, limit } })
  return { bills: (data.bills || []).map(normalizeBillSummary), total: data.total }
}

export async function getBill(billNo) {
  const { data } = await http.get(`/bills/${billNo}`)
  return normalizeBillDetail(data)
}

export async function deleteBill(billNo) {
  await http.delete(`/bills/${billNo}`)
  return { id: billNo, deleted: true }
}

export async function bulkDeleteBills(billNumbers) {
  const { data } = await http.post('/bills/bulk-delete', { billNumbers })
  return data
}

export async function exportBills({ from, to, q } = {}) {
  const res = await http.get('/bills/export', { params: { from, to, q }, responseType: 'blob' })
  downloadBlob(res.data, `bills-${Date.now()}.csv`)
}

// ---- Credit bills -------------------------------------------------------
export async function getCreditBills(status) {
  const { data } = await http.get('/bills/credit', { params: { status } })
  return data.map(normalizeBillSummary)
}

export async function closeCreditBill(billNo, closedMode) {
  const { data } = await http.patch(`/bills/credit/${billNo}/close`, { closedMode })
  return normalizeBillSummary(data)
}

// ---- Purchases ------------------------------------------------------------
export async function getPurchases({ from, to, limit } = {}) {
  const { data } = await http.get('/purchases', { params: { from, to, limit } })
  return data.map((p) => ({ ...p, items: Array.isArray(p.items) ? p.items.length : p.items }))
}

export async function getSuppliers() {
  const { data } = await http.get('/purchases/suppliers')
  return data
}

export async function createPurchase({ supplier, invoiceNo, date, items }) {
  const { data } = await http.post('/purchases', { supplier, invoiceNo, date, items })
  return { ...data, items: Array.isArray(data.items) ? data.items.length : data.items }
}

export async function getPurchase(billNo) {
  const { data } = await http.get(`/purchases/${billNo}`)
  return data
}

export async function updatePurchase(billNo, { supplier, invoiceNo, date, items }) {
  const { data } = await http.put(`/purchases/${billNo}`, { supplier, invoiceNo, date, items })
  return { ...data, items: Array.isArray(data.items) ? data.items.length : data.items }
}

export async function deletePurchase(billNo) {
  await http.delete(`/purchases/${billNo}`)
  return { id: billNo, deleted: true }
}

export async function exportPurchases() {
  const res = await http.get('/purchases/export', { responseType: 'blob' })
  downloadBlob(res.data, `purchases-${Date.now()}.csv`)
}

// ---- Sessions (till / cash counting) --------------------------------------
export async function getSessions() {
  const { data } = await http.get('/sessions')
  return data
}

export async function closeSession(payload) {
  const { data } = await http.post('/sessions', {
    ...payload,
    openingTimeISO: new Date().toISOString(),
  })
  return data
}

// ---- Settings ---------------------------------------------------------
export async function getSettings() {
  const { data } = await http.get('/settings')
  return data
}

export async function saveSettings(payload) {
  const { data } = await http.put('/settings', payload)
  return data
}
