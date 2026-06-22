import { useQuery } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

import type { IDailyStatsDtoOut } from '../../dto'
import { StatsService } from '../../services'
import { useShopStore } from '../../stores'

export const useDailyStatsHook = () => {
  const { currentShop } = useShopStore()
  const shopId = currentShop?.id

  console.log({ shopId })

  return useQuery<AxiosResponse<IDailyStatsDtoOut>, Error>({
    queryKey: ['daily-stats', shopId],
    queryFn: () => {
      return StatsService.get_daily_stats(shopId as string)
    },
    retry: 1,
    enabled: !!shopId,
    refetchOnWindowFocus: true,
    refetchInterval: 60_000, // refresh every minute
  })
}
