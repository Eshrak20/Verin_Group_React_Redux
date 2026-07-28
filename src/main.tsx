import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider } from 'react-router'
import { router } from './routes'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { ActiveCategoryProvider } from './utils/ActiveCategoryContext'
import { HelmetProvider } from "react-helmet-async";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
    <ActiveCategoryProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ActiveCategoryProvider>
    </HelmetProvider>
  </StrictMode>,
)
