import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Layout from './components/Layout/Layout.tsx'
import { appPages } from './settings/routes.settings.tsx'
import './index.scss'
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: appPages,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
