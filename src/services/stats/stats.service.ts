import BaseMethods from '../BaseMethods'
import { statsUrls } from '../url'

export class StatsService {
  static get_daily_stats = (shopId: string) =>
    BaseMethods.getRequest(statsUrls.GET_DAILY_STATS(shopId), true)
}
