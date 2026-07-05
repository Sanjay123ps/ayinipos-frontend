import axios from 'axios'
import * as mock from './mockData'
import { loadPersisted, savePersisted } from './persist'

// Once the Express/PostgreSQL backend is live, point this at it via an env
// var (e.g. import.meta.env.VITE_API_URL) and remove the mock fallbacks below.
export const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms))

// Persists a mock collection back to localStorage after every mutation, so
// bills/purchases/products/customers created in the UI survive a reload
// instead of only living in memory for the current tab session.
function persist(key, value) {
  savePersisted(key, value)
}

// ---- Dashboard -----------------------------------------------------------
// TODO: GET /api/dashboard/summary
export async function getDashboardStats() {
  await delay()
  return mock.dashboardStats
}

// TODO: GET /api/reports/daily?days=7
export async function getSalesTrend() {
  await delay()
  return mock.salesTrend
}

// TODO: GET /api/reports/top-products
export async function getBestSellers() {
  await delay()
  return mock.bestSellers
}

// TODO: GET /api/bills?limit=5&sort=desc
export async function getRecentSales() {
  await delay()
  return mock.recentSales
}

// ---- Products -------------------------------------------------------------
// TODO: GET /api/products
export async function getProducts() {
  await delay()
  return mock.products
}

export async function getCategories() {
  await delay(80)
  return mock.categories
}

// TODO: POST /api/products
export async function createProduct(payload) {
  await delay()
  const newProduct = { id: `P${Math.floor(Math.random() * 9000) + 100}`, stock: 0, ...payload }
  mock.products.push(newProduct)
  persist('products', mock.products)
  return newProduct
}

// TODO: PUT /api/products/:id
export async function updateProduct(id, payload) {
  await delay()
  const idx = mock.products.findIndex((p) => p.id === id)
  if (idx > -1) mock.products[idx] = { ...mock.products[idx], ...payload }
  persist('products', mock.products)
  return mock.products[idx]
}

// TODO: DELETE /api/products/:id
export async function deleteProduct(id) {
  await delay()
  const idx = mock.products.findIndex((p) => p.id === id)
  if (idx > -1) mock.products.splice(idx, 1)
  persist('products', mock.products)
  return true
}

// ---- Billing / POS ---------------------------------------------------------
// TODO: POST /api/bills  { items, discountPercent, customerMobile, customerName, paymentMode }
export async function createBill(payload) {
  await delay(400)
  // naive stock deduction against the in-memory mock catalog
  payload.items.forEach((line) => {
    const product = mock.products.find((p) => p.id === line.id)
    if (product) product.stock = Math.max(0, product.stock - line.qty)
  })
  persist('products', mock.products)

  // Capture the customer (if a mobile number was given) so it shows up in
  // autofill next time — mirrors findOrCreateCustomer on the real backend.
  if (payload.customerMobile) {
    const existing = mock.customers.find((c) => c.mobile === payload.customerMobile)
    if (existing) {
      if (payload.customerName) existing.name = payload.customerName
    } else {
      mock.customers.push({
        id: `C${Math.floor(Math.random() * 9000) + 100}`,
        name: payload.customerName || '',
        mobile: payload.customerMobile,
        address: '',
      })
    }
    persist('customers', mock.customers)
  }

  const bill = {
    id: `BILL-${Math.floor(Math.random() * 9000) + 1000}`,
    createdAt: new Date().toISOString(),
    creditStatus: payload.paymentMode === 'Credit' ? 'pending' : 'none',
    ...payload,
  }
  mock.bills.unshift({
    ...bill,
    subtotal: payload.totals?.subtotal ?? 0,
    gstAmount: payload.totals?.gstAmount ?? 0,
    discountAmount: payload.totals?.discountAmount ?? 0,
    total: payload.totals?.total ?? 0,
  })
  persist('bills', mock.bills)
  return bill
}

// ---- Customers --------------------------------------------------------
// TODO: GET /api/customers/search?mobile=
export async function searchCustomers(mobilePrefix) {
  await delay(120)
  if (!mobilePrefix) return []
  return mock.customers.filter((c) => c.mobile.startsWith(mobilePrefix)).slice(0, 8)
}

