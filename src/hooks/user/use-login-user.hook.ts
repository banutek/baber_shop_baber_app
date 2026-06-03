import { useMutation } from "@tanstack/react-query"
import type { ILoginUserDtoIn, ILoginUserResponse } from "../../dto"
import { AuthService } from "../../services"
import type { AxiosResponse } from "axios"



export const useLoginUserHook = () => {
    return useMutation<AxiosResponse<ILoginUserResponse>, Error, ILoginUserDtoIn>({
        mutationKey: ['login-user'],
        mutationFn: (body: ILoginUserDtoIn) => {
            return AuthService.login_user(body)
        },
        retry: 0
    })
}