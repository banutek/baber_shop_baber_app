import { useQuery } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import type { IGalleryDtoOut } from '../../dto'
import { GalleryService } from '../../services'

export const useGetGalleryByServiceHook = (serviceId: string) => {
  return useQuery<AxiosResponse<{ images: IGalleryDtoOut[] }>, Error>({
    queryKey: ['get-gallery-by-service', serviceId],
    queryFn: () => {
      return GalleryService.get_gallery_by_service_id(serviceId)
    },
    enabled: !!serviceId,
    retry: 0,
  })
}
