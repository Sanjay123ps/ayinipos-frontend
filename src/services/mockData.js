// Placeholder data so every screen is fully functional before the Postgres
// backend exists. Swap the functions in services/api.js for real calls and
// nothing in the pages/components needs to change.
import { loadPersisted } from "./persist";
import { startOfDay, toDateInputValue } from "../utils/dateRanges";

export const categories = [
  "Oil Items",
  "Pulses",
  "Masala Items",
  "Flour Items",
  "Noodles & Semiya",
  "Skin Care",
  "Health Products",
  "Dry Fruits",
  "Sweeteners",
  "Rice Items",
];

const emojiByCategory = {
  "Oil Items": "🫙",
  Pulses: "🌾",
  "Masala Items": "🌶️",
  "Flour Items": "🍪",
  "Noodles & Semiya": "🧃",
  "Skin Care": "🥛",
};

const seedProducts = [
  {
    id: "P001",
    name: "Mutton Masala / Kuruma Masala 250g",
    category: "Masala Items",
    price: 135,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001001",
  },
  {
    id: "P002",
    name: "Paruppu Podi 100g",
    category: "Masala Items",
    price: 60,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001002",
  },
  {
    id: "P003",
    name: "Chilli Powder 100g",
    category: "Masala Items",
    price: 50,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001003",
  },
  {
    id: "P004",
    name: "Malli Powder (Coriander) 100g",
    category: "Masala Items",
    price: 40,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001004",
  },
  {
    id: "P005",
    name: "Idli Podi 250g",
    category: "Masala Items",
    price: 140,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001005",
  },
  {
    id: "P006",
    name: "Idli Podi 100g",
    category: "Masala Items",
    price: 60,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001006",
  },
  {
    id: "P007",
    name: "Sambar Podi 250g",
    category: "Masala Items",
    price: 135,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001007",
  },
  {
    id: "P008",
    name: "Karuveppilai Podi 100g",
    category: "Masala Items",
    price: 60,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001008",
  },
  {
    id: "P009",
    name: "Chicken Masala 100g",
    category: "Masala Items",
    price: 70,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001009",
  },
  {
    id: "P010",
    name: "Instant Rasam Podi 100g",
    category: "Masala Items",
    price: 80,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001010",
  },

  {
    id: "P011",
    name: "Pepper (Milagu) 50g",
    category: "Pulses",
    price: 47,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001011",
  },
  {
    id: "P012",
    name: "Cardamom (Elakkai) 50g",
    category: "Pulses",
    price: 200,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001012",
  },
  {
    id: "P013",
    name: "Fenugreek (Vendhayam) 250g",
    category: "Pulses",
    price: 30,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001013",
  },
  {
    id: "P014",
    name: "Ragi 1kg",
    category: "Pulses",
    price: 70,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001014",
  },
  {
    id: "P015",
    name: "Ragi 500g",
    category: "Pulses",
    price: 40,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001015",
  },
  {
    id: "P016",
    name: "Black Gram (Black Ulundhu) 500g",
    category: "Pulses",
    price: 65,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001016",
  },
  {
    id: "P017",
    name: "Samai (Little Millet) 500g",
    category: "Pulses",
    price: 60,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001017",
  },
  {
    id: "P018",
    name: "Ellu (Sesame) 500g",
    category: "Pulses",
    price: 120,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001018",
  },
  {
    id: "P019",
    name: "Pearl Millet (Naattu Kambu) 500g",
    category: "Pulses",
    price: 50,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001019",
  },
  {
    id: "P020",
    name: "Barnyard Millet (Kuthiravali) 500g",
    category: "Pulses",
    price: 60,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001020",
  },
  {
    id: "P021",
    name: "Horse Gram (Kollu) 500g",
    category: "Pulses",
    price: 55,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001021",
  },
  {
    id: "P022",
    name: "Sundal 1kg",
    category: "Pulses",
    price: 110,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001022",
  },
  {
    id: "P023",
    name: "Sundal 500g",
    category: "Pulses",
    price: 55,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001023",
  },
  {
    id: "P024",
    name: "Greengram (Paasi Payiru) 500g",
    category: "Pulses",
    price: 70,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001024",
  },
  {
    id: "P025",
    name: "Soya Chunks (Big) 250g",
    category: "Pulses",
    price: 30,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001025",
  },
  {
    id: "P026",
    name: "Soya Chunks (Small) 250g",
    category: "Pulses",
    price: 30,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001026",
  },
  {
    id: "P027",
    name: "Solam (Sorghum) 500g",
    category: "Pulses",
    price: 30,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001027",
  },
  {
    id: "P028",
    name: "Groundnut 250g",
    category: "Pulses",
    price: 55,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001028",
  },
  {
    id: "P029",
    name: "Tea Powder 100g",
    category: "Pulses",
    price: 40,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001029",
  },
  {
    id: "P030",
    name: "Garam Masala 50g",
    category: "Masala Items",
    price: 60,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001030",
  },

  {
    id: "P031",
    name: "Coconut Oil 1L",
    category: "Oil Items",
    price: 400,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001031",
  },
  {
    id: "P032",
    name: "Coconut Oil 500ml",
    category: "Oil Items",
    price: 220,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001032",
  },
  {
    id: "P033",
    name: "Groundnut Oil 500ml",
    category: "Oil Items",
    price: 140,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001033",
  },
  {
    id: "P034",
    name: "Groundnut Oil 1L",
    category: "Oil Items",
    price: 280,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001034",
  },
  {
    id: "P035",
    name: "Gingelly Oil (Nallennai) 500ml",
    category: "Oil Items",
    price: 250,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001035",
  },
  {
    id: "P036",
    name: "Gingelly Oil (Nallennai) 1L",
    category: "Oil Items",
    price: 480,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001036",
  },
  {
    id: "P037",
    name: "Deepam Oil 200ml",
    category: "Oil Items",
    price: 50,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001037",
  },

  {
    id: "P038",
    name: "Kavuni Barley Kanji Mix 250g",
    category: "Flour Items",
    price: 125,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001038",
  },
  {
    id: "P039",
    name: "Wheat Kurunai 500g",
    category: "Flour Items",
    price: 35,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001039",
  },
  {
    id: "P040",
    name: "Karuppu Kavuni Kurunai 500g",
    category: "Flour Items",
    price: 140,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001040",
  },
  {
    id: "P041",
    name: "Millet Dosa Mix 500g",
    category: "Flour Items",
    price: 100,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001041",
  },
  {
    id: "P042",
    name: "Multigrain Health Mix 250g",
    category: "Flour Items",
    price: 150,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001042",
  },
  {
    id: "P043",
    name: "Kambu Kurunai 500g",
    category: "Flour Items",
    price: 40,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001043",
  },
  {
    id: "P044",
    name: "Wheat Flour (Gothumai) 1kg",
    category: "Flour Items",
    price: 60,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001044",
  },

  {
    id: "P056",
    name: "Herbal Hair Oil 200ml",
    category: "Skin Care",
    price: 175,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001056",
  },
  {
    id: "P057",
    name: "Nalangu Maavu Soap",
    category: "Skin Care",
    price: 70,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001057",
  },
  {
    id: "P058",
    name: "Multhani Mitti Soap",
    category: "Skin Care",
    price: 70,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001058",
  },
  {
    id: "P059",
    name: "Kuppaimeni Soap",
    category: "Skin Care",
    price: 70,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001059",
  },
  {
    id: "P060",
    name: "Sandal Leaf Soap",
    category: "Skin Care",
    price: 70,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001060",
  },
  {
    id: "P061",
    name: "Bathing Soap",
    category: "Skin Care",
    price: 70,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001061",
  },
  {
    id: "P062",
    name: "Sandal Soap",
    category: "Skin Care",
    price: 70,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001062",
  },
  {
    id: "P063",
    name: "Arisi Maavu Soap",
    category: "Skin Care",
    price: 70,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001063",
  },

  {
    id: "P064",
    name: "Manjal Thool 250g",
    category: "Masala Items",
    price: 150,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001064",
  },
  {
    id: "P065",
    name: "Manjal Thool 100g",
    category: "Masala Items",
    price: 60,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001065",
  },
  {
    id: "P066",
    name: "Manjal Thool 50g",
    category: "Masala Items",
    price: 30,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001066",
  },

  {
    id: "P067",
    name: "Ellu Podi 100g",
    category: "Masala Items",
    price: 50,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001067",
  },

  {
    id: "P068",
    name: "Honey 250g",
    category: "Health Products",
    price: 180,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001068",
  },
  {
    id: "P069",
    name: "Honey 500g",
    category: "Health Products",
    price: 350,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001069",
  },

  {
    id: "P070",
    name: "Cow Ghee 250ml",
    category: "Health Products",
    price: 250,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001070",
  },
  {
    id: "P071",
    name: "Cow Ghee 500ml",
    category: "Health Products",
    price: 500,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001071",
  },

  {
    id: "P072",
    name: "Chia Seeds 250g",
    category: "Health Products",
    price: 120,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001072",
  },
  {
    id: "P073",
    name: "Sabja Seeds 250g",
    category: "Health Products",
    price: 120,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001073",
  },

  {
    id: "P074",
    name: "Honey Amla 100g",
    category: "Health Products",
    price: 65,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001074",
  },

  {
    id: "P075",
    name: "Black Grapes",
    category: "Dry Fruits",
    price: 40,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001075",
  },

  {
    id: "P076",
    name: "Black Dates",
    category: "Dry Fruits",
    price: 80,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001076",
  },

  {
    id: "P077",
    name: "Naatu Sarkarai 500g",
    category: "Sweeteners",
    price: 40,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001077",
  },
  {
    id: "P078",
    name: "Naatu Sarkarai 1kg",
    category: "Sweeteners",
    price: 70,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001078",
  },

  {
    id: "P079",
    name: "Karupatti 500g",
    category: "Sweeteners",
    price: 140,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001079",
  },

  {
    id: "P080",
    name: "Stone Salt 1kg",
    category: "Pulses",
    price: 15,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001080",
  },

  {
    id: "P081",
    name: "Rajma 500g",
    category: "Pulses",
    price: 90,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001081",
  },

  {
    id: "P082",
    name: "Pottu Kadalai 500g",
    category: "Pulses",
    price: 80,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001082",
  },

  {
    id: "P083",
    name: "Samba Ravai 500g",
    category: "Flour Items",
    price: 45,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001083",
  },

  {
    id: "P084",
    name: "Thattai Payiru 500g",
    category: "Pulses",
    price: 70,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001084",
  },

  {
    id: "P085",
    name: "Red Aval 500g",
    category: "Flour Items",
    price: 60,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001085",
  },

  {
    id: "P086",
    name: "White Aval 500g",
    category: "Flour Items",
    price: 55,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001086",
  },

  {
    id: "P087",
    name: "Karuppu Kavuni Rice 1kg",
    category: "Rice Items",
    price: 180,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001087",
  },

  {
    id: "P088",
    name: "Seeraga Samba Rice 1kg",
    category: "Rice Items",
    price: 140,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001088",
  },

  {
    id: "P089",
    name: "Paasi Paruppu 500g",
    category: "Pulses",
    price: 90,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001089",
  },

  {
    id: "P090",
    name: "Sombu 100g",
    category: "Pulses",
    price: 30,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001090",
  },

  {
    id: "P091",
    name: "Red Rice 1kg",
    category: "Rice Items",
    price: 90,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001091",
  },

  {
    id: "P092",
    name: "Thinai 500g",
    category: "Pulses",
    price: 70,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001092",
  },

  {
    id: "P093",
    name: "Kadalai Paruppu 500g",
    category: "Pulses",
    price: 70,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001093",
  },

  {
    id: "P094",
    name: "Idly Rice 1kg",
    category: "Rice Items",
    price: 60,
    purchasePrice: 0,
    gst: 0,
    stock: 50,
    lowStockLimit: 10,
    barcode: "8901001094",
  },
];

