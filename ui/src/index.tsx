import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { LoadAnimation } from './components/LoadAnimation/LoadAnimation'
import App from './App'
import { theme } from './theme'
import './i18n.tsx'

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Suspense
        fallback={
          <div style={{ padding: 50 }}>
            <LoadAnimation sizePx={30} />
          </div>
        }>
        <App />
      </Suspense>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
