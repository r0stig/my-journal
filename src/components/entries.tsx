import React from 'react'
import styled from 'styled-components'

const Container = styled.div`

`

const ListItem = styled.div`
`

const ListHeader = styled.div``

const ListContent = styled.div``

const ListDate = styled.div``

type Entry = {
  title: string
  createdAt: string
  content: string
}

export function Entries() {
  const entries: Entry[] = [
    {
      title: 'title',
      createdAt: '2021-01-01T12:00:00.000Z',
      content: 'Hejsan hoppsan hur står det till..'
    }
  ]
  return (
    <Container>
      {entries.map((entry) => (
        <ListItem>
          <ListHeader>
            {entry.title}
          </ListHeader>
          <ListContent>
            {entry.content}
          </ListContent>
          <ListDate>
            {entry.createdAt}
          </ListDate>
        </ListItem>
      ))}
    </Container>
  )
}

