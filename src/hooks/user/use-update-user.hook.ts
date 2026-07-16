import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

import type { IUpdateUserDtoIn, IUserDtoOut } from '../../dto'
import { AuthService } from '../../services'

export const useUpdateUserHook = () => {
  return useMutation<
    AxiosResponse<{ user: IUserDtoOut }>,
    Error,
    { userId: string; datas: IUpdateUserDtoIn }
  >({
    mutationKey: ['update-user'],
    mutationFn: ({ userId, datas }) => {
      return AuthService.update_user(userId, datas)
    },
    retry: 0,
  })
}
