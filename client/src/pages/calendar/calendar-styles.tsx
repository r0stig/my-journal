import styled, { css } from 'styled-components'

export const Container = styled.div`
  margin: 10px;
  padding: 10px;
  background-color: #fff;
`
export const NavigatorContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 5px;
`

export const Nav = styled.div`
`

export const Current = styled.div`

`

export const WeekdayContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 15px;
  margin-bottom: 10px;
`

interface DayProps {
  marked?: boolean
  today?: boolean
}

export const Day = styled.div<DayProps>`
  text-align: center;
  ${props => props.marked && css`
    font-weight: 700;
  `}
  ${props => props.today && css`
    border: 1px solid #f0f;
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
  text-align: center;
`


