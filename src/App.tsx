import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config/wagmi'
import { Navigation } from './components/Navigation'
import { CoursesPage } from './pages/CoursesPage'
import { TokensPage } from './pages/TokensPage'
import { CreatorPlatformPage } from './pages/CreatorPlatformPage'
import { UserCenterPage } from './pages/UserCenterPage'
import './App.css'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="app">
            <Navigation />
            <Routes>
              <Route path="/" element={<CoursesPage />} />
              <Route path="/tokens" element={<TokensPage />} />
              <Route path="/creator" element={<CreatorPlatformPage />} />
              <Route path="/profile" element={<UserCenterPage />} />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
