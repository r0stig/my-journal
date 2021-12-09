import styled from 'styled-components'

export const EntryCard = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`

export const Title = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 20px;
  padding-right: 10px;
`

export const Date = styled.div`
  white-space: nowrap;
  font-size: 14px;
  color: #999;
`

export const Content = styled.div`
  padding-top: 10px;
`
