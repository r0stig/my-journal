import React from 'react'
import { Modal } from '../modal/modal'
import { Input, Label, Button, Container } from './login-modal-styles'

interface Props {
  onLogin: (password: string) => void
}

export const LoginModal: React.FC<Props> = ({ onLogin }) => {
  const [password, setPassword] = React.useState<string>('abc123')

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(password)
  }

  return (
    <Modal onClose={() => {}}>
      <Container>
        <Label>Password</Label>
        <form onSubmit={handleFormSubmit}>
          <Input
            value={password}
            onChange={handlePasswordChange}
          />
          <Button type='submit'>Sign in</Button>
        </form>
      </Container>
    </Modal>
  )
}
