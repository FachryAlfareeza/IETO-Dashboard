export type Sector = 'Renewable' | 'Fossil';

export interface Company {
  id: string;
  name: string;
  sector: Sector;
  tokenBalance: number; // Positive = Surplus, Negative = Debt
  quota: number; // Government assigned quota in tonnes CO2
  emissions: number[]; // Last 4 quarters actual emissions
  tradingHistory: { date: string; amount: number; type: 'buy' | 'sell' }[];
  deadline?: string; // Only for fossil fuel companies with debt
  estimatedPenalty?: number; // In IDR billions
  logo?: string;
}

export interface MarketStats {
  totalMinted: number;
  totalBurned: number;
  currentPrice: number;
  priceChange: number;
  volume24h: number;
  marketCap: number;
}

export interface PriceData {
  date: string;
  price: number;
  volume: number;
}

// Mock Price History (6 months)
export const priceHistory: PriceData[] = [
  { date: '2026-01-01', price: 68000, volume: 1250000 },
  { date: '2026-01-15', price: 69500, volume: 1420000 },
  { date: '2026-02-01', price: 71200, volume: 1680000 },
  { date: '2026-02-15', price: 69800, volume: 1540000 },
  { date: '2026-03-01', price: 72500, volume: 1890000 },
  { date: '2026-03-15', price: 73800, volume: 2100000 },
  { date: '2026-04-01', price: 74200, volume: 1950000 },
  { date: '2026-04-15', price: 75500, volume: 2250000 },
  { date: '2026-05-01', price: 74800, volume: 1870000 },
  { date: '2026-05-15', price: 76200, volume: 2420000 },
  { date: '2026-06-01', price: 75800, volume: 2180000 },
  { date: '2026-06-15', price: 75000, volume: 2050000 },
];

// Mock Market Statistics
export const marketStats: MarketStats = {
  totalMinted: 45000000, // 45 million tokens
  totalBurned: 12800000, // 12.8 million tokens
  currentPrice: 75000, // Rp 75,000 per token
  priceChange: 2.4, // +2.4%
  volume24h: 3250000, // 3.25 million tokens
  marketCap: 3375000000000, // Rp 3.375 trillion
};

// Mock Companies Data
export const companies: Company[] = [
  {
    id: 'pertamina-geothermal',
    name: 'PT Pertamina Geothermal Energy',
    sector: 'Renewable',
    tokenBalance: 285000,
    quota: 150000,
    emissions: [52000, 48000, 51000, 47000],
    tradingHistory: [
      { date: '2026-01', amount: 45000, type: 'sell' },
      { date: '2026-02', amount: 38000, type: 'sell' },
      { date: '2026-03', amount: 52000, type: 'sell' },
      { date: '2026-04', amount: 61000, type: 'sell' },
      { date: '2026-05', amount: 48000, type: 'sell' },
      { date: '2026-06', amount: 41000, type: 'sell' },
    ],
  },
  {
    id: 'barito-renewables',
    name: 'PT Barito Renewables',
    sector: 'Renewable',
    tokenBalance: 198000,
    quota: 95000,
    emissions: [38000, 35000, 37000, 34000],
    tradingHistory: [
      { date: '2026-01', amount: 32000, type: 'sell' },
      { date: '2026-02', amount: 28000, type: 'sell' },
      { date: '2026-03', amount: 35000, type: 'sell' },
      { date: '2026-04', amount: 42000, type: 'sell' },
      { date: '2026-05', amount: 36000, type: 'sell' },
      { date: '2026-06', amount: 25000, type: 'sell' },
    ],
  },
  {
    id: 'pln-ebt',
    name: 'PT PLN EBT',
    sector: 'Renewable',
    tokenBalance: 142000,
    quota: 110000,
    emissions: [42000, 39000, 41000, 38000],
    tradingHistory: [
      { date: '2026-01', amount: 18000, type: 'sell' },
      { date: '2026-02', amount: 22000, type: 'sell' },
      { date: '2026-03', amount: 28000, type: 'sell' },
      { date: '2026-04', amount: 31000, type: 'sell' },
      { date: '2026-05', amount: 24000, type: 'sell' },
      { date: '2026-06', amount: 19000, type: 'sell' },
    ],
  },
  {
    id: 'adaro-energy',
    name: 'PT Adaro Energy',
    sector: 'Fossil',
    tokenBalance: -156000,
    quota: 850000,
    emissions: [280000, 295000, 310000, 321000],
    tradingHistory: [
      { date: '2026-01', amount: 52000, type: 'buy' },
      { date: '2026-02', amount: 48000, type: 'buy' },
      { date: '2026-03', amount: 61000, type: 'buy' },
      { date: '2026-04', amount: 55000, type: 'buy' },
      { date: '2026-05', amount: 72000, type: 'buy' },
      { date: '2026-06', amount: 68000, type: 'buy' },
    ],
    deadline: '12 Days',
    estimatedPenalty: 156,
  },
  {
    id: 'bukit-asam',
    name: 'PT Bukit Asam',
    sector: 'Fossil',
    tokenBalance: -52000,
    quota: 420000,
    emissions: [125000, 132000, 128000, 139000],
    tradingHistory: [
      { date: '2026-01', amount: 18000, type: 'buy' },
      { date: '2026-02', amount: 21000, type: 'buy' },
      { date: '2026-03', amount: 24000, type: 'buy' },
      { date: '2026-04', amount: 28000, type: 'buy' },
      { date: '2026-05', amount: 22000, type: 'buy' },
      { date: '2026-06', amount: 19000, type: 'buy' },
    ],
    deadline: '5 Days',
    estimatedPenalty: 78,
  },
  {
    id: 'indonesia-power',
    name: 'PT Indonesia Power',
    sector: 'Fossil',
    tokenBalance: -28500,
    quota: 380000,
    emissions: [98000, 102000, 105000, 113500],
    tradingHistory: [
      { date: '2026-01', amount: 12000, type: 'buy' },
      { date: '2026-02', amount: 14000, type: 'buy' },
      { date: '2026-03', amount: 11000, type: 'buy' },
      { date: '2026-04', amount: 16000, type: 'buy' },
      { date: '2026-05', amount: 15000, type: 'buy' },
      { date: '2026-06', amount: 13000, type: 'buy' },
    ],
    deadline: '18 Days',
    estimatedPenalty: 42.75,
  },
];

// Helper function to get company by ID
export const getCompanyById = (id: string): Company | undefined => {
  return companies.find(company => company.id === id);
};

// Compliance Watchlist - Fossil companies sorted by deadline urgency
export const complianceWatchlist = companies
  .filter(c => c.sector === 'Fossil' && c.tokenBalance < 0)
  .sort((a, b) => {
    const daysA = parseInt(a.deadline || '99');
    const daysB = parseInt(b.deadline || '99');
    return daysA - daysB;
  });

// Format currency in Indonesian Rupiah
export const formatRupiah = (value: number): string => {
  if (value >= 1e12) {
    return `Rp ${(value / 1e12).toFixed(2)} T`;
  } else if (value >= 1e9) {
    return `Rp ${(value / 1e9).toFixed(1)} B`;
  } else if (value >= 1e6) {
    return `Rp ${(value / 1e6).toFixed(1)} M`;
  }
  return `Rp ${value.toLocaleString('id-ID')}`;
};

// Format large numbers
export const formatNumber = (value: number): string => {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`;
  }
  return value.toLocaleString('id-ID');
};
