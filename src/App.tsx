import {CssBaseline, ThemeProvider} from "@mui/material";
import {useEffect, useState} from "react";

import {I18NextProvider} from "./providers/I18Next";
import {GlobalErrorBoundaryProvider} from "./providers/GlobalErrorBoundary";
import {CommonLayout} from "./layouts/CommonLayout";
import {theme} from "./styles/muiTheme";
import {MainPage} from './pages/MainPage'

function App() {
  // eslint-ignore-next-line @typescript-eslint/no-explicit-any
  const [dataFromParent, setDataFromParent] = useState<null |{ [key: string]: any }>(null)

  // Effects
  useEffect(() => {
    window.parent.postMessage(
      { type: 'QUESTIONNAIRE_IFRAME_READY' },
      '*',
    );

    const listener = (event: MessageEvent) => {
      if (event.data.type === 'INITIAL_PAYLOAD') {
        setDataFromParent({
          paymentId: event.data.content.paymentId
        })
      }
    }

    window.addEventListener('message', listener)

    return () => {
      window.removeEventListener('message', listener)
    }
  }, [])

  // Renders
  if (!dataFromParent) {
    return <div>payment required</div>
  }
  return (
    <I18NextProvider>
      <ThemeProvider theme={theme}>
        {/* @ts-expect-error TS творит херню */}
        <GlobalErrorBoundaryProvider>
          <CssBaseline />

          <CommonLayout>
            <MainPage initData={dataFromParent} />
          </CommonLayout>
        </GlobalErrorBoundaryProvider>
      </ThemeProvider>
    </I18NextProvider>
  )
}

export default App
