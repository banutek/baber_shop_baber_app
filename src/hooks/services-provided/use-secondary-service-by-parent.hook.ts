import { useQuery } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

import type { IServicesProvidedDtoOut } from '../../dto'
import { ServicesProvidedService } from '../../services'

export const useGetSecondaryServiceByParent = (parentId: string) => {
  return useQuery<AxiosResponse<{ services: IServicesProvidedDtoOut }>, Error>({
    queryKey: ['get-secondary-services-by-parent', parentId],
    queryFn: async () => {
      const response = await ServicesProvidedService.get_secondary_services_by_parent(parentId)
      console.log({ response })
      return response
    },
    retry: 1,
    enabled: !!parentId,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
}
