import React from 'react'
import { Modal } from '../modal/modal'
import { Input, Label, Button, Container, ButtonGroup } from '../login-modal/login-modal-styles'
import { useStore } from '../../lib/store'

interface Props {
  onClose: () => void
}

export const SyncCredModal: React.FC<Props> = ({ onClose }) => {
  const [user, setUser] = React.useState<string>('user')
  const [password, setPassword] = React.useState<string>('abc123')
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

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
