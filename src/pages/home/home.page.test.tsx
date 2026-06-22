import { MemoryRouter } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ShopOpenStatus, WaitingListNumberStatus, WaitingListStatusEnum } from '../../dto'
import { useShopStore } from '../../stores'
import { HomePage } from './home.page'

// ── Mocks ──────────────────────────────────────────────────────────────────────

vi.mock('../../components', () => ({
  ActivitySectionComponent: () => <div data-testid="activity-section" />,
  ConfirmTooltip: ({ children, onConfirm }: any) => (
    <button data-testid="confirm-tooltip" onClick={onConfirm}>
      {children}
    </button>
  ),
  ProfileCardComponent: () => <div data-testid="profile-card" />,
  QueueRecapComponent: ({ onOpenNextNumberModal }: any) => (
    <button
      data-testid="open-modal-trigger"
      onClick={() =>
        onOpenNextNumberModal?.({
          id: 'n2',
          value: '2',
          barcode: 'BC-002',
          status: WaitingListNumberStatus.CREATED,
          createdAt: new Date(),
          updatedAt: new Date(),
          waitingListId: 'wl-1',
          deviceId: 'd1',
          waitingList: {} as any,
          device: {} as any,
          waiting_list_number_notification: null,
          waiting_list_number_scan_event: null,
        })
      }
    >
      Open modal
    </button>
  ),
  StatsRowComponent: () => <div data-testid="stats-row" />,
  TopBarComponent: () => <div data-testid="top-bar" />,
}))

vi.mock('../../guards', () => ({
  AuthGuard: ({ children }: any) => <>{children}</>,
}))

// Création des mocks de mutations avec contrôle fin
const mockUpdateListNumberStatus = vi.fn()
const mockUpdateWaitingListInfos = vi.fn()

// Données stables pour éviter les boucles infinies dans useEffect
const MOCK_SHOP_DATA = {
  data: {
    shop: {
      id: 's1',
      name: 'Salon Test',
      address: '123 Rue',
      profileImage: '',
      latitude: 0,
      longitude: 0,
      phone: '',
      email: '',
      isActive: true,
      openStatus: ShopOpenStatus.OPEN,
      createdAt: new Date(),
      updatedAt: new Date(),
      managerId: 'm1',
      manager: {} as any,
      barber_shop_subscription: '',
      barber_shop_waiting_list: [],
      barber_shop_scan_event: '',
    },
  },
}

vi.mock('../../hooks', async () => {
  const actual = await vi.importActual('../../hooks')
  return {
    ...(actual as object),
    useGetShopByManagerHook: () => ({
      data: MOCK_SHOP_DATA,
    }),
    useUpdateListNumberStatusHook: () => ({
      mutate: mockUpdateListNumberStatus,
    }),
    useUpdateWaitingListInfosHook: () => ({
      mutate: mockUpdateWaitingListInfos,
    }),
  }
})

// ── Helpers ────────────────────────────────────────────────────────────────────

const buildNumber = (id: string, value: string, status: WaitingListNumberStatus): any => ({
  id,
  value,
  barcode: `BC-${value.padStart(3, '0')}`,
  status,
  createdAt: new Date(),
  updatedAt: new Date(),
  waitingListId: 'wl-1',
  deviceId: 'd1',
  waitingList: {} as any,
  device: {} as any,
  waiting_list_number_notification: null,
  waiting_list_number_scan_event: null,
})

const baseWaitingList = (numbers: any[]): any => ({
  id: 'wl-1',
  current_number: 1,
  session_date: new Date(),
  status: WaitingListStatusEnum.OPEN,
  createdAt: new Date(),
  updatedAt: new Date(),
  barberShopId: 's1',
  barberShop: {} as any,
  waiting_list_numbers: numbers,
})

