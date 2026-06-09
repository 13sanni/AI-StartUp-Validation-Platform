import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AnalysisPage from './pages/AnalysisPage'
import ReportPage from './pages/ReportPage'

export default function App() {
  const location = useLocation()

  return (
    <>
      <div className="noise-overlay" />
      <Navbar />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(13, 15, 28, 0.95)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            fontSize: '0.9rem',
          },
        }}
      />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/analyzing" element={<AnalysisPage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}
