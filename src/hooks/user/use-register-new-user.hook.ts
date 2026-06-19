import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

import type { INewUserDtoIn, IUserDtoOut } from '../../dto'
import { AuthService } from '../../services'

export const useRegisterNewUserHook = () => {
  return useMutation<AxiosResponse<{ user: IUserDtoOut }>, Error, INewUserDtoIn>({
    mutationKey: ['register-new-user'],
    mutationFn: (body: INewUserDtoIn) => {
      return AuthService.register_new_user(body)
    },
    retry: 0,
  })
}
