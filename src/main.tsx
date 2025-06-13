import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { appPages } from '@/settings'
import { Layout } from '@/components'
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
