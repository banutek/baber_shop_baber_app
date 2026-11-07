import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import type { IGalleryDtoOut } from '../../dto'
import { GalleryService } from '../../services'

export const useUpdateGalleryHook = () => {
  return useMutation<
    AxiosResponse<{ image: IGalleryDtoOut }>,
    Error,
    { galleryId: string; datas: FormData }
  >({
    mutationKey: ['update-gallery'],
    mutationFn: ({ galleryId, datas }) => {
      return GalleryService.update_gallery(galleryId, datas)
    },
    retry: 0,
  })
}
