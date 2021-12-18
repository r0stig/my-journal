import React from 'react'
import { ToastContext } from '../../components/toast/toast'
import { useStore } from '../../lib/store'
import { useUnmountOnceWithDeps } from '../../lib/use-unmount-with-deps'
import { ActionsNav, Container, Editor, Header, HeaderNav, InfoNav, TitleEditor } from './write-styles'

function sync () {

}

interface Props {
  entryKey: string
  onBack: () => void
}

export const Write: React.FC<Props> = ({ entryKey, onBack }) => {
  const [title, setTitle] = React.useState<string>('')
  const [content, setContent] = React.useState<string>('')
  const [lastSyncedTime, setLastSyncedTime] = React.useState<string>('')
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [hasChanged, setHasChanged] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string>('')

  const toastContext = React.useContext(ToastContext)

  const { storeEntry, exportStore, getEntry} = useStore()

  const titleEditor = React.useRef<HTMLInputElement>(null)
  const contentEditor = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    setIsLoading(true)
    getEntry(entryKey).then((entry) => {
      if (entry) {
        setTitle(entry.title)
        setContent(entry.content)
      }
      console.log('get entry ressult', entry)
      setIsLoading(false)
    }).catch((err) => {
      // Probably found nothing, that's OK
      console.warn(err)
      setIsLoading(false)
    })
  }, [entryKey])

  React.useEffect(() => {
    let intervalHandler = 0
    if (!isLoading && hasChanged) {
      intervalHandler = window.setInterval(() => {
        storeEntry({
          title,
          content,
          day: entryKey,
        }).then(() => {

          setLastSyncedTime(new Date().toLocaleTimeString('sv', { hour: '2-digit', minute: '2-digit', second: '2-digit'}))
          exportStore().catch((err) => {
            toastContext.showToast({ content: 'Failed to sync with backend' })
          })
        })
      }, 5000)
    }

    return () => {
      clearInterval(intervalHandler)
    }
  }, [isLoading, title, content, hasChanged, entryKey])

  useUnmountOnceWithDeps(() => {
    if (hasChanged) {
      storeEntry({
        title,
        content,
        day: entryKey
      })
      exportStore().catch((err) => {
        toastContext.showToast({ content: 'Failed to sync with backend' })
      })
    }
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

  const handleBackClick = () => {
    onBack()
  }

  return (
    <Container>
      <Header>
        <HeaderNav onClick={handleBackClick}>
          Back
        </HeaderNav>
        <InfoNav>
          {lastSyncedTime && <>
            Saved {lastSyncedTime}
          </>}
        </InfoNav>
      </Header>
      {isLoading && <>
        Loading...
      </>}
      {error && <>
        {error}
      </>}
      {!isLoading && !error && <>

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