export let products = loadPersisted("products", seedProducts);

export const suppliers = [];

const seedCustomers = [];

export const customers = loadPersisted("customers", seedCustomers);

const purchaseSeeds = [];

function withPurchaseTotals(p) {
  return {
    ...p,
    totalQuantity: p.items.reduce((sum, i) => sum + Number(i.quantity || 0), 0),
  };
}

export const purchases = loadPersisted(
  "purchases",
  purchaseSeeds.map(withPurchaseTotals),
);

// Full bill records (with line items) for the History and Credit Bills
// screens. Dates are generated relative to "now" so the Today/Yesterday/
// This Week/This Month filters always have something to show regardless
// of when this demo data is viewed.
function daysAgo(n, hour = 14, minute = 30) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const billSeeds = [];

export const bills = loadPersisted(
  "bills",
  billSeeds.map((seed) => {
    const subtotal = seed.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const gstAmount = seed.items.reduce(
      (sum, i) => sum + (i.price * i.qty * i.gst) / 100,
      0,
    );
    const total = Math.round((subtotal + gstAmount) * 100) / 100;
    return {
      id: seed.id,
      createdAt: daysAgo(seed.offset, seed.hour, seed.min),
      customerName: seed.customer?.name || null,
      customerMobile: seed.customer?.mobile || null,
      paymentMode: seed.mode,
      creditStatus:
        seed.mode === "Credit" ? seed.creditStatus || "pending" : "none",
      creditClosedMode: seed.closedMode || null,
      items: seed.items.map((i) => ({
        ...i,
        lineTotal:
          Math.round(
            (i.price * i.qty + (i.price * i.qty * i.gst) / 100) * 100,
          ) / 100,
      })),
      subtotal: Math.round(subtotal * 100) / 100,
      gstAmount: Math.round(gstAmount * 100) / 100,
      discountAmount: 0,
      total,
    };
  }),
);

