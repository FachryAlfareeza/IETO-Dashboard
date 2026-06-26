import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import Companies from './pages/Companies';
import CompanyPage from './pages/CompanyPage';

// Error boundary to catch any rendering issues
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: string | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white' }}>
          <h1 style={{ color: '#ef4444' }}>Something went wrong</h1>
          <pre style={{ color: '#94a3b8' }}>{this.state.error}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/market" element={<Market />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/company/:id" element={<CompanyPage />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ErrorBoundary>
  );
}

export default App;
