import styled, { css } from 'styled-components'

export const TopBar = styled.div`
  width: 100%;
  height: 40px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
`

export const MenuButton = styled.div`
  font-size: 34px;
`

interface MenuWrapperProps {
  active: boolean
}

export const MenuWrapper = styled.div<MenuWrapperProps>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  ${(props) => props.active ? css`
    background-color: rgba(0, 0, 0, 0.3);
    pointer-events: auto;
  ` : css`
    pointer-events: none;
  `}
  transition: background-color .2s ease-in-out;
`

interface MenuContainerProps {
  active: boolean
}

export const MenuContainer = styled.div<MenuContainerProps>`
  position: absolute;
  top: 0;
  left: ${(props) => props.active ? '0' : '-300px'};
  width: 300px;
  height: 100%;
  background-color: #fff;
  transition: left .2s ease-in-out;
  z-index: 10;
`

export const MenuHeader = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
  font-family: Candara, Calibri, Segoe, Segoe UI, Optima, Arial, sans-serif;
`

export const MenuItem = styled.div`
  width: 100%;
  padding: 10px 15px;
  box-sizing: border-box;
  cursor: pointer;

  &:hover {
    background-color: #eee;
  }
`
