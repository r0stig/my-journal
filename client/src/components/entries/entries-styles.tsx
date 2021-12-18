import styled from 'styled-components'

export const Container = styled.div`
  padding-bottom: 100px;
  background-color: #eee;
`

export const EntryCard = styled.div`
  display: flex;
  margin: 10px;
  padding: 10px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
`

export const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 10px;
  padding-right: 20px;
`

export const ContentContainer = styled.div`
  overflow: hidden;

`

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  text-overflow: ellipsis;
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
  font-size: 26px;
  font-weight: 600;
  color: #333;
`

export const Month = styled.div`
  white-space: nowrap;
  font-size: 14px;
  color: #333;
`

export const Content = styled.div`
  padding-top: 5px;
`
