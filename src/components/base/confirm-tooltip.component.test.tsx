import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ConfirmTooltip } from '../base/confirm-tooltip.component'

describe('ConfirmTooltip', () => {
  it('should render the trigger children', () => {
    render(
      <ConfirmTooltip onConfirm={() => {}}>
        <button>Clique-moi</button>
      </ConfirmTooltip>,
    )
    expect(screen.getByText('Clique-moi')).toBeInTheDocument()
  })

  it('should show confirmation popup on trigger click', async () => {
    const user = userEvent.setup()
    render(
      <ConfirmTooltip onConfirm={() => {}}>
        <button>Action</button>
      </ConfirmTooltip>,
    )

    await user.click(screen.getByText('Action'))

    expect(
      screen.getByText('Êtes-vous sûr de vouloir effectuer cette action ?'),
    ).toBeInTheDocument()
    expect(screen.getByText('Non')).toBeInTheDocument()
    expect(screen.getByText('Oui')).toBeInTheDocument()
  })

  it('should show custom message', async () => {
    const user = userEvent.setup()
    render(
      <ConfirmTooltip onConfirm={() => {}} message="Vraiment supprimer ?">
        <button>Supprimer</button>
      </ConfirmTooltip>,
    )

    await user.click(screen.getByText('Supprimer'))

    expect(screen.getByText('Vraiment supprimer ?')).toBeInTheDocument()
  })

  it('should call onConfirm and close popup when Oui is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()

    render(
      <ConfirmTooltip onConfirm={onConfirm}>
        <button>Valider</button>
      </ConfirmTooltip>,
    )

    await user.click(screen.getByText('Valider'))
    await user.click(screen.getByText('Oui'))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Oui')).not.toBeInTheDocument()
  })

  it('should close popup without calling onConfirm when Non is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()

    render(
      <ConfirmTooltip onConfirm={onConfirm}>
        <button>Annuler</button>
      </ConfirmTooltip>,
    )

    await user.click(screen.getByText('Annuler'))
    await user.click(screen.getByText('Non'))

    expect(onConfirm).not.toHaveBeenCalled()
    expect(screen.queryByText('Non')).not.toBeInTheDocument()
  })

  it('should not open popup when disabled', async () => {
    const user = userEvent.setup()

    render(
      <ConfirmTooltip onConfirm={() => {}} disabled={true}>
        <button>Désactivé</button>
      </ConfirmTooltip>,
    )

    await user.click(screen.getByText('Désactivé'))

    expect(screen.queryByText('Oui')).not.toBeInTheDocument()
    expect(screen.queryByText('Non')).not.toBeInTheDocument()
  })

  it('should use custom labels', async () => {
    const user = userEvent.setup()

    render(
      <ConfirmTooltip onConfirm={() => {}} confirmLabel="Confirmer" cancelLabel="Annuler">
        <button>Go</button>
      </ConfirmTooltip>,
    )

    await user.click(screen.getByText('Go'))

    expect(screen.getByText('Confirmer')).toBeInTheDocument()
    expect(screen.getByText('Annuler')).toBeInTheDocument()
  })
})
