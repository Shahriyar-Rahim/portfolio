import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'

const savedTheme = localStorage.getItem("portfolio-theme")
document.documentElement.dataset.theme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 15 * 1000,
      refetchInterval: 30 * 1000,
      refetchIntervalInBackground: true,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
