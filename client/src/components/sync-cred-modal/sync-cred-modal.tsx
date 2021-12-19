import React from 'react'
import { Modal } from '../modal/modal'
import { Input, Label, Button, Container, ButtonGroup } from '../login-modal/login-modal-styles'
import { useStore } from '../../lib/store'
import { useAuth } from '../../lib/use-auth'

interface Props {
  onClose: () => void
}

export const SyncCredModal: React.FC<Props> = ({ onClose }) => {
  const [user, setUser] = React.useState<string>('user')
  const [password, setPassword] = React.useState<string>('abc123')
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const { setToken } = useAuth()

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleCancelClick = () => {
    onClose()
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoading) {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('username', user)
      formData.append('password', password)
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        body: formData
      })
      const result = await response.json()

      console.log('loginresult', result)
      setToken(result.token)

      setIsLoading(false)
    }
  }

  return (
    <Modal onClose={onClose}>
      <Container>
        <Label>Set sync credentials</Label>
        <form onSubmit={handleFormSubmit}>
        <Input
            value={user}
            onChange={handleUserChange}
          />
          <Input
            value={password}
            onChange={handlePasswordChange}
          />
          <ButtonGroup>
            <Button
              displayType='secondary'
              type='button'
              onClick={handleCancelClick}
            >
              Cancel
            </Button>
            <Button
              displayType='primary'
              type='submit'
            >
              {isLoading ? 'Loading...' : 'Save'}
            </Button>
          </ButtonGroup>
        </form>
      </Container>
    </Modal>
  )
}
