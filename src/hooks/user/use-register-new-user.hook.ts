import { useMutation } from "@tanstack/react-query"
import type { INewUserDtoIn, IUserDtoOut } from "../../dto"
import { AuthService } from "../../services"
import type { AxiosResponse } from "axios"

export const useRegisterNewUserHook = () => {
    return useMutation<AxiosResponse<{ user: IUserDtoOut }>, Error, INewUserDtoIn>({
        mutationKey: ['register-new-user'],
        mutationFn: (body: INewUserDtoIn) => {
            return AuthService.register_new_user(body)
        },
        retry: 0
    })
}