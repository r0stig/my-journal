import React from 'react'
import { MenuContainer, TopBar, MenuWrapper, MenuButton, MenuItem, MenuHeader } from './menu-styles'
import { useAccount } from '../../lib/use-account'
import { useStore } from '../../lib/store'

interface Props {

}

export const Menu: React.FC<React.PropsWithChildren<Props>> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const { signOut } = useAccount()
  const { resetStore } = useStore()

  const handleMenuButtoonClick = () => {
    setIsOpen(true)
  }

  const handleOutsideClick = () => {
    setIsOpen(false)
  }

  const handleMenuClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  const handleLockClick = () => {
    signOut()
    resetStore()
  }

  return (
    <>
      <TopBar>
        <MenuButton onClick={handleMenuButtoonClick} className='material-icons'>
            menu
        </MenuButton>
      </TopBar>
      <MenuWrapper onClick={handleOutsideClick} active={isOpen}>
        <MenuContainer onClick={handleMenuClick} active={isOpen}>
          <MenuHeader>
            My journal
          </MenuHeader>
          <MenuItem>
            Change password
          </MenuItem>
          <MenuItem onClick={handleLockClick}>
            Lock
          </MenuItem>
        </MenuContainer>
      </MenuWrapper>
    </>
  )
}
