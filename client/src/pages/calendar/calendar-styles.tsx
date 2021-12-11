import styled from 'styled-components'

export const Container = styled.div`
  padding: 10px;
`

export const WeekdayContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
`

export const Day = styled.div`

`

interface DaysContainerProps {
  startDay: number
}

export const DaysContainer = styled(WeekdayContainer)<DaysContainerProps>`
  ${Day}:first-child {
    grid-column: ${props => props.startDay};
  }
`

export const WeekdayHeader = styled.div`

`


