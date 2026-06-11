import { WaitingListNumberStatus } from "../enums";


export const statusListNumberConfig: Record<WaitingListNumberStatus, { label: string; className: string; dotColor: string; badgeColor: string }> = {
    [WaitingListNumberStatus.CREATED]: {
        label: 'En attente',
        className: 'bg-gray-200 text-gray-400',
        dotColor: 'bg-success',
        badgeColor: 'bg-gray-200 text-gray-500',
    },
    [WaitingListNumberStatus.NEXT]: {
        label: 'Prochain',
        className: 'text-gold bg-gold/10',
        dotColor: 'bg-gold',
        badgeColor: 'bg-gray-200 text-gray-500',
    },
    [WaitingListNumberStatus.PENDING]: {
        label: 'Présent',
        className: 'bg-amber-50 text-amber-700',
        dotColor: 'bg-gold',
        badgeColor: 'bg-gray-200 text-gray-500',
    },
    [WaitingListNumberStatus.IN_PROGRESS]: {
        label: 'En chaise',
        className: 'bg-green-50 text-green-600',
        dotColor: 'bg-yellow-500',
        badgeColor: 'bg-amber-600 text-white',
    },
    [WaitingListNumberStatus.COMPLETED]: {
        label: 'Terminé',
        className: 'text-green-400 bg-green-500/10',
        dotColor: 'bg-green-500',
        badgeColor: 'bg-amber-100 text-white',
    },
    [WaitingListNumberStatus.MISSING]: {
        label: 'Absent',
        className: 'text-red-400 bg-red-500/10',
        dotColor: 'bg-red-500',
        badgeColor: 'bg-red-100 text-white',
    },
}
