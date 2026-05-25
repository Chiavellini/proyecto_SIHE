import { useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import HomePage from './components/HomePage.jsx';
import GenericPage from './components/GenericPage.jsx';
import RedeliveryPage from './components/RedeliveryPage.jsx';
import { flattenNavigationItems } from './data/siteData.js';

export default function App() {
  const [contactOpen, setContactOpen] = useState(false);
  const pages = useMemo(() => flattenNavigationItems(), []);

  return (
    <BrowserRouter>
      <Layout contactOpen={contactOpen} onContactClose={() => setContactOpen(false)}>
        <Routes>
          <Route path="/" element={<HomePage onContactOpen={() => setContactOpen(true)} />} />
          <Route path="/home" element={<HomePage onContactOpen={() => setContactOpen(true)} />} />
          <Route path="/pedir-reentrega" element={<Navigate to="/reprogramar-entrega" replace />} />
          <Route path="/re-entrega" element={<Navigate to="/reprogramar-entrega" replace />} />
          {pages
            .filter((page) => !['/', '/home'].includes(page.path))
            .map((page) => (
              <Route
                key={page.path}
                path={page.path}
                element={
                  page.kind === 'redelivery' ? (
                    <RedeliveryPage page={page} onContactOpen={() => setContactOpen(true)} />
                  ) : (
                    <GenericPage page={page} onContactOpen={() => setContactOpen(true)} />
                  )
                }
              />
            ))}
          <Route
            path="*"
            element={
              <GenericPage
                page={{ label: 'Estafeta', path: '/', kind: 'service' }}
                onContactOpen={() => setContactOpen(true)}
              />
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
