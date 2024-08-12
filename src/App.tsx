import {CssBaseline, ThemeProvider} from "@mui/material";

import {I18NextProvider} from "./providers/I18Next";
import {GlobalErrorBoundaryProvider} from "./providers/GlobalErrorBoundary";
import {CommonLayout} from "./layouts/CommonLayout";
import {theme} from "./styles/muiTheme";
import {MainPage} from './pages/MainPage'

function App() {
  // Renders
  return (
    <I18NextProvider>
      <ThemeProvider theme={theme}>
        {/* @ts-expect-error TS творит херню */}
        <GlobalErrorBoundaryProvider>
          <CssBaseline />

          <CommonLayout>
            <MainPage />
          </CommonLayout>
        </GlobalErrorBoundaryProvider>
      </ThemeProvider>
    </I18NextProvider>
  )
}

export default App