const renderHome = () =>
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  )

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('HomePage — logique NEXT number', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useShopStore.setState({
      currentShop: {
        id: 's1',
        name: 'Salon Test',
        address: '123 Rue',
        profileImage: '',
        latitude: 0,
        longitude: 0,
        phone: '',
        email: '',
        isActive: true,
        openStatus: ShopOpenStatus.OPEN,
        createdAt: new Date(),
        updatedAt: new Date(),
        managerId: 'm1',
        manager: {} as any,
        barber_shop_subscription: '',
        barber_shop_waiting_list: [],
        barber_shop_scan_event: '',
      },
      currentWaitingList: baseWaitingList([
        buildNumber('n1', '1', WaitingListNumberStatus.IN_PROGRESS),
        buildNumber('n2', '2', WaitingListNumberStatus.CREATED),
        buildNumber('n3', '3', WaitingListNumberStatus.PENDING),
        buildNumber('n4', '4', WaitingListNumberStatus.CREATED),
      ]),
    })
  })

  // ─────────────────────────────────────────────────────────────────────────────
  it('doit appeler doUpdateListNumberStatus avec IN_PROGRESS sur le numéro courant', async () => {
    const user = userEvent.setup()

    // Simuler : la mutation IN_PROGRESS réussit
    mockUpdateListNumberStatus.mockImplementationOnce((_params: any, options: any) => {
      options?.onSuccess?.({
        data: { waitingListNumber: { id: 'n2', status: WaitingListNumberStatus.IN_PROGRESS } },
      })
    })
    // Simuler : handleTakeNextNumber réussit
    mockUpdateWaitingListInfos.mockImplementationOnce((_params: any, options: any) => {
      options?.onSuccess?.({ data: { waitingList: baseWaitingList([]) } })
    })

    renderHome()

    // Ouvrir la modale
    await user.click(screen.getByTestId('open-modal-trigger'))

    // Cliquer sur "Servir"
    const servirBtn = screen.getByText('✅ Servir')
    await user.click(servirBtn)

    await waitFor(() => {
      // Vérifier l'appel IN_PROGRESS sur n2
      expect(mockUpdateListNumberStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          numberId: 'n2',
          datas: { status: WaitingListNumberStatus.IN_PROGRESS },
        }),
        expect.any(Object),
      )
    })
  })

  // ─────────────────────────────────────────────────────────────────────────────
  it('doit identifier le numéro suivant (CREATED) et le passer en NEXT', async () => {
    const user = userEvent.setup()

    // Mutation IN_PROGRESS → succès
    mockUpdateListNumberStatus.mockImplementationOnce((_params: any, options: any) => {
      options?.onSuccess?.({
        data: { waitingListNumber: { id: 'n2', status: WaitingListNumberStatus.IN_PROGRESS } },
      })
    })
    // Mutation NEXT pour n3
    mockUpdateListNumberStatus.mockImplementationOnce((_params: any, _options: any) => {})
    // handleTakeNextNumber → succès
    mockUpdateWaitingListInfos.mockImplementationOnce((_params: any, options: any) => {
      options?.onSuccess?.({ data: { waitingList: baseWaitingList([]) } })
    })

    renderHome()
    await user.click(screen.getByTestId('open-modal-trigger'))
    await user.click(screen.getByText('✅ Servir'))

    await waitFor(() => {
      // Appel 1 : IN_PROGRESS sur n2
      // Appel 2 : NEXT sur le prochain éligible (n3 = PENDING, valeur 3 > 2)
      const calls = mockUpdateListNumberStatus.mock.calls
      expect(calls.length).toBeGreaterThanOrEqual(2)

      const nextCall = calls.find(
        ([params]: any[]) =>
          params.numberId === 'n3' && params.datas?.status === WaitingListNumberStatus.NEXT,
      )
      expect(nextCall).toBeDefined()
    })
  })

  // ─────────────────────────────────────────────────────────────────────────────
  it('ne doit PAS passer en NEXT un numéro déjà IN_PROGRESS ou COMPLETED', async () => {
    const user = userEvent.setup()

    // Liste : n2(CREATED) → n3(COMPLETED) → n4(CREATED)
    // On sert n2. Le prochain éligible est n4 (n3 est COMPLETED, ignoré)
    useShopStore.setState({
      currentWaitingList: baseWaitingList([
        buildNumber('n1', '1', WaitingListNumberStatus.IN_PROGRESS),
        buildNumber('n2', '2', WaitingListNumberStatus.CREATED),
        buildNumber('n3', '3', WaitingListNumberStatus.COMPLETED),
        buildNumber('n4', '4', WaitingListNumberStatus.CREATED),
      ]),
    })

    mockUpdateListNumberStatus.mockImplementationOnce((_params: any, options: any) => {
      options?.onSuccess?.({
        data: { waitingListNumber: { id: 'n2', status: WaitingListNumberStatus.IN_PROGRESS } },
      })
    })
    mockUpdateListNumberStatus.mockImplementationOnce((_params: any, _options: any) => {})
    mockUpdateWaitingListInfos.mockImplementationOnce((_params: any, options: any) => {
      options?.onSuccess?.({ data: { waitingList: baseWaitingList([]) } })
    })

    renderHome()
    await user.click(screen.getByTestId('open-modal-trigger'))
    await user.click(screen.getByText('✅ Servir'))

    await waitFor(() => {
      const calls = mockUpdateListNumberStatus.mock.calls

      // Doit avoir un appel NEXT pour n4 (pas n3)
      const nextCallN4 = calls.find(
        ([params]: any[]) =>
          params.numberId === 'n4' && params.datas?.status === WaitingListNumberStatus.NEXT,
      )
      expect(nextCallN4).toBeDefined()

      // Ne doit PAS avoir d'appel NEXT pour n3 (COMPLETED)
      const nextCallN3 = calls.find(
        ([params]: any[]) =>
          params.numberId === 'n3' && params.datas?.status === WaitingListNumberStatus.NEXT,
      )
      expect(nextCallN3).toBeUndefined()
    })
  })

  // ─────────────────────────────────────────────────────────────────────────────
  it("ne doit rien faire s'il n'y a pas de numéro suivant", async () => {
    const user = userEvent.setup()

    // Liste : seulement n1 et n2, on sert n2
    useShopStore.setState({
      currentWaitingList: baseWaitingList([
        buildNumber('n1', '1', WaitingListNumberStatus.IN_PROGRESS),
        buildNumber('n2', '2', WaitingListNumberStatus.CREATED),
      ]),
    })

    mockUpdateListNumberStatus.mockImplementationOnce((_params: any, options: any) => {
      options?.onSuccess?.({
        data: { waitingListNumber: { id: 'n2', status: WaitingListNumberStatus.IN_PROGRESS } },
      })
    })
    mockUpdateWaitingListInfos.mockImplementationOnce((_params: any, options: any) => {
      options?.onSuccess?.({ data: { waitingList: baseWaitingList([]) } })
    })

    renderHome()
    await user.click(screen.getByTestId('open-modal-trigger'))
    await user.click(screen.getByText('✅ Servir'))

    await waitFor(() => {
      // Un seul appel à doUpdateListNumberStatus (IN_PROGRESS), pas de NEXT
      const statusCalls = mockUpdateListNumberStatus.mock.calls.filter(
        ([params]: any[]) => params.datas?.status === WaitingListNumberStatus.NEXT,
      )
      expect(statusCalls.length).toBe(0)
    })

    // Mais l'appel IN_PROGRESS a bien eu lieu
    expect(mockUpdateListNumberStatus).toHaveBeenCalledTimes(1)
  })

  // ─────────────────────────────────────────────────────────────────────────────
  it('ne doit pas boucler : le second appel NEXT ne déclenche pas de récursion', async () => {
    const user = userEvent.setup()

    // Premier appel (IN_PROGRESS) → succès
    mockUpdateListNumberStatus.mockImplementationOnce((_params: any, options: any) => {
      options?.onSuccess?.({
        data: { waitingListNumber: { id: 'n2', status: WaitingListNumberStatus.IN_PROGRESS } },
      })
    })
    // Deuxième appel (NEXT) → succès (sans onSuccess dans le code)
    mockUpdateListNumberStatus.mockImplementationOnce((_params: any, _options: any) => {})
    mockUpdateWaitingListInfos.mockImplementationOnce((_params: any, options: any) => {
      options?.onSuccess?.({ data: { waitingList: baseWaitingList([]) } })
    })

    renderHome()
    await user.click(screen.getByTestId('open-modal-trigger'))
    await user.click(screen.getByText('✅ Servir'))

    await waitFor(() => {
      // Exactement 2 appels : IN_PROGRESS + NEXT, pas plus
      expect(mockUpdateListNumberStatus).toHaveBeenCalledTimes(2)
    })
  })
})