// ---- Derived reporting stats -----------------------------------------
// Computed fresh from `bills` on every call (instead of frozen at module
// load) so Dashboard/Reports reflect bills as they're actually created or
// deleted, rather than permanently showing whatever placeholder values
// existed the moment this module first loaded.
function billTotal(b) {
  return Number(b.total) || 0;
}

export function getDashboardStats() {
  const now = new Date();
  const todayKey = toDateInputValue(now);
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  let todaySales = 0;
  let monthlySales = 0;
  let totalRevenue = 0;

  bills.forEach((b) => {
    const total = billTotal(b);
    totalRevenue += total;
    const billDate = new Date(b.createdAt);
    if (toDateInputValue(billDate) === todayKey) todaySales += total;
    const billMonthKey = `${billDate.getFullYear()}-${String(billDate.getMonth() + 1).padStart(2, "0")}`;
    if (billMonthKey === monthKey) monthlySales += total;
  });

  return {
    todaySales: Math.round(todaySales * 100) / 100,
    monthlySales: Math.round(monthlySales * 100) / 100,
    totalOrders: bills.length,
    totalProducts: products.length,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
  };
}

export function getSalesTrend() {
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = startOfDay(new Date());
  // Date#getDay() is 0=Sun..6=Sat — shift it so Monday starts the row.
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(monday.getDate() - mondayOffset);

  const totals = dayLabels.map(() => 0);
  bills.forEach((b) => {
    const billDay = startOfDay(new Date(b.createdAt));
    const diffDays = Math.round((billDay - monday) / 86400000);
    if (diffDays >= 0 && diffDays < 7) {
      totals[diffDays] += billTotal(b);
    }
  });

  return dayLabels.map((day, i) => ({
    day,
    sales: Math.round(totals[i] * 100) / 100,
  }));
}

export function getBestSellers(limit = 5) {
  const byProduct = new Map();
  bills.forEach((b) => {
    (b.items || []).forEach((line) => {
      const entry = byProduct.get(line.name) || {
        name: line.name,
        units: 0,
        revenue: 0,
      };
      entry.units += line.qty;
      entry.revenue += line.lineTotal ?? line.price * line.qty;
      byProduct.set(line.name, entry);
    });
  });

  return [...byProduct.values()]
    .sort((a, b) => b.units - a.units)
    .slice(0, limit)
    .map((entry) => ({
      ...entry,
      revenue: Math.round(entry.revenue * 100) / 100,
    }));
}

export function getRecentSales(limit = 5) {
  return [...bills]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit)
    .map((b) => ({
      id: b.id,
      time: new Date(b.createdAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      items: (b.items || []).reduce((sum, line) => sum + line.qty, 0),
      mode: b.paymentMode,
      total: billTotal(b),
    }));
}

export const sessions = loadPersisted("sessions", []);

export const storeSettings = loadPersisted("settings", {
  storeName: "",
  gstNumber: "",
  gstDefaultRate: 0,
  address: "",
  billFooter: "",
  theme: "light",
  logoEmoji: "",
});
