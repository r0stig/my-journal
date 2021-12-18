import styled, { css } from 'styled-components'

export const Container = styled.div`
  padding: 10px;
  width: 300px;
`

export const Label = styled.label`
  display: block;
  font-size: 18px;
  margin-bottom: 10px;
`

export const Input = styled.input`
  width: 100%;
  display: block;
  border: 1px solid #aaa;
  padding: 10px 15px;
  box-sizing: border-box;
  font-size: 18px;
  margin-bottom: 10px;
`

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
`

interface ButtonProps {
  displayType: 'primary' | 'secondary'
}

export const Button = styled.button<ButtonProps>`
  padding: 10px 15px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: no-wrap;

  ${(props) => props.displayType === 'primary' ? css`
    border: none;
    background-color: #1B593C;
    color: #fff;
  ` : css`
    border: 1px solid #ddd;
    background-color: #fff;
    color: #000;
  `}

  ${ButtonGroup} &:first-child {
    margin-right: 10px;
  }
  ${ButtonGroup} & {
    flex: 1;
  }
`
