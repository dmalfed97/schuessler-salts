import React, { Component, PropsWithChildren, ErrorInfo } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Box, Container, Stack } from '@mui/material';

interface GlobalErrorBoundaryState {
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class GlobalErrorBoundary extends Component<
  PropsWithChildren<WithTranslation>,
  GlobalErrorBoundaryState
> {
  constructor(props: Readonly<PropsWithChildren<WithTranslation>>) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(caughtError: Error, errorInfo: ErrorInfo) {
    alert(caughtError);

    this.setState({
      error: caughtError,
      errorInfo,
    });
  }

  render() {
    if (this.state.error) {
      if (this.state.error.message === 'Network Error') {
        return (
          <Container>
            <Stack alignItems="center" spacing={4}>
              <Box width={280} mt={10}>
                Error happened, please refresh the page
              </Box>
            </Stack>
          </Container>
        );
      }
    }
    return this.props.children;
  }
}

// Явное указание типа для обёрнутого компонента
const WrappedGlobalErrorBoundary = withTranslation()(GlobalErrorBoundary);

// @ts-expect-error Ts излишне жестит
export const GlobalErrorBoundaryProvider: React.ComponentType<PropsWithChildren<WithTranslation>> = WrappedGlobalErrorBoundary;
