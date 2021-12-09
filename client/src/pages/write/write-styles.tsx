import styled from 'styled-components'



export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`
export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
`

export const HeaderNav = styled.div`
`

export const InfoNav = styled.div`
`

export const ActionsNav = styled.div`
`

export const TitleEditor = styled.input`
  font-family: Verdana;
  font-size: 22px;
  font-weight: 600;
  border: 0;
  padding: 10px;

  &:focus {
    outline: none;
  }
`

export const Editor = styled.textarea`
  flex: 1;
  font-family: Verdana;
  font-size: 16px;
  border: 0;
  padding: 10px;

  &:focus {
    outline: none;
  }
`

export const Button = styled.button`
  align-self: flex-start;
  padding: 4px;
`
