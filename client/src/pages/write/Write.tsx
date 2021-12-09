import React from 'react'
import styled from 'styled-components'
import { ToastContext } from '../../components/toast/toast'
import { storeEntry, exportStore, getEntry } from '../../lib/store'
import { useUnmountOnceWithDeps } from '../../lib/use-unmount-with-deps'

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
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [hasChanged, setHasChanged] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string>('')

  const toastContext = React.useContext(ToastContext)

  const titleEditor = React.useRef<HTMLInputElement>(null)
  const contentEditor = React.useRef<HTMLTextAreaElement>(null)

  const today = new Date()
  const day = today.toLocaleDateString('sv', { year: 'numeric', month: 'numeric', day: 'numeric'})

  React.useEffect(() => {
    setIsLoading(true)
    getEntry(day).then((entry) => {
      console.log('get entry ressult', entry)
      setTitle(entry.title)
      setContent(entry.content)
      setIsLoading(false)
    }).catch((err) => {
      // Probably found nothing, that's OK
      console.warn(err)
      setIsLoading(false)
    })
  }, [day])

  React.useEffect(() => {
    let intervalHandler = 0
    if (!isLoading && hasChanged) {
      intervalHandler = window.setInterval(() => {
        storeEntry({
          title,
          content,
          day,
        }).then(() => {
          setLastSyncedTime(new Date().toISOString())
          exportStore().catch((err) => {
            toastContext.showToast({ content: 'Failed to sync with backend' })
          })
        })
      }, 5000)
    }

    return () => {
      clearInterval(intervalHandler)
    }
  }, [isLoading, title, content, hasChanged, day])

  useUnmountOnceWithDeps(() => {
    if (hasChanged) {
      storeEntry({
        title,
        content,
        day
      })
      exportStore().catch((err) => {
        toastContext.showToast({ content: 'Failed to sync with backend' })
      })
    }
    // TODO: When this fails, need to notify the user somehow. Maybe
    // with a global toast?
  }, [title, content, hasChanged])

  const handleTitleEditorKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      contentEditor.current?.focus()
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    setHasChanged(true)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setHasChanged(true)
  }

  return (
    <Container>
      {isLoading && <>
        Loading...
      </>}
      {error && <>
        {error}
      </>}
      {!isLoading && !error && <>
        {lastSyncedTime && <>
          Last local sync {lastSyncedTime}
        </>}
        <TitleEditor
          ref={titleEditor}
          value={title}
          onKeyDown={handleTitleEditorKeyDown}
          onChange={handleTitleChange}
          placeholder='Summarize you day in a few words'
        />
        <Editor
          ref={contentEditor}
          value={content}
          onChange={handleContentChange}
          placeholder='How was your day?'
        />
      </>}
    </Container>
  )
}

