import React from 'react'
import { Modal } from '../modal/modal'
import { Input, Label, Button, Container, ButtonGroup, ErrorContainer, SuccessContainer } from '../login-modal/login-modal-styles'
import { useStore } from '../../lib/store'
import { useAuth } from '../../lib/use-auth'

interface Props {
  onClose: () => void
}

export const SyncCredModal: React.FC<Props> = ({ onClose }) => {
  const [user, setUser] = React.useState<string>('user')
  const [password, setPassword] = React.useState<string>('abc123')
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string>('')
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
      setError('')
      setIsSuccess(false)
      setIsLoading(true)
      const formData = new FormData()
      formData.append('username', user)
      formData.append('password', password)
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        body: formData
      })
      if (response.status === 200) {
        const result = await response.json()
        console.log('loginresult', result)
        setToken(result.token)
        setUser('')
        setPassword('')
        setIsSuccess(true)
      } else if (response.status === 403) {
        setError('Wrong username or password')
      } else {
        setError('Something went wrong...')
      }
      setIsLoading(false)
    }
  }

  return (
    <Modal onClose={onClose}>
      <Container>
        <Label>Set sync credentials</Label>
        <form onSubmit={handleFormSubmit}>
          <Input
            placeholder='Username'
            value={user}
            onChange={handleUserChange}
          />
          <Input
            placeholder='Password'
            value={password}
            onChange={handlePasswordChange}
          />
          {error && <ErrorContainer>{error}</ErrorContainer>}
          {isSuccess && <SuccessContainer>Successfully signed in</SuccessContainer>}
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