// ---- History (bills) ---------------------------------------------------
// TODO: GET /api/bills?from=&to=&q=&page=&limit=
export async function getBills({ from, to, q, page = 1, limit = 25 } = {}) {
  await delay()
  let filtered = mock.bills
  if (from) filtered = filtered.filter((b) => b.createdAt >= from)
  if (to) filtered = filtered.filter((b) => b.createdAt < `${to}T23:59:59.999Z`)
  if (q) {
    const needle = q.toLowerCase()
    filtered = filtered.filter(
      (b) =>
        b.id.toLowerCase().includes(needle) ||
        (b.customerMobile || '').includes(needle) ||
        (b.customerName || '').toLowerCase().includes(needle)
    )
  }
  filtered = [...filtered].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  const start = (page - 1) * limit
  return {
    bills: filtered.slice(start, start + limit).map((b) => ({ ...b, items: b.items.length })),
    total: filtered.length,
    page,
    limit,
  }
}

// TODO: GET /api/bills/:billNo
export async function getBill(billNo) {
  await delay(150)
  return mock.bills.find((b) => b.id === billNo)
}

// TODO: DELETE /api/bills/:billNo
export async function deleteBill(billNo) {
  await delay(300)
  const idx = mock.bills.findIndex((b) => b.id === billNo)
  if (idx > -1) {
    const [removed] = mock.bills.splice(idx, 1)
    // Restore the stock the bill had deducted, mirroring the real backend.
    removed.items.forEach((line) => {
      const product = mock.products.find((p) => p.name === line.name)
      if (product) product.stock += line.qty
    })
    persist('products', mock.products)
    persist('bills', mock.bills)
  }
  return { id: billNo, deleted: true }
}

