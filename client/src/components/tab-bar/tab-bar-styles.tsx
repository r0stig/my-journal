import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  display: flex;
  position: fixed;
  bottom: 0;
`

export const TabItem = styled.a`
  flex: 1;

  display: flex;
  box-sizing: border-box;
  justify-content: center;
  font-size: 22px;
  padding: 10px 0;

  &:hover {
    background-color: #eee;
    cursor: pointer;
  }
`
