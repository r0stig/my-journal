import React from 'react'
import styled from 'styled-components'
import { storeEntry, exportStore } from '../../lib/store'

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

function sync () {

}

export function Write() {
  const [title, setTitle] = React.useState<string>('')
  const [content, setContent] = React.useState<string>('')
  const [lastSyncedTime, setLastSyncedTime] = React.useState<string>('')

  const titleEditor = React.useRef<HTMLInputElement>(null)
  const contentEditor = React.useRef<HTMLTextAreaElement>(null)



  React.useEffect(() => {
    const today = new Date()
    const day = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`

    const intervalHandler = setInterval(() => {
      storeEntry({
        title,
        content,
        day
      }).then(() => {
        setLastSyncedTime(new Date().toISOString())
      })

      exportStore()
    }, 5000)

    return () => {
      clearInterval(intervalHandler)
    }
  }, [title, content])

  const handleTitleEditorKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      contentEditor.current?.focus()
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  return (
    <Container>
      <Button>Save</Button>
      {lastSyncedTime && <>
        Last synced {lastSyncedTime}
      </>}
      <TitleEditor
        ref={titleEditor}
        onKeyDown={handleTitleEditorKeyDown}
        onChange={handleTitleChange}
      />
      <Editor
        ref={contentEditor}
        onChange={handleContentChange}
      />
    </Container>
  )
}

