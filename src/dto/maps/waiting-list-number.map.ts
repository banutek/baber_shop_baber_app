import { WaitingListNumberStatus } from '../enums'

export const statusListNumberConfig: Record<
  WaitingListNumberStatus,
  { label: string; className: string; dotColor: string; badgeColor: string; sideColor: string }
> = {
  [WaitingListNumberStatus.CREATED]: {
    label: 'En attente',
    className: 'bg-gray-200 text-gray-400',
    dotColor: 'bg-success',
    badgeColor: 'bg-gray-200 text-gray-500',
    sideColor: 'bg-gray-200',
  },
  [WaitingListNumberStatus.NEXT]: {
    label: '⚡ Prochain',
    className: 'bg-yellow-100 text-yellow-600',
    dotColor: 'bg-yellow',
    badgeColor: 'bg-gray-200 text-gray-500',
    sideColor: 'bg-yellow-600',
  },
  [WaitingListNumberStatus.PENDING]: {
    label: 'Présent',
    className: 'bg-amber-50 text-amber-700',
    dotColor: 'bg-gold',
    badgeColor: 'bg-gray-200 text-gray-500',
    sideColor: 'bg-amber-600',
  },
  [WaitingListNumberStatus.IN_PROGRESS]: {
    label: 'En chaise',
    className: 'bg-green-50 text-green-600',
    dotColor: 'bg-yellow-500',
    badgeColor: 'bg-amber-600 text-white',
    sideColor: 'bg-green-600',
  },
  [WaitingListNumberStatus.COMPLETED]: {
    label: 'Terminé',
    className: 'text-green-400 bg-green-500/10',
    dotColor: 'bg-green-500',
    badgeColor: 'bg-amber-100 text-white',
    sideColor: 'bg-green-100',
  },
  [WaitingListNumberStatus.MISSING]: {
    label: 'Absent',
    className: 'text-red-400 bg-red-500/10',
    dotColor: 'bg-red-500',
    badgeColor: 'bg-red-100 text-white',
    sideColor: 'bg-red-100',
  },
}
