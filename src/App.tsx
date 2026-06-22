import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

import { ConfirmTooltip } from './components'
import { WaitingListNumberStatus } from './dto'
import {
  type IUpdateListNumberStatusHookParams,
  useUpdateListNumberStatusHook,
  useUpdateWaitingListInfosHook,
} from './hooks'
import {
  CreateNewShop,
  HistoryPage,
  HomePage,
  LoginPage,
  RegisterPage,
  WaitingListPage,
} from './pages'
import { useShopStore } from './stores'
import { useWaitingListNumberStore } from './stores/waiting-list-number'

function App() {
  const { showNextNumberModal, nextNumber, setShowNextNumberModal, setNextNumber } =
    useWaitingListNumberStore()
  const { currentWaitingList, setCurrentWaitingList } = useShopStore()
  const { mutate: doUpdateListNumberStatus } = useUpdateListNumberStatusHook()
  const { mutate: doUpdateWaitingListInfos } = useUpdateWaitingListInfosHook()

  const doCloseModal = () => {
    setShowNextNumberModal(false)
    setNextNumber(null)
  }

  const handleAbsent = () => {
    handleUpdateCurrentNumberStatus(WaitingListNumberStatus.MISSING)
    setShowNextNumberModal(false)
  }

  const handleUpdateCurrentNumberStatus = (statusToHave: WaitingListNumberStatus) => {
    const requestDatas = {
      numberId: nextNumber?.id,
      datas: {
        status: statusToHave,
      },
    }
    doUpdateListNumberStatus(requestDatas as IUpdateListNumberStatusHookParams, {
      onSuccess: (data) => {
        if (data?.data?.waitingListNumber) {
          if (statusToHave === WaitingListNumberStatus.IN_PROGRESS) {
            handleTakeNextNumber()
            // Identifier le numéro suivant et le passer en NEXT
            const candidates = currentWaitingList?.waiting_list_numbers?.filter(
              (item) =>
                [WaitingListNumberStatus.CREATED, WaitingListNumberStatus.PENDING].includes(
                  item.status,
                ) && item.id !== nextNumber?.id,
            )
            if (candidates && candidates.length > 0) {
              const sorted = [...candidates].sort((a, b) => Number(a.value) - Number(b.value))
              const nextInLine = sorted.find(
                (item) => Number(item.value) > Number(nextNumber?.value ?? 0),
              )
              if (nextInLine) {
                doUpdateListNumberStatus({
                  numberId: nextInLine.id,
                  datas: { status: WaitingListNumberStatus.NEXT },
                } as IUpdateListNumberStatusHookParams)
              }
            }
          }
          doCloseModal()
        }
      },
      onError: (error) => {
        console.log('List number status not updated', error)
      },
    })
  }

  const handleTakeNextNumber = () => {
    if (!nextNumber) return
    const requestDatas = {
      listId: nextNumber.waitingListId,
      datas: {
        current_number: Number(nextNumber.value),
      },
    }
    doUpdateWaitingListInfos(requestDatas, {
      onSuccess: (data) => {
        setShowNextNumberModal(false)
        setNextNumber(null)
        setCurrentWaitingList(data?.data?.waitingList)
      },
      onError: (error) => {
        console.log('Waiting list infos not updated', error)
      },
    })
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/waiting-list" element={<WaitingListPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/create-new-shop" element={<CreateNewShop />} />
        </Routes>
      </Router>

      {/* Modal - Numéro Suivant (au niveau de HomePage pour être au premier plan) */}
      {showNextNumberModal && nextNumber && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl text-gray-900">Prochain numéro</h3>
              <button
                onClick={doCloseModal}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </div>

            {/* Numéro */}
            <div className="text-center mb-6">
              <div className="font-serif text-6xl font-bold text-green-600 mb-2">
                {nextNumber.value}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Numéro suivant</div>
            </div>

            {/* Code-barres */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-center">
                <QRCodeSVG
                  value={nextNumber.barcode} // "QF-007-A3F9C12D4E5B6F7A"
                  size={350}
                  level="H"
                  marginSize={2}
                />
              </div>
              <div className="text-center text-sm text-gray-600 font-mono mt-2">
                {nextNumber.barcode}
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-3">
              <ConfirmTooltip
                onConfirm={handleAbsent}
                message="Êtes-vous sûr de vouloir marquer ce client comme absent ?"
                className="flex-1"
              >
                <button className="flex-1 py-3 px-4 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors">
                  🚫 Absent
                </button>
              </ConfirmTooltip>
              <ConfirmTooltip
                onConfirm={() =>
                  handleUpdateCurrentNumberStatus(WaitingListNumberStatus.IN_PROGRESS)
                }
                message="Êtes-vous sûr de vouloir servir ce client ?"
                className="flex-1"
              >
                <button className="flex-1 py-3 px-4 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors">
                  ✅ Servir
                </button>
              </ConfirmTooltip>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
