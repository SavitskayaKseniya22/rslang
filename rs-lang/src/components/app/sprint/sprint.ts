import ApiService from '../api-service/api-service'

export class Sprint {
  service: ApiService
  lvl: number

  constructor(lvl: number, service: ApiService) {
    this.lvl = lvl
    this.service = service
  }
}
