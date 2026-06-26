import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, TrendingDown, Activity, Clock, Zap, Leaf, Flame,
  ChevronRight, BarChart3, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { companies, priceHistory, marketStats, formatRupiah, formatNumber, Company } from '../data/mockData';

const MarketStats = () => {
  const stats = [
    { label: '24h Volume', value: formatNumber(marketStats.volume24h), change: +12.8, suffix: 'tokens' },
    { label: 'Market Cap', value: formatRupiah(marketStats.marketCap), change: +2.4, suffix: '' },
    { label: 'Circulating Supply', value: formatNumber(marketStats.totalMinted - marketStats.totalBurned), change: +1.2, suffix: 'tokens' },
    { label: 'All-Time High', value: 'Rp 78,500', change: -4.3, suffix: 'from ATH' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-slate-900 border border-slate-700 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs sm:text-sm">{stat.label}</span>
            {!stat.suffix && (
              <span className={stat.change >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                {stat.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </span>
            )}
          </div>
          <p className="text-lg sm:text-xl font-bold text-white">{stat.value}</p>
          {stat.suffix && (
            <p className="text-slate-500 text-xs mt-1">{stat.suffix}</p>
          )}
          {stat.change !== 0 && stat.suffix === '' && (
            <p className={`text-xs mt-1 ${stat.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {stat.change >= 0 ? '+' : ''}{stat.change}%
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

const PriceChartLarge = () => {
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y'>('6M');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  const dataPoints = {
    '1D': 6,
    '1W': 7,
    '1M': 4,
    '3M': 8,
    '6M': 12,
    '1Y': 12
  };

  const filteredData = priceHistory.slice(-dataPoints[timeRange]);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 sm:p-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-slate-900 font-bold text-xs sm:text-sm">CT</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">IDRCT / IDR</h2>
              <p className="text-slate-500 text-xs sm:text-sm">Indonesian Carbon Token</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex gap-0.5 sm:gap-1 bg-slate-800 rounded-lg p-1 overflow-x-auto">
            {(['1D', '1W', '1M', '3M', '6M', '1Y'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2 sm:px-3 py-1 text-xs rounded transition-colors ${
                  timeRange === range
                    ? 'bg-emerald-500 text-slate-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setChartType('area')}
              className={`p-1 sm:p-1.5 rounded transition-colors ${
                chartType === 'area' ? 'bg-slate-700 text-white' : 'text-slate-400'
              }`}
            >
              <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-1 sm:p-1.5 rounded transition-colors ${
                chartType === 'bar' ? 'bg-slate-700 text-white' : 'text-slate-400'
              }`}
            >
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-2 sm:gap-4 mb-4">
        <div>
          <p className="text-2xl sm:text-4xl font-bold text-white">{formatRupiah(marketStats.currentPrice)}</p>
        </div>
        <div className={`flex items-center gap-1 ${
          marketStats.priceChange >= 0 ? 'text-emerald-400' : 'text-red-400'
        }`}>
          {marketStats.priceChange >= 0 ? (
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
          <span className="text-base sm:text-lg font-semibold">
            {marketStats.priceChange >= 0 ? '+' : ''}{marketStats.priceChange}%
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250} className="sm:!h-[350px]">
        {chartType === 'area' ? (
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="marketGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={{ stroke: '#475569' }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={{ stroke: '#475569' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              domain={['dataMin - 5000', 'dataMax + 5000']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                padding: '12px'
              }}
              formatter={(value) => [formatRupiah(Number(value)), 'Price']}
              labelFormatter={(label) => new Date(String(label)).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#marketGradient)"
            />
          </AreaChart>
        ) : (
          <BarChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={{ stroke: '#475569' }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={{ stroke: '#475569' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              domain={['dataMin - 5000', 'dataMax + 5000']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                padding: '12px'
              }}
              formatter={(value) => [formatRupiah(Number(value)), 'Price']}
            />
            <Bar dataKey="price" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

const VolumeChart = () => {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Trading Volume</h2>
          <p className="text-slate-500 text-sm">Monthly token trading activity</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-white">{formatNumber(marketStats.volume24h)}</p>
          <p className="text-xs text-slate-500">24h Volume</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={priceHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            tickLine={{ stroke: '#475569' }}
            tickFormatter={(_, idx) => idx % 2 === 0 ? '' : ''}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            tickLine={{ stroke: '#475569' }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px'
            }}
            formatter={(value) => [formatNumber(Number(value)), 'Volume']}
          />
          <Bar dataKey="volume" fill="#3b82f6" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const TokenDistribution = () => {
  const data = [
    { name: 'Minted (NRE)', value: marketStats.totalMinted, color: '#10b981' },
    { name: 'Burned (Fossil)', value: marketStats.totalBurned, color: '#ef4444' },
  ];

  const circulating = marketStats.totalMinted - marketStats.totalBurned;
  data.push({ name: 'Circulating', value: circulating, color: '#3b82f6' });

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
      <h2 className="text-lg font-semibold text-white mb-4">Token Distribution</h2>

      <div className="flex items-center justify-center mb-4">
        <PieChart width={160} height={160}>
          <Pie
            data={data}
            cx={80}
            cy={80}
            innerRadius={40}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </div>

      <div className="space-y-3">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-slate-400 text-sm">{item.name}</span>
            </div>
            <span className="text-white font-medium text-sm">{formatNumber(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MarketMovers = () => {
  const navigate = useNavigate();

  const movers = companies
    .map((company: Company) => ({
      ...company,
      change: Math.random() * 10 - 3,
    }))
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 5);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Top Movers</h2>
        </div>
        <p className="text-slate-500 text-sm">Companies with highest trading activity</p>
      </div>

      <div className="divide-y divide-slate-800">
        {movers.map((company: Company & { change: number }) => (
          <div
            key={company.id}
            onClick={() => navigate(`/company/${company.id}`)}
            className="flex items-center justify-between p-4 hover:bg-slate-800/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                company.sector === 'Renewable' ? 'bg-emerald-500/20' : 'bg-red-500/20'
              }`}>
                {company.sector === 'Renewable' ? (
                  <Leaf className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Flame className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div>
                <p className="text-sm text-white font-medium">{company.name}</p>
                <p className="text-slate-500 text-xs">{company.sector}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-semibold ${
                company.change >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {company.change >= 0 ? '+' : ''}{company.change.toFixed(2)}%
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecentTrades = () => {
  const trades = [
    { time: '14:32:05', company: 'PT Adaro Energy', type: 'buy', amount: 15000, price: 75200 },
    { time: '14:31:18', company: 'PT PLN EBT', type: 'sell', amount: 8500, price: 74900 },
    { time: '14:30:45', company: 'PT Bukit Asam', type: 'buy', amount: 22000, price: 75100 },
    { time: '14:29:52', company: 'PT Barito Renewables', type: 'sell', amount: 12800, price: 74950 },
    { time: '14:28:30', company: 'PT Pertamina Geothermal', type: 'sell', amount: 18300, price: 74800 },
    { time: '14:27:15', company: 'PT Indonesia Power', type: 'buy', amount: 9500, price: 75300 },
  ];

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-white">Recent Trades</h2>
        </div>
        <p className="text-slate-500 text-sm">Real-time trading activity</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead className="bg-slate-800">
            <tr>
              <th className="text-left text-xs text-slate-500 font-medium px-2 sm:px-4 py-2">Time</th>
              <th className="text-left text-xs text-slate-500 font-medium px-2 sm:px-4 py-2">Company</th>
              <th className="text-center text-xs text-slate-500 font-medium px-2 sm:px-4 py-2">Type</th>
              <th className="text-right text-xs text-slate-500 font-medium px-2 sm:px-4 py-2">Amount</th>
              <th className="text-right text-xs text-slate-500 font-medium px-2 sm:px-4 py-2 hidden sm:table-cell">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {trades.map((trade, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-2 sm:px-4 py-2">
                  <span className="text-xs text-slate-400 font-mono">{trade.time}</span>
                </td>
                <td className="px-2 sm:px-4 py-2">
                  <span className="text-xs sm:text-sm text-white truncate max-w-[100px] sm:max-w-none block">{trade.company}</span>
                </td>
                <td className="px-2 sm:px-4 py-2 text-center">
                  <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded ${
                    trade.type === 'buy'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {trade.type.toUpperCase()}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-2 text-right">
                  <span className="text-xs sm:text-sm text-white font-mono">{trade.amount.toLocaleString()}</span>
                </td>
                <td className="px-2 sm:px-4 py-2 text-right hidden sm:table-cell">
                  <span className="text-xs sm:text-sm text-white font-mono">{formatRupiah(trade.price)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Market = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Market</h1>
          <p className="text-slate-500 text-sm">IDRCT Token Trading Overview</p>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-slate-500">Status:</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Market Open
          </span>
        </div>
      </div>

      <MarketStats />
      <PriceChartLarge />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <RecentTrades />
        </div>
        <div className="space-y-4 sm:space-y-6">
          <VolumeChart />
          <TokenDistribution />
        </div>
      </div>

      <MarketMovers />
    </div>
  );
};

export default Market;
