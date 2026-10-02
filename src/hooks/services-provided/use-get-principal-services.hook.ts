import { useQuery } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

import type { IServicesProvidedDtoOut } from '../../dto'
import { ServicesProvidedService } from '../../services'

export const useGetPrincipalServicesHook = () => {
  return useQuery<AxiosResponse<{ services: IServicesProvidedDtoOut }>, Error>({
    queryKey: ['get-all-principal-services'],
    queryFn: () => {
      return ServicesProvidedService.get_all_principal_services()
    },
    retry: 0,
  })
}
