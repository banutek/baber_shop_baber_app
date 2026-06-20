import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HistoryItemComponent } from './history-item.component'

describe('HistoryItemComponent', () => {
  it('should render icon, text and time', () => {
    render(
      <HistoryItemComponent
        icon="✅"
        iconType="green"
        text="N°06 terminé"
        time="10:41"
        duration="21 min"
      />,
    )
    expect(screen.getByText('✅')).toBeInTheDocument()
    expect(screen.getByText('N°06 terminé')).toBeInTheDocument()
    expect(screen.getByText('10:41')).toBeInTheDocument()
    expect(screen.getByText('21 min')).toBeInTheDocument()
  })

  it('should not show duration when not provided', () => {
    render(<HistoryItemComponent icon="⏭" iconType="red" text="N°05 sauté" time="10:17" />)
    expect(screen.getByText('N°05 sauté')).toBeInTheDocument()
    expect(screen.queryByText(/min/)).not.toBeInTheDocument()
  })

  it('should apply green background for green iconType', () => {
    const { container } = render(
      <HistoryItemComponent icon="✅" iconType="green" text="Done" time="09:00" />,
    )
    const iconDiv = container.querySelector('.bg-green-50')
    expect(iconDiv).toBeInTheDocument()
  })

  it('should apply red background for red iconType', () => {
    const { container } = render(
      <HistoryItemComponent icon="⏭" iconType="red" text="Skipped" time="10:00" />,
    )
    expect(container.querySelector('.bg-red-50')).toBeInTheDocument()
  })

  it('should apply red duration color for red durationType', () => {
    const { container } = render(
      <HistoryItemComponent
        icon="⏭"
        iconType="red"
        text="Skipped"
        time="10:00"
        duration="Sauté"
        durationType="red"
      />,
    )
    expect(container.querySelector('.bg-red-50.text-red-500')).toBeInTheDocument()
  })
})
