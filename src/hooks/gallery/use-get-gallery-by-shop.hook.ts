import { useQuery } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import type { IGalleryDtoOut } from '../../dto'
import { GalleryService } from '../../services'

export const useGetGalleryByShopHook = (shopId: string) => {
  return useQuery<AxiosResponse<{ images: IGalleryDtoOut[] }>, Error>({
    queryKey: ['get-gallery-by-shop', shopId],
    queryFn: () => {
      return GalleryService.get_gallery_by_shop_id(shopId)
    },
    enabled: !!shopId,
    retry: 0,
  })
}
