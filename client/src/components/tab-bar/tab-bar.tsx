import React from 'react'
import { Container, TabItem } from './tab-bar-styles'

export type Tabs = 'calendar' | 'write' | 'list'
interface Props {
  onTabClick: (item: Tabs) => void
}

export const TabBar: React.FC<Props> = ({ onTabClick }) => {
  const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>, item: Tabs) => {
    e.preventDefault()
    onTabClick(item)
  }

  return (
    <Container>
      <TabItem size='normal' onClick={(e) => handleTabClick(e, 'calendar')}>
        <span className='material-icons'>
          event
        </span>
      </TabItem>
      <TabItem size='large' onClick={(e) => handleTabClick(e, 'write')}>
      <span className='material-icons'>
        add
        </span>
      </TabItem>
      <TabItem size='normal' onClick={(e) => handleTabClick(e, 'list')}>
        <span className='material-icons'>
          list
        </span>
      </TabItem>
    </Container>
  )
}

