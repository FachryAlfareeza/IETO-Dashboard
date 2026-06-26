import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  Leaf, Flame, Building2, Search, ChevronRight,
  SortAsc, SortDesc, TrendingUp, TrendingDown, Zap
} from 'lucide-react';
import { companies, formatNumber } from '../data/mockData';

const Companies = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState<'All' | 'Renewable' | 'Fossil'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'balance' | 'sector'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  const filteredCompanies = companies
    .filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = sectorFilter === 'All' || company.sector === sectorFilter;
      return matchesSearch && matchesSector;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'balance') {
        comparison = a.tokenBalance - b.tokenBalance;
      } else if (sortBy === 'sector') {
        comparison = a.sector.localeCompare(b.sector);
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });

  const renewableCount = companies.filter(c => c.sector === 'Renewable').length;
  const fossilCount = companies.filter(c => c.sector === 'Fossil').length;

  const sectorData = [
    { name: 'Renewable', value: renewableCount, fill: '#10b981' },
    { name: 'Fossil', value: fossilCount, fill: '#ef4444' },
  ];

  const balanceData = [
    { name: 'Surplus', value: companies.filter(c => c.tokenBalance >= 0).length, fill: '#10b981' },
    { name: 'Deficit', value: companies.filter(c => c.tokenBalance < 0).length, fill: '#ef4444' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Companies Directory</h1>
          <p className="text-slate-500">All registered energy sector participants</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">{companies.length}</p>
          <p className="text-slate-500 text-sm">Total Companies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Total Companies</p>
              <p className="text-2xl font-bold text-white">{companies.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Renewable</p>
              <p className="text-2xl font-bold text-emerald-400">{renewableCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Flame className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Fossil Fuel</p>
              <p className="text-2xl font-bold text-red-400">{fossilCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Active Trading</p>
              <p className="text-2xl font-bold text-amber-400">{companies.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search companies by name..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
                    {(['All', 'Renewable', 'Fossil'] as const).map(sector => (
                      <button
                        key={sector}
                        onClick={() => setSectorFilter(sector)}
                        className={`px-3 py-1 text-xs rounded transition-colors ${
                          sectorFilter === sector
                            ? sector === 'Renewable' ? 'bg-emerald-500 text-slate-900' :
                              sector === 'Fossil' ? 'bg-red-500 text-white' :
                              'bg-slate-700 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {sector}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('table')}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        viewMode === 'table' ? 'bg-slate-700 text-white' : 'text-slate-400'
                      }`}
                    >
                      Table
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400'
                      }`}
                    >
                      Grid
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800">
                    <tr>
                      <th
                        className="text-left text-xs text-slate-400 font-medium px-4 py-3 cursor-pointer hover:text-white"
                        onClick={() => toggleSort('name')}
                      >
                        <div className="flex items-center gap-2">
                          Company
                          {sortBy === 'name' && (sortDir === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
                        </div>
                      </th>
                      <th
                        className="text-left text-xs text-slate-400 font-medium px-4 py-3 cursor-pointer hover:text-white"
                        onClick={() => toggleSort('sector')}
                      >
                        <div className="flex items-center gap-2">
                          Sector
                          {sortBy === 'sector' && (sortDir === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
                        </div>
                      </th>
                      <th className="text-right text-xs text-slate-400 font-medium px-4 py-3">Quota</th>
                      <th
                        className="text-right text-xs text-slate-400 font-medium px-4 py-3 cursor-pointer hover:text-white"
                        onClick={() => toggleSort('balance')}
                      >
                        <div className="flex items-center justify-end gap-2">
                          Balance
                          {sortBy === 'balance' && (sortDir === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
                        </div>
                      </th>
                      <th className="text-center text-xs text-slate-400 font-medium px-4 py-3">Status</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredCompanies.map(company => (
                      <tr
                        key={company.id}
                        onClick={() => navigate(`/company/${company.id}`)}
                        className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              company.sector === 'Renewable' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                            }`}>
                              {company.sector === 'Renewable' ? (
                                <Leaf className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <Flame className="w-5 h-5 text-red-400" />
                              )}
                            </div>
                            <span className="text-sm text-white font-medium">{company.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded ${
                            company.sector === 'Renewable'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {company.sector}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm text-white font-mono">
                            {formatNumber(company.quota)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className={`text-sm font-semibold font-mono ${
                              company.tokenBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                              {company.tokenBalance >= 0 ? '+' : ''}{formatNumber(company.tokenBalance)}
                            </span>
                            {company.tokenBalance >= 0 ? (
                              <TrendingUp className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            company.tokenBalance >= 0
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {company.tokenBalance >= 0 ? 'COMPLIANT' : 'DEFICIT'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCompanies.map(company => (
                    <div
                      key={company.id}
                      onClick={() => navigate(`/company/${company.id}`)}
                      className={`bg-slate-800 border rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                        company.sector === 'Renewable'
                          ? 'border-emerald-500/20 hover:border-emerald-500/50'
                          : 'border-red-500/20 hover:border-red-500/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            company.sector === 'Renewable' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                          }`}>
                            {company.sector === 'Renewable' ? (
                              <Leaf className="w-6 h-6 text-emerald-400" />
                            ) : (
                              <Flame className="w-6 h-6 text-red-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-white font-medium line-clamp-1">{company.name}</p>
                            <span className={`text-xs ${
                              company.sector === 'Renewable' ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                              {company.sector} Energy
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-xs">Token Balance</span>
                          <span className={`text-lg font-bold ${
                            company.tokenBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {company.tokenBalance >= 0 ? '+' : ''}{formatNumber(company.tokenBalance)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-xs">Carbon Quota</span>
                          <span className="text-white text-sm">{formatNumber(company.quota)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-xs">Status</span>
                          <span className={`text-xs ${
                            company.tokenBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {company.tokenBalance >= 0 ? 'COMPLIANT' : 'NON-COMPLIANT'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-4">Sector Distribution</h3>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={sectorData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-4">Compliance Status</h3>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={balanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {balanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs">Total Quota</span>
                <span className="text-white font-medium">
                  {formatNumber(companies.reduce((sum, c) => sum + c.quota, 0))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs">Net Token Balance</span>
                <span className={`font-medium ${
                  companies.reduce((sum, c) => sum + c.tokenBalance, 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {formatNumber(companies.reduce((sum, c) => sum + c.tokenBalance, 0))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs">Compliance Rate</span>
                <span className="text-white font-medium">
                  {Math.round((companies.filter(c => c.tokenBalance >= 0).length / companies.length) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;
