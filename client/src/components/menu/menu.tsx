import React from 'react'
import { MenuContainer, TopBar, MenuWrapper, MenuButton, MenuItem, MenuHeader } from './menu-styles'
import { useAccount } from '../../lib/use-account'
import { useStore } from '../../lib/store'
import { ChangePasswordModal } from '../change-password-modal/change-password-modal'
import { SyncCredModal } from '../sync-cred-modal/sync-cred-modal'

interface Props {

}

export const Menu: React.FC<React.PropsWithChildren<Props>> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = React.useState<boolean>(false)
  const [isSyncCredModalOpen, setIsSyncCredModalOpen] = React.useState<boolean>(false)
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

  const handleChangePasswordClick = () => {
    setIsOpen(false)
    setIsChangePasswordModalOpen(true)
  }

  const handleSetSyncCredClick = () => {
    setIsOpen(false)
    setIsSyncCredModalOpen(true)
  }

  const handleChangePasswordModalClose = () => {
    setIsChangePasswordModalOpen(false)
  }

  const handleSyncCredModalClose = () => {
    setIsSyncCredModalOpen(false)
  }

  const handleLockClick = () => {
    signOut()
    resetStore()
  }

  return (
    <>
      {isChangePasswordModalOpen && <ChangePasswordModal onClose={handleChangePasswordModalClose} />}
      {isSyncCredModalOpen && <SyncCredModal onClose={handleSyncCredModalClose} />}
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
          <MenuItem onClick={handleChangePasswordClick}>
            Change password
          </MenuItem>
          <MenuItem onClick={handleSetSyncCredClick}>
            Set sync credentials
          </MenuItem>
          <MenuItem onClick={handleLockClick}>
            Lock
          </MenuItem>
        </MenuContainer>
      </MenuWrapper>
    </>
  )
}
