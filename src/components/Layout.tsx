import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, TrendingDown, Search, LayoutDashboard, BarChart3, Building2, Bell, Menu, X } from 'lucide-react';
import { marketStats, formatRupiah, companies } from '../data/mockData';

const Header: React.FC = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof companies>([]);
  const [showResults, setShowResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = companies.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/market', label: 'Market', icon: BarChart3 },
    { path: '/companies', label: 'Companies', icon: Building2 },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-700">
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 gap-2">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
              <span className="text-slate-900 font-bold text-sm">CT</span>
            </div>
            <span className="text-white font-semibold hidden sm:inline text-sm">Bursa Karbon</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
                  location.pathname === path
                    ? 'bg-slate-800 text-emerald-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div ref={searchRef} className="relative z-50 flex-1 max-w-xs sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowResults(true)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {showResults && searchResults.length > 0 && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto">
              {searchResults.map(company => (
                <Link
                  key={company.id}
                  to={`/company/${company.id}`}
                  onClick={() => {
                    setSearchQuery('');
                    setShowResults(false);
                  }}
                  className="flex items-center justify-between px-4 py-2 hover:bg-slate-700 transition-colors"
                >
                  <div>
                    <p className="text-white text-sm">{company.name}</p>
                    <p className="text-slate-500 text-xs">{company.sector}</p>
                  </div>
                  <span className={`text-sm font-medium ${
                    company.tokenBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {company.tokenBalance >= 0 ? '+' : ''}{company.tokenBalance.toLocaleString()}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
            <div className="text-right">
              <p className="text-xs text-slate-500">IDRCT</p>
              <p className="text-sm font-semibold text-white">{formatRupiah(marketStats.currentPrice)}</p>
            </div>
            <div className={`flex items-center gap-1 ${marketStats.priceChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {marketStats.priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-sm font-medium">{marketStats.priceChange >= 0 ? '+' : ''}{marketStats.priceChange}%</span>
            </div>
          </div>

          <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-700 px-4 py-3">
          <nav className="flex flex-col gap-2">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  location.pathname === path
                    ? 'bg-slate-800 text-emerald-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-4 p-3 bg-slate-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">IDRCT Price</span>
              <span className="text-sm font-semibold text-white">{formatRupiah(marketStats.currentPrice)}</span>
            </div>
            <div className={`flex items-center justify-end gap-1 mt-1 ${marketStats.priceChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {marketStats.priceChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span className="text-xs">{marketStats.priceChange >= 0 ? '+' : ''}{marketStats.priceChange}%</span>
            </div>
          </div>
        </div>
      )}

      <PriceTicker />
    </header>
  );
};

const PriceTicker: React.FC = () => {
  const tickerItems = [
    { symbol: 'IDRCT', price: 'Rp 75,000', change: '+2.4%', up: true },
    { symbol: 'IDRCT-VOL', price: '3.25M', change: '+12.8%', up: true },
    { symbol: 'NRE-INDEX', price: '1,248.50', change: '+1.2%', up: true },
    { symbol: 'FOSSIL-INDEX', price: '892.30', change: '-0.8%', up: false },
    { symbol: 'CARBON-CREDIT', price: 'Rp 72,500', change: '+1.8%', up: true },
    { symbol: 'VOL-24H', price: '2.85T', change: '+5.2%', up: true },
    { symbol: 'BURN-RATE', price: '12.8M', change: '-2.1%', up: false },
    { symbol: 'MINT-RATE', price: '45M', change: '+3.5%', up: true },
  ];

  return (
    <div className="bg-slate-950 border-b border-slate-800 overflow-hidden py-1">
      <div className="ticker-wrapper">
        <div className="ticker-content">
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 sm:gap-6 px-2 sm:px-4 text-xs whitespace-nowrap">
              <span className="text-slate-500">{item.symbol}</span>
              <span className="text-white font-medium">{item.price}</span>
              <span className={item.up ? 'text-emerald-400' : 'text-red-400'}>{item.up ? '+' : ''}{item.change}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="pt-24 sm:pt-28 pb-8 px-2 sm:px-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
