import {CssBaseline, ThemeProvider} from "@mui/material";
import {useCallback, useEffect, useState} from "react";

import {I18NextProvider} from "./providers/I18Next";
import {GlobalErrorBoundaryProvider} from "./providers/GlobalErrorBoundary";
import {CommonLayout} from "./layouts/CommonLayout";
import {theme} from "./styles/muiTheme";
import {MainPage} from './pages/MainPage'
import {OrderData} from "./types/orderData";
import {appConfig} from "./config";
import {InitialOrderResponse} from "./types/wpResponses";

function App() {
  const [orderData, setOrderData] = useState<OrderData>({
    token: null,
    data: null
  })

  const fetchOrderData = useCallback(async (orderId: string): Promise<InitialOrderResponse> => {
    const result = await fetch(
      `${appConfig.apiEndpoint}/wp-json/myplugin/v1/posts/${orderId}`,
      { method: 'GET' }
    )

    if (!result.ok) {
      console.error('An error happened on request to WP order')
    }

    return await result.json()
  }, [])

  // Effects
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('d');

    if (orderId) {
      fetchOrderData(orderId)
        .then((res) => {
          if (res?.status && res?.token) {
            setOrderData({
              data: orderId,
              token: res?.token
            })
          } else {
            console.error('An error happened on request to WP order')
          }
        })
        .catch(() => {
          console.error('An error happened on request to WP order')
        })
    }
  }, [fetchOrderData])

  // Renders
  return (
    <I18NextProvider>
      <ThemeProvider theme={theme}>
        {/* @ts-expect-error TS творит херню */}
        <GlobalErrorBoundaryProvider>
          <CssBaseline />

          <CommonLayout>
            <MainPage orderData={orderData} />
          </CommonLayout>
        </GlobalErrorBoundaryProvider>
      </ThemeProvider>
    </I18NextProvider>
  )
}

export default App
