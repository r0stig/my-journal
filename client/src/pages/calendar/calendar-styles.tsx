import styled, { css } from 'styled-components'

export const Container = styled.div`
  padding: 10px;
`

export const WeekdayContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-bottom: 10px;
`

interface DayProps {
  marked?: boolean
}

export const Day = styled.div<DayProps>`
  ${props => props.marked && css`
    font-weight: 600;
  `}
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


