import React from 'react'
import { Modal } from '../modal/modal'
import { Input, Label, Button, Container, ButtonGroup } from '../login-modal/login-modal-styles'
import { useStore } from '../../lib/store'

interface Props {
  onClose: () => void
}

export const ChangePasswordModal: React.FC<Props> = ({ onClose }) => {
  const [password, setPassword] = React.useState<string>('abc123')
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const { changePassword } = useStore()

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
      await changePassword(password)
      setIsLoading(false)
    }
  }

  return (
    <Modal onClose={onClose}>
      <Container>
        <Label>New password</Label>
        <form onSubmit={handleFormSubmit}>
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