// TODO: GET /api/bills/export?from=&to=&q=  (downloads a CSV from the server)
export async function exportBills({ from, to, q } = {}) {
  const { bills } = await getBills({ from, to, q, page: 1, limit: 10000 })
  const header = ['Bill No', 'Date', 'Customer Name', 'Customer Mobile', 'Payment Mode', 'Credit Status', 'Items', 'Total']
  const rows = bills.map((b) =>
    [b.id, b.createdAt, b.customerName || '', b.customerMobile || '', b.paymentMode, b.creditStatus, b.items, b.total]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  )
  const csv = [header.join(','), ...rows].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `bills-${Date.now()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// ---- Credit Bills -------------------------------------------------------
// TODO: GET /api/bills/credit?status=pending|paid
export async function getCreditBills(status) {
  await delay()
  return mock.bills
    .filter((b) => b.creditStatus !== 'none' && (!status || b.creditStatus === status))
    .map((b) => ({ ...b, items: b.items.length }))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

// TODO: PATCH /api/bills/credit/:billNo/close  { closedMode }
export async function closeCreditBill(billNo, closedMode) {
  await delay(300)
  const bill = mock.bills.find((b) => b.id === billNo)
  if (bill) {
    bill.creditStatus = 'paid'
    bill.creditClosedMode = closedMode
    bill.creditClosedAt = new Date().toISOString()
    persist('bills', mock.bills)
  }
  return bill
}

// ---- Purchases --------------------------------------------------------
// TODO: GET /api/purchases
export async function getPurchases() {
  await delay()
  return mock.purchases.map((p) => ({ ...p, items: p.items.length }))
}

export async function getSuppliers() {
  await delay(80)
  return mock.suppliers
}

// Purchases only ever move stock. purchasePrice is never collected from
// the user, stored on the purchase record, or used in any calculation.
function buildPurchaseLines(items) {
  const lines = items.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    unit: item.unit || 'pcs',
    quantity: Number(item.quantity),
  }))
  return { lines, totalQuantity: lines.reduce((sum, l) => sum + (Number(l.quantity) || 0), 0) }
}

// Applies a multi-product purchase's stock effect against the mock
// catalog, or reverses it (sign = -1) when editing/deleting.
function applyPurchaseToCatalog(items, sign = 1) {
  items.forEach((line) => {
    const product = mock.products.find((p) => p.id === line.productId)
    if (!product) return
    product.stock = Math.max(0, product.stock + sign * Number(line.quantity))
  })
  persist('products', mock.products)
}

// TODO: POST /api/purchases  { supplier, invoiceNo, date, items: [{productId, productName, unit, quantity}] }
export async function createPurchase({ supplier, invoiceNo, date, items }) {
  await delay(400)
  if (!items || items.length === 0) {
    throw new Error('A purchase bill needs at least one product')
  }
  const { lines, totalQuantity } = buildPurchaseLines(items)

  applyPurchaseToCatalog(lines, 1)

  const record = {
    id: `PUR-${Math.floor(Math.random() * 9000) + 1000}`,
    supplier,
    invoiceNo,
    date: date || new Date().toISOString().slice(0, 10),
    items: lines,
    totalQuantity,
  }
  mock.purchases.unshift(record)
  persist('purchases', mock.purchases)
  return { ...record, items: lines.length }
}

// TODO: GET /api/purchases/:billNo
export async function getPurchase(billNo) {
  await delay(150)
  return mock.purchases.find((p) => p.id === billNo)
}

// TODO: PUT /api/purchases/:billNo
export async function updatePurchase(billNo, { supplier, invoiceNo, date, items }) {
  await delay(400)
  const idx = mock.purchases.findIndex((p) => p.id === billNo)
  if (idx === -1) throw new Error('Purchase not found')

  // Reverse the old line items' effect on stock before applying the new ones.
  applyPurchaseToCatalog(mock.purchases[idx].items, -1)

  const { lines, totalQuantity } = buildPurchaseLines(items)
  applyPurchaseToCatalog(lines, 1)

  mock.purchases[idx] = { ...mock.purchases[idx], supplier, invoiceNo, date, items: lines, totalQuantity }
  persist('purchases', mock.purchases)
  return { ...mock.purchases[idx], items: lines.length }
}

// TODO: DELETE /api/purchases/:billNo
export async function deletePurchase(billNo) {
  await delay(300)
  const idx = mock.purchases.findIndex((p) => p.id === billNo)
  if (idx > -1) {
    const [removed] = mock.purchases.splice(idx, 1)
    applyPurchaseToCatalog(removed.items, -1)
    persist('purchases', mock.purchases)
  }
  return { id: billNo, deleted: true }
}

// TODO: GET /api/purchases/export
export async function exportPurchases() {
  const header = ['Purchase No', 'Date', 'Supplier', 'Invoice No', 'Items', 'Total Quantity']
  const rows = mock.purchases.map((p) =>
    [p.id, p.date, p.supplier, p.invoiceNo || '', p.items.length, p.totalQuantity]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  )
  const csv = [header.join(','), ...rows].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `purchases-${Date.now()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// ---- Inventory --------------------------------------------------------
// TODO: PATCH /api/products/:id/stock
export async function adjustStock(id, delta, reason) {
  await delay()
  const product = mock.products.find((p) => p.id === id)
  if (product) product.stock = Math.max(0, product.stock + delta)
  persist('products', mock.products)
  return product
}

// ---- Sessions (till / cash counting) --------------------------------------
// TODO: GET /api/sessions
export async function getSessions() {
  await delay()
  return mock.sessions
}

// TODO: POST /api/sessions
export async function closeSession(payload) {
  await delay(400)
  const record = { id: `SES-${Math.floor(Math.random() * 900) + 100}`, ...payload }
  mock.sessions.unshift(record)
  persist('sessions', mock.sessions)
  return record
}

// ---- Settings --------------------------------------------------------------
// TODO: GET /api/settings
export async function getSettings() {
  await delay(150)
  return mock.storeSettings
}

// TODO: PUT /api/settings
export async function saveSettings(payload) {
  await delay(300)
  Object.assign(mock.storeSettings, payload)
  persist('settings', mock.storeSettings)
  return mock.storeSettings
}

// ---- Auth --------------------------------------------------------------
// TODO: POST /api/auth/change-password  { currentPassword, newPassword }
export async function changePassword({ currentPassword, newPassword }) {
  await delay(400)
  if (!currentPassword || !newPassword) {
    throw new Error('Current and new password are required')
  }
  if (newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters')
  }
  const storedPassword = loadPersisted('mockPassword', 'admin123')
  if (currentPassword !== storedPassword) {
    throw new Error('Current password is incorrect')
  }
  persist('mockPassword', newPassword)
  return { success: true }
}
