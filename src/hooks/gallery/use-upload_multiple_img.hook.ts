import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

import { GalleryService } from '../../services'
import type { IGalleryDtoOut } from '../../dto'

export const useUploadMultipleImgHook = () => {
  return useMutation<AxiosResponse<{ images: IGalleryDtoOut[] }>, Error, FormData>({
    mutationKey: ['upload-multiple-images'],
    mutationFn: (body: FormData) => {
      return GalleryService.create_gallery_multiple_img(body)
    },
    retry: 0,
  })
}
