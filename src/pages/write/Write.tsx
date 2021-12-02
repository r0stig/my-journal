import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const TitleEditor = styled.input`
  font-family: Verdana;
  font-size: 22px;
  font-weight: 600;
  border: 0;

  &:focus {
    outline: none;
  }
`

const Editor = styled.textarea`
  flex: 1;
  font-family: Verdana;
  font-size: 16px;
  border: 0;

  &:focus {
    outline: none;
  }
`

const Button = styled.button`
  align-self: flex-start;
  padding: 4px;
`

export function Write() {

  const titleEditor = React.useRef<HTMLInputElement>(null)
  const contentEditor = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {

  })

  const handleTitleEditorKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      console.log('enter pressed')
      e.preventDefault()
      contentEditor.current?.focus()
    }
  }

  return (
    <Container>
      <Button>Save</Button>
      <TitleEditor ref={titleEditor} onKeyDown={handleTitleEditorKeyDown} />
      <Editor ref={contentEditor} />
    </Container>
  )
}

