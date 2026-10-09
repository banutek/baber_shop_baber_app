import type React from 'react'
import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import type { IManageShopServicesListDtoIn, IServicesProvidedDtoOut } from '../../../dto'
import {
  useGetAllServicesHook,
  useManageServicesProvidedHook,
} from '../../../hooks/services-provided'
import { useShopStore, useToastStore } from '../../../stores'

interface IGroupedService extends IServicesProvidedDtoOut {
  children: IGroupedService[]
}

export interface IServicesProvidedComponentProps {
  default_props?: boolean
  default_method?: () => void
}

const groupServices = (services: IServicesProvidedDtoOut[]): IGroupedService[] => {
  const servicesById = new Map<string, IGroupedService>()

  services.forEach((service) => {
    servicesById.set(service.id, { ...service, children: [] })
  })

  const rootServices: IGroupedService[] = []

  servicesById.forEach((service) => {
    const parent = service.parentId ? servicesById.get(service.parentId) : undefined

    if (parent) {
      parent.children.push(service)
    } else {
      rootServices.push(service)
    }
  })

  return rootServices
}

const countServices = (services: IGroupedService[]): number =>
  services.reduce((total, service) => total + 1 + countServices(service.children), 0)

const getServiceBranch = (service: IGroupedService): IGroupedService[] => [
  service,
  ...service.children.flatMap(getServiceBranch),
]

