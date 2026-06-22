import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { QueueCardComponent } from './queue-card.component'

describe('QueueCardComponent', () => {
  const defaultProps = {
    number: '08',
    name: 'Youssef Amrani',
    meta: ['Compte client', 'iOS'],
    badge: '⚡ Prochain',
    badgeType: 'amber',
    elapsed: 'Attend depuis 32 min',
  }

  it('should render number, name, badge and elapsed time', () => {
    render(<QueueCardComponent {...defaultProps} />)
    expect(screen.getByText('08')).toBeInTheDocument()
    expect(screen.getByText('Youssef Amrani')).toBeInTheDocument()
    expect(screen.getByText('⚡ Prochain')).toBeInTheDocument()
    expect(screen.getByText('Attend depuis 32 min')).toBeInTheDocument()
  })

  it('should render all meta items', () => {
    render(<QueueCardComponent {...defaultProps} />)
    expect(screen.getByText('Compte client')).toBeInTheDocument()
    expect(screen.getByText('iOS')).toBeInTheDocument()
  })

  it('should show avatar letter Y for Youssef', () => {
    render(<QueueCardComponent {...defaultProps} />)
    expect(screen.getByText('Y')).toBeInTheDocument()
  })

  it('should show avatar letter K for Karim', () => {
    render(<QueueCardComponent {...defaultProps} name="Karim Idrissi" />)
    expect(screen.getByText('K')).toBeInTheDocument()
  })

  it('should show ? for unknown names', () => {
    render(<QueueCardComponent {...defaultProps} name="Anonyme" />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('should apply green side color for green badgeType', () => {
    const { container } = render(<QueueCardComponent {...defaultProps} badgeType="green" />)
    expect(container.querySelector('.bg-green-500')).toBeInTheDocument()
  })

  it('should show skip button', () => {
    render(<QueueCardComponent {...defaultProps} />)
    expect(screen.getByText('Sauter')).toBeInTheDocument()
  })
})
