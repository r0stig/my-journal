import styled, { css} from 'styled-components'

export const Container = styled.div`
  width: 100%;
  display: flex;
  position: fixed;
  bottom: 0;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 30px;
  margin-bottom: 10px;
  box-sizing: border-box;
`

interface TabItemProps {
  size?: 'normal' | 'large'
}

export const TabItem = styled.a<TabItemProps>`
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  padding: 10px 0;

  ${props => props.size === 'normal' ? css`
    width: 75px;
    height: 75px;
  ` : css`
    width: 90px;
    height: 90px;
  `}
  border-radius: 50%;
  background-color: #ddd;

  &:hover {
    background-color: #ccc;
    cursor: pointer;
  }

  & span {
    font-size: 35px;
    color: #555;
  }
`