export const ServicesProvidedComponent: React.FC<IServicesProvidedComponentProps> = () => {
  const { data, isLoading, isError } = useGetAllServicesHook()
  const { mutate: manageServices, isPending: isManagingServices } = useManageServicesProvidedHook()
  const { currentShop, setCurrentShop } = useShopStore()
  const addToast = useToastStore((store) => store.addToast)
  const queryClient = useQueryClient()

  const [selectedServicesToConnect, setSelectedServicesToConnect] = useState<string[]>([])
  const [selectedServicesToDisconnect, setSelectedServicesToDisconnect] = useState<string[]>([])
  const [expandedServices, setExpandedServices] = useState<Set<string>>(() => new Set())

  const listServices = useMemo(() => groupServices(data?.data.services ?? []), [data])
  const connectedServiceIds = useMemo(
    () => new Set(currentShop?.barber_shop_service?.map((service) => service.id) ?? []),
    [currentShop?.barber_shop_service],
  )
  const hasChanges = selectedServicesToConnect.length > 0 || selectedServicesToDisconnect.length > 0

  const isConnectedToShop = (service: IGroupedService) => connectedServiceIds.has(service.id)

  const isServiceSelected = (service: IGroupedService) =>
    isConnectedToShop(service)
      ? !selectedServicesToDisconnect.includes(service.id)
      : selectedServicesToConnect.includes(service.id)

  const handleServiceSelection = (service: IGroupedService, shouldConnect: boolean) => {
    const affectedServices = getServiceBranch(service)
    const affectedIds = new Set(affectedServices.map((affectedService) => affectedService.id))

    if (shouldConnect) {
      setSelectedServicesToConnect((selected) => [
        ...new Set([
          ...selected,
          ...affectedServices
            .filter((affectedService) => !isConnectedToShop(affectedService))
            .map((affectedService) => affectedService.id),
        ]),
      ])
      setSelectedServicesToDisconnect((selected) =>
        selected.filter((serviceId) => !affectedIds.has(serviceId)),
      )
      return
    }

    setSelectedServicesToDisconnect((selected) => [
      ...new Set([
        ...selected,
        ...affectedServices
          .filter((affectedService) => isConnectedToShop(affectedService))
          .map((affectedService) => affectedService.id),
      ]),
    ])
    setSelectedServicesToConnect((selected) =>
      selected.filter((serviceId) => !affectedIds.has(serviceId)),
    )
  }

  const toggleServiceExpansion = (serviceId: string) => {
    setExpandedServices((expanded) => {
      const nextExpanded = new Set(expanded)

      if (nextExpanded.has(serviceId)) {
        nextExpanded.delete(serviceId)
      } else {
        nextExpanded.add(serviceId)
      }

      return nextExpanded
    })
  }

  const handleManageServices = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!currentShop?.id || !hasChanges || isManagingServices) return

    const datas: IManageShopServicesListDtoIn = {
      connect: selectedServicesToConnect,
      disconnect: selectedServicesToDisconnect,
    }

    manageServices(
      { shopId: currentShop.id, datas },
      {
        onSuccess: async (response) => {
          const updatedShop = response.data.shop
          const updatedServiceIds = new Set(connectedServiceIds)

          selectedServicesToConnect.forEach((serviceId) => updatedServiceIds.add(serviceId))
          selectedServicesToDisconnect.forEach((serviceId) => updatedServiceIds.delete(serviceId))

          const availableServices = new Map(
            [...(currentShop.barber_shop_service ?? []), ...(data?.data.services ?? [])].map(
              (service) => [service.id, service],
            ),
          )
          const fallbackServices = [...updatedServiceIds]
            .map((serviceId) => availableServices.get(serviceId))
            .filter((service): service is IServicesProvidedDtoOut => service !== undefined)

          setCurrentShop({
            ...updatedShop,
            barber_shop_service: Array.isArray(updatedShop.barber_shop_service)
              ? updatedShop.barber_shop_service
              : fallbackServices,
          })
          await queryClient.invalidateQueries({ queryKey: ['get-all-services'] })
          setSelectedServicesToConnect([])
          setSelectedServicesToDisconnect([])
          addToast('Les services du salon ont été mis à jour.', 'success')
        },
        onError: (error) => {
          console.error('[ProfileEdit] Services update failed:', error)
          addToast('Erreur lors de la mise à jour des services.', 'error')
        },
      },
    )
  }

  const renderServices = (services: IGroupedService[]): React.ReactNode =>
    services.map((service) => {
      const branch = getServiceBranch(service)
      const selectedCount = branch.filter(isServiceSelected).length
      const isChecked = selectedCount === branch.length
      const isPartiallySelected = selectedCount > 0 && !isChecked
      const isExpanded = expandedServices.has(service.id)

      return (
        <li key={service.id} className="border-b border-gray-100 last:border-0">
          <div className="flex items-start gap-2">
            <label
              htmlFor={`service-${service.id}`}
              className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 py-3"
            >
              <input
                id={`service-${service.id}`}
                type="checkbox"
                checked={isChecked}
                ref={(input) => {
                  if (input) input.indeterminate = isPartiallySelected
                }}
                disabled={!currentShop?.id || isManagingServices}
                onChange={(event) => handleServiceSelection(service, event.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-amber-600 disabled:cursor-not-allowed"
              />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <span className="text-sm font-semibold text-gray-900">{service.label}</span>
                  <span
                    className={`text-xs font-medium ${isChecked ? 'text-emerald-700' : isPartiallySelected ? 'text-amber-700' : 'text-gray-500'}`}
                  >
                    {isChecked
                      ? 'Connecté'
                      : isPartiallySelected
                        ? 'Partiellement connecté'
                        : 'Non connecté'}
                  </span>
                </span>
                {service.description && (
                  <span className="mt-1 block text-xs leading-5 text-gray-500">
                    {service.description}
                  </span>
                )}
                {(service.price !== undefined || service.durationMin !== undefined) && (
                  <span className="mt-1 block text-xs text-gray-500">
                    {service.price !== undefined && `${service.price} €`}
                    {service.price !== undefined && service.durationMin !== undefined && ' · '}
                    {service.durationMin !== undefined && `${service.durationMin} min`}
                  </span>
                )}
              </span>
            </label>
            {service.children.length > 0 && (
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={`service-children-${service.id}`}
                aria-label={`${isExpanded ? 'Masquer' : 'Afficher'} les services enfants de ${service.label}`}
                onClick={() => toggleServiceExpansion(service.id)}
                className="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-lg font-medium text-gray-600 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-600"
              >
                {isExpanded ? '−' : '+'}
              </button>
            )}
          </div>
          {service.children.length > 0 && (
            <ul
              id={`service-children-${service.id}`}
              hidden={!isExpanded}
              className="ml-4 border-l border-gray-200 pl-3 sm:ml-7 sm:pl-4"
            >
              {renderServices(service.children)}
            </ul>
          )}
        </li>
      )
    })

  return (
    <form onSubmit={handleManageServices}>
      <fieldset className="border border-gray-200 rounded-xl p-4">
        <legend className="text-xs uppercase tracking-wider text-amber-700 font-semibold px-2">
          💈 Services proposés
        </legend>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-gray-600">
            Choisissez les services disponibles dans votre salon.
          </p>
          <span className="text-xs text-gray-500">
            {countServices(listServices)} service{countServices(listServices) > 1 ? 's' : ''}
          </span>
        </div>

        {!currentShop?.id && (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Aucun salon n’est sélectionné.
          </p>
        )}
        {isLoading && <p className="mt-4 text-sm text-gray-500">Chargement des services…</p>}
        {isError && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            Impossible de charger les services. Réessayez plus tard.
          </p>
        )}
        {!isLoading && !isError && listServices.length === 0 && (
          <p className="mt-4 text-sm text-gray-500">Aucun service disponible.</p>
        )}
        {!isLoading && !isError && listServices.length > 0 && (
          <ul className="mt-3 divide-y divide-gray-100">{renderServices(listServices)}</ul>
        )}
      </fieldset>

      <button
        type="submit"
        disabled={!currentShop?.id || !hasChanges || isManagingServices}
        className="mt-3 w-full py-2.5 rounded-lg bg-amber-600 text-white font-sans text-sm font-semibold hover:bg-amber-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isManagingServices ? 'Enregistrement…' : '💾   Enregistrer les services'}
      </button>
    </form>
  )
}
