import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import {
  TrendingUp, TrendingDown, AlertTriangle, Leaf, Flame, Factory, Search, ChevronRight, Clock
} from 'lucide-react';
import { companies, priceHistory, marketStats, complianceWatchlist, formatRupiah, formatNumber } from '../data/mockData';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, color }: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  color: 'emerald' | 'red' | 'blue';
}) => {
  const colorClasses = {
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          <p className="text-slate-500 text-xs mt-1">{subtitle}</p>
        </div>
        <div className={`p-2 rounded-lg bg-slate-800/50`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700/50">
          <span className={trend.value >= 0 ? 'text-emerald-400' : 'text-red-400'}>
            {trend.value >= 0 ? <TrendingUp className="w-4 h-4 inline mr-1" /> : <TrendingDown className="w-4 h-4 inline mr-1" />}
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </span>
          <span className="text-slate-500 text-xs">{trend.label}</span>
        </div>
      )}
    </div>
  );
};

const PriceChart = () => {
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M'>('6M');

  const filteredData = priceHistory.slice(-{
    '1M': 4,
    '3M': 8,
    '6M': 12
  }[timeRange]);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-white">IDRCT Price Trend</h2>
          <p className="text-slate-500 text-xs sm:text-sm">Indonesian Carbon Token - 6 Month Performance</p>
        </div>
        <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
          {(['1M', '3M', '6M'] as const).map(range => (
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
      </div>

      <ResponsiveContainer width="100%" height={200} className="sm:!h-[280px]">
        <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
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
            yAxisId="left"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickLine={{ stroke: '#475569' }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            domain={['dataMin - 2000', 'dataMax + 2000']}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickLine={{ stroke: '#475569' }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              padding: '12px'
            }}
            labelStyle={{ color: '#94a3b8', marginBottom: '8px' }}
            itemStyle={{ color: '#fff' }}
            formatter={(value, name) => [
              name === 'price' ? formatRupiah(Number(value)) : formatNumber(Number(value)),
              name === 'price' ? 'Price' : 'Volume'
            ]}
            labelFormatter={(label) => new Date(String(label)).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="price"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#priceGradient)"
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="volume"
            stroke="#3b82f6"
            strokeWidth={1}
            fill="transparent"
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-emerald-500"></div>
          <span className="text-slate-400">Price (IDR)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-blue-500" style={{ borderStyle: 'dashed' }}></div>
          <span className="text-slate-400">Volume</span>
        </div>
      </div>
    </div>
  );
};

const CompanyScreener = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState<'All' | 'Renewable' | 'Fossil'>('All');
  const navigate = useNavigate();

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === 'All' || company.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      <div className="p-3 sm:p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-white">Company Screener</h2>
          <span className="text-slate-500 text-xs sm:text-sm">{filteredCompanies.length} companies</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Filter companies..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
            {(['All', 'Renewable', 'Fossil'] as const).map(sector => (
              <button
                key={sector}
                onClick={() => setSectorFilter(sector)}
                className={`px-2 sm:px-3 py-1 text-xs rounded transition-colors ${
                  sectorFilter === sector
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto max-h-72 sm:max-h-96 overflow-y-auto">
        <table className="w-full min-w-[500px]">
          <thead className="bg-slate-800 sticky top-0">
            <tr>
              <th className="text-left text-xs text-slate-400 font-medium px-3 sm:px-4 py-2 sm:py-3">Company</th>
              <th className="text-left text-xs text-slate-400 font-medium px-3 sm:px-4 py-2 sm:py-3">Sector</th>
              <th className="text-right text-xs text-slate-400 font-medium px-3 sm:px-4 py-2 sm:py-3">Balance</th>
              <th className="text-right text-xs text-slate-400 font-medium px-3 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">Status</th>
              <th className="w-8 sm:w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredCompanies.map(company => (
              <tr
                key={company.id}
                onClick={() => navigate(`/company/${company.id}`)}
                className="hover:bg-slate-800/50 cursor-pointer transition-colors"
              >
                <td className="px-3 sm:px-4 py-2 sm:py-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      company.sector === 'Renewable' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                    }`}>
                      {company.sector === 'Renewable' ? (
                        <Leaf className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                      ) : (
                        <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                      )}
                    </div>
                    <span className="text-xs sm:text-sm text-white font-medium truncate max-w-[120px] sm:max-w-none">{company.name}</span>
                  </div>
                </td>
                <td className="px-3 sm:px-4 py-2 sm:py-3">
                  <span className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ${
                    company.sector === 'Renewable'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {company.sector === 'Renewable' ? 'NRE' : 'Fossil'}
                  </span>
                </td>
                <td className="px-3 sm:px-4 py-2 sm:py-3 text-right hidden sm:table-cell">
                  <span className={`text-xs ${
                    company.tokenBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {company.tokenBalance >= 0 ? 'SURPLUS' : 'DEFICIT'}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ComplianceWatchlist = () => {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      <div className="p-3 sm:p-4 border-b border-slate-700 bg-gradient-to-r from-red-500/10 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            <h2 className="text-base sm:text-lg font-semibold text-white">Compliance Watchlist</h2>
          </div>
          <span className="text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded">
            {complianceWatchlist.length} ALERTS
          </span>
        </div>
        <p className="text-slate-500 text-sm mt-1">Fossil fuel companies approaching penalty deadline</p>
      </div>

      <div className="divide-y divide-slate-800">
        {complianceWatchlist.map(company => (
          <Link
            key={company.id}
            to={`/company/${company.id}`}
            className="block p-3 sm:p-4 hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-red-500/20 rounded-lg mt-0.5">
                  <Factory className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-white">{company.name}</p>
                  <div className="flex items-center gap-2 sm:gap-4 mt-1">
                    <span className="text-red-400 text-xs sm:text-sm font-semibold">
                      Deficit: {formatNumber(Math.abs(company.tokenBalance))}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{company.deadline}</span>
                </div>
                <p className="text-red-400 text-xs mt-1 hidden sm:block">
                  Est. Penalty: Rp {company.estimatedPenalty}B
                </p>
              </div>
            </div>

            <div className="mt-2 sm:mt-3">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Progress</span>
                <span>{Math.round(Math.random() * 30 + 10)}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full"
                  style={{ width: `${Math.random() * 30 + 10}%` }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const MarketOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Total Tokens Minted"
        value={formatNumber(marketStats.totalMinted)}
        subtitle="NRE Generated"
        icon={Leaf}
        trend={{ value: 3.5, label: 'this month' }}
        color="emerald"
      />
      <StatCard
        title="Total Tokens Burned"
        value={formatNumber(marketStats.totalBurned)}
        subtitle="Fossil Fuels Offset"
        icon={Flame}
        trend={{ value: -2.1, label: 'this month' }}
        color="red"
      />
      <StatCard
        title="Current Token Price"
        value={formatRupiah(marketStats.currentPrice)}
        subtitle="IDRCT/IDR"
        icon={TrendingUp}
        trend={{ value: marketStats.priceChange, label: '24h' }}
        color="blue"
      />
    </div>
  );
};

const SectorDistribution = () => {
  const renewableCount = companies.filter(c => c.sector === 'Renewable').length;
  const fossilCount = companies.filter(c => c.sector === 'Fossil').length;

  const data = [
    { name: 'Renewable', value: renewableCount, fill: '#10b981' },
    { name: 'Fossil', value: fossilCount, fill: '#ef4444' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
      <h2 className="text-lg font-semibold text-white mb-4">Sector Distribution</h2>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
          <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 space-y-2">
        {data.map(item => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: item.fill }} />
              <span className="text-slate-400">{item.name}</span>
            </div>
            <span className="text-white font-medium">{item.value} companies</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Carbon Token Dashboard</h1>
          <p className="text-slate-500 text-sm">Bursa Karbon Indonesia - Real-time Market Overview</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs text-slate-500">Last Updated</p>
          <p className="text-sm text-white">
            {new Date().toLocaleString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      <MarketOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <PriceChart />
        </div>
        <div className="space-y-4 sm:space-y-6">
          <SectorDistribution />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <CompanyScreener />
        </div>
        <div>
          <ComplianceWatchlist />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
