import React from 'react'
import { Container, Content } from './toast-styles'

type Toast = {
  content: string
}

export const ToastContext = React.createContext({
  showToast: (toast: Toast) => {}
})



export const Toaster: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [toast, setToast] = React.useState<Toast | undefined>(undefined)

  React.useEffect(() => {
    const hideTimeout = window.setTimeout(() => {
      setToast(undefined)
    }, 3000)
    return () => {
      clearTimeout(hideTimeout)
    }
  }, [toast])

  const handleShowToast = (toast: Toast) => {
    setToast(toast)
  }

  return (
    <ToastContext.Provider value={{
      showToast: handleShowToast
    }}>
      {children}
      {toast && <Container>
        <Content>
          {toast.content}
        </Content>
      </Container>}

    </ToastContext.Provider>
  )
}
