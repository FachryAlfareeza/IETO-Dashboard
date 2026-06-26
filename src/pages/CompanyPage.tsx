import { useParams, Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line
} from 'recharts';
import {
  Leaf, Flame, TrendingUp, ArrowLeft, AlertTriangle,
  Calendar, Factory, Coins, Building2, BarChart3, Clock, Zap, Target, Wallet
} from 'lucide-react';
import { getCompanyById, formatRupiah, formatNumber, priceHistory } from '../data/mockData';

const CompanyNotFound = () => (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-12 text-center">
      <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-white mb-2">Company Not Found</h2>
      <p className="text-slate-500 mb-6">The company you're looking for doesn't exist in our records.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-900 rounded-lg font-medium hover:bg-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  </div>
);

const StatusBadge = ({ balance }: { balance: number }) => {
  const isPositive = balance >= 0;
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
      isPositive
        ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30'
        : 'bg-gradient-to-r from-red-500/20 to-red-600/10 border border-red-500/30'
    }`}>
      {isPositive ? (
        <Leaf className="w-5 h-5 text-emerald-400" />
      ) : (
        <AlertTriangle className="w-5 h-5 text-red-400" />
      )}
      <span className={`text-lg font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
        {isPositive ? 'SURPLUS' : 'DEFICIT'}
      </span>
      <span className={`text-2xl font-bold ${isPositive ? 'text-emerald-300' : 'text-red-300'}`}>
        {isPositive ? '+' : ''}{formatNumber(balance)}
      </span>
      <span className="text-slate-500 text-sm">Tokens</span>
    </div>
  );
};

const EmissionsChart = ({ company }: { company: ReturnType<typeof getCompanyById> }) => {
  if (!company) return null;

  const quarters = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'];
  const data = company.emissions.map((emission, idx) => ({
    quarter: quarters[idx],
    quota: Math.round(company.quota / 4),
    emissions: emission,
    surplus: Math.round(company.quota / 4) - emission,
  }));

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Emissions vs. Government Quota</h2>
          <p className="text-slate-500 text-sm">Quarterly comparison over the last fiscal year</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-slate-400">Government Quota</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-slate-400">Actual Emissions</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis
            dataKey="quarter"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickLine={{ stroke: '#475569' }}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickLine={{ stroke: '#475569' }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              padding: '12px'
            }}
            formatter={(value, name) => [
              `${Number(value).toLocaleString('id-ID')} tonnes CO₂`,
              name === 'quota' ? 'Government Quota' : 'Actual Emissions'
            ]}
          />
          <Bar
            dataKey="quota"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
          <Bar
            dataKey="emissions"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 p-3 bg-slate-800 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Total Annual Quota</span>
          <span className="text-blue-400 font-semibold">{formatNumber(company.quota)} tonnes</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-slate-400">Total Emissions (YTD)</span>
          <span className="text-red-400 font-semibold">
            {formatNumber(company.emissions.reduce((a, b) => a + b, 0))} tonnes
          </span>
        </div>
      </div>
    </div>
  );
};

