import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App'
import './index.css'
import './i18n.tsx'

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <Suspense fallback="loading">
        <App />
      </Suspense>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
