import { PropsWithChildren, ReactElement } from 'react'
import { makeStyles } from 'tss-react/mui'
import { Container } from "@mui/material"

const CommonLayout = ({ children }: PropsWithChildren): ReactElement => {
  const { classes } = useStyles()

  // Renders
  return (
    <main className={classes.main}>
      <Container maxWidth="xl">
        {children}
      </Container>
    </main>
  )
}

const useStyles = makeStyles()(() => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    background: '#FAF9FF',
    height: '100%',
    position: 'relative',
    paddingTop: 30,
    paddingBottom: 30,
    '> div': {
      maxWidth: 992,
    }
  },
}))

export { CommonLayout }
