import React from 'react'
import { MenuContainer, TopBar, MenuWrapper, MenuButton, MenuItem, MenuHeader } from './menu-styles'

interface Props {

}

export const Menu: React.FC<React.PropsWithChildren<Props>> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  const handleMenuButtoonClick = () => {
    setIsOpen(true)
  }

  const handleOutsideClick = () => {
    setIsOpen(false)
  }

  const handleMenuClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
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
          <MenuItem>
            Lock
          </MenuItem>
        </MenuContainer>
      </MenuWrapper>
    </>
  )
}