const TradingHistoryChart = ({ company }: { company: ReturnType<typeof getCompanyById> }) => {
  if (!company) return null;

  const data = company.tradingHistory.map(trade => ({
    date: trade.date,
    amount: trade.type === 'buy' ? trade.amount : -trade.amount,
    type: trade.type,
    cumulative: company.tradingHistory
      .filter(t => t.date <= trade.date)
      .reduce((sum, t) => sum + (t.type === 'buy' ? t.amount : -t.amount), 0)
  }));

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Token Trading History</h2>
          <p className="text-slate-500 text-sm">Monthly purchase and sale activity</p>
        </div>
        <div className={`text-xs px-2 py-1 rounded ${
          company.sector === 'Renewable'
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-red-500/20 text-red-400'
        }`}>
          {company.sector === 'Renewable' ? 'NET SELLER' : 'NET BUYER'}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="buyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="sellGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickLine={{ stroke: '#475569' }}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickLine={{ stroke: '#475569' }}
            tickFormatter={(value) => `${Math.abs(value) >= 1000 ? `${(Math.abs(value) / 1000).toFixed(0)}K` : Math.abs(value)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              padding: '12px'
            }}
            formatter={(value) => [
              `${Math.abs(Number(value)).toLocaleString('id-ID')} tokens`,
              Number(value) >= 0 ? 'Purchased' : 'Sold'
            ]}
            labelFormatter={(label) => `${label} 2026`}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#sellGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-xs text-slate-400">Total Purchased</p>
          <p className="text-lg font-semibold text-red-400">
            {formatNumber(company.tradingHistory
              .filter(t => t.type === 'buy')
              .reduce((sum, t) => sum + t.amount, 0)
            )}
          </p>
        </div>
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <p className="text-xs text-slate-400">Total Sold</p>
          <p className="text-lg font-semibold text-emerald-400">
            {formatNumber(company.tradingHistory
              .filter(t => t.type === 'sell')
              .reduce((sum, t) => sum + t.amount, 0)
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

const PenaltyCalculator = ({ company }: { company: ReturnType<typeof getCompanyById> }) => {
  if (!company || company.tokenBalance >= 0) return null;

  const penaltyPerToken = 35000; // Rp 35,000 per token deficit
  const estimatedPenalty = Math.abs(company.tokenBalance) * penaltyPerToken;

  return (
    <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 rounded-xl p-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-red-500/20 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Penalty Impact Calculator</h2>
          <p className="text-slate-400 text-sm">Estimated consequences if deficit not cleared</p>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-400 text-sm">Token Deficit</span>
          <span className="text-red-400 font-semibold">{formatNumber(Math.abs(company.tokenBalance))}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-400 text-sm">Penalty Rate</span>
          <span className="text-white">{formatRupiah(penaltyPerToken)} / token</span>
        </div>
        <div className="border-t border-slate-700 my-3"></div>
        <div className="flex items-center justify-between">
          <span className="text-white font-medium">Estimated Government Penalty</span>
          <span className="text-2xl font-bold text-red-400">
            {formatRupiah(estimatedPenalty)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 bg-red-500/10 rounded-lg">
        <Clock className="w-4 h-4 text-red-400" />
        <span className="text-sm text-red-400">
          Deadline: {company.deadline} remaining to clear deficit
        </span>
      </div>
    </div>
  );
};

const SurplusRewards = ({ company }: { company: ReturnType<typeof getCompanyById> }) => {
  if (!company || company.tokenBalance < 0) return null;

  const tokenValue = company.tokenBalance * 75000;

  return (
    <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-xl p-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-emerald-500/20 rounded-lg">
          <Zap className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Surplus Benefits</h2>
          <p className="text-slate-400 text-sm">Token value and market opportunities</p>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-400 text-sm">Token Surplus</span>
          <span className="text-emerald-400 font-semibold">{formatNumber(company.tokenBalance)}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-400 text-sm">Current Market Price</span>
          <span className="text-white">{formatRupiah(75000)}</span>
        </div>
        <div className="border-t border-slate-700 my-3"></div>
        <div className="flex items-center justify-between">
          <span className="text-white font-medium">Estimated Market Value</span>
          <span className="text-2xl font-bold text-emerald-400">
            {formatRupiah(tokenValue)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 bg-emerald-500/10 rounded-lg">
        <Target className="w-4 h-4 text-emerald-400" />
        <span className="text-sm text-emerald-400">
          Carbon credit leader - Top {Math.floor(Math.random() * 5 + 1)}% of NRE companies
        </span>
      </div>
    </div>
  );
};

const ActionButtons = ({ company }: { company: ReturnType<typeof getCompanyById> }) => {
  if (!company) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      <button className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-900 font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all">
        <Wallet className="w-5 h-5" />
        SELL TOKENS
      </button>
      <button className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-400 hover:to-blue-500 transition-all">
        <Coins className="w-5 h-5" />
        BUY TOKENS
      </button>
    </div>
  );
};

const MarketPriceWidget = () => {
  const latestPrices = priceHistory.slice(-6);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">IDRCT Price Trend</h2>
          <p className="text-slate-500 text-sm">Recent market activity</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-white">{formatRupiah(75000)}</p>
          <p className="text-xs text-emerald-400">+2.4% today</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={latestPrices}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <YAxis hide domain={['dataMin - 500', 'dataMax + 500']} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px'
            }}
            formatter={(value) => [formatRupiah(Number(value)), 'Price']}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const CompanyPage = () => {
  const { id } = useParams<{ id: string }>();
  const company = getCompanyById(id || '');

  if (!company) {
    return <CompanyNotFound />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/"
          className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              company.sector === 'Renewable' ? 'bg-emerald-500/20' : 'bg-red-500/20'
            }`}>
              {company.sector === 'Renewable' ? (
                <Leaf className="w-6 h-6 text-emerald-400" />
              ) : (
                <Flame className="w-6 h-6 text-red-400" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{company.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-xs px-2 py-1 rounded ${
                  company.sector === 'Renewable'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {company.sector} Energy
                </span>
                <span className="text-slate-500 text-sm flex items-center gap-1">
                  <Factory className="w-3 h-3" />
                  Energy Sector
                </span>
              </div>
            </div>
          </div>
        </div>
        <StatusBadge balance={company.tokenBalance} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Coins className="w-4 h-4" />
            <span className="text-xs">Token Balance</span>
          </div>
          <p className={`text-2xl font-bold ${
            company.tokenBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {company.tokenBalance >= 0 ? '+' : ''}{formatNumber(company.tokenBalance)}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs">Annual Quota</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatNumber(company.quota)}</p>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">YTD Emissions</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatNumber(company.emissions.reduce((a, b) => a + b, 0))}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">Status</span>
          </div>
          <p className={`text-lg font-bold ${
            company.tokenBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {company.tokenBalance >= 0 ? 'COMPLIANT' : 'NON-COMPLIANT'}
          </p>
          {company.deadline && (
            <p className="text-slate-500 text-xs">{company.deadline} to penalty</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmissionsChart company={company} />
        <TradingHistoryChart company={company} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MarketPriceWidget />
          <ActionButtons company={company} />
        </div>
        <div>
          {company.sector === 'Fossil' ? (
            <PenaltyCalculator company={company} />
          ) : (
            <SurplusRewards company={company} />
          )}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
        <h2 className="text-lg font-semibold text-white mb-4">Company Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-slate-500 text-xs mb-1">Headquarters</p>
            <p className="text-white font-medium">Jakarta, Indonesia</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1">Registration Date</p>
            <p className="text-white font-medium">Jan 2024</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1">Compliance Officer</p>
            <p className="text-white font-medium">Environmental Division</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
