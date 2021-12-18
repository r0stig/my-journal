import React from 'react'
import { Container, Wrapper } from './modal-styles'

interface Props {
  onClose: () => void
}

export const Modal: React.FC<React.PropsWithChildren<Props>> = ({ children, onClose }) => {
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  return (
    <Wrapper onClick={onClose}>
      <Container onClick={handleContainerClick}>
        {children}
      </Container>
    </Wrapper>
  )
}
