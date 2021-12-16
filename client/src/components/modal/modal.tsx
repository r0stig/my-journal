import React from 'react'
import { Container, Wrapper } from './modal-styles'

interface Props {

}

export const Modal: React.FC<React.PropsWithChildren<Props>> = ({ children }) => {

  return (
    <Wrapper>
      <Container>
        {children}
      </Container>
    </Wrapper>
  )
}
