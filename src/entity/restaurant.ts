import cuid from 'cuid'
import PlatformError from './platformError'

type bookingDetail = {
  id: string
  reservedSeat: number
  reservedTable: number
  cratedAt: Date
}

export default class Restaurant {
  private static instance: Restaurant
  private readonly _tableSeat = 4

  private totalTable: number
  private transaction: { [id: string]: bookingDetail }
  private remainingTable: number
  private isInitialize: boolean

  public static getInstance(): Restaurant {
    if (!Restaurant.instance) {
      this.instance = new Restaurant()
    }
    return this.instance
  }

  protected constructor() {
    this.totalTable = 0
    this.transaction = {}
    this.remainingTable = 0
    this.isInitialize = false
  }

  public initialize(tableNumbers: number): void {
    if (!this.isInitialize) {
      this.totalTable = tableNumbers
      this.remainingTable = this.totalTable
      this.isInitialize = true
    } else {
      throw new PlatformError(400, 'Unable to initialize your restaurants. It has been initiated.')
    }
  }

  public getInitializeStatus(): boolean {
    return this.isInitialize
  }

  public getTotalTable(): number {
    return this.totalTable
  }

  public getBookingById(id: string) {
    if (!this.transaction[id]) {
      throw new PlatformError(404, 'Unable to find your booking. Your booking ID is not found.')
    }

    return this.transaction[id]
  }

  public getAllBookings(): { [id: string]: bookingDetail } {
    return this.transaction
  }

  public reserve(seat: number): { id: string; reservedTable: number; remainingTable: number } {
    const expectTables = Math.ceil(seat / this._tableSeat)

    if (this.remainingTable === 0) {
      throw new PlatformError(400, 'Unable to book the table. The restaurant is full of booking.')
    }

    if (expectTables > this.remainingTable) {
      throw new PlatformError(
        400,
        'Unable to book the table. The restaurant does not have enough seat for this booking.'
      )
    }

    const booking: bookingDetail = {
      id: cuid(),
      reservedSeat: seat,
      reservedTable: expectTables,
      cratedAt: new Date(),
    }

    this.remainingTable = this.remainingTable - expectTables
    this.transaction[booking.id] = booking

    return {
      id: booking.id,
      reservedTable: booking.reservedTable,
      remainingTable: this.remainingTable,
    }
  }

  public cancel(id: string): { freedTable: number; remainingTable: number } {
    if (!this.transaction[id]) {
      throw new PlatformError(404, 'Unable to cancel your booking. Your booking ID is not found.')
    }
    const { [id]: removedTable, ...newObject } = this.transaction
    this.transaction = newObject
    this.remainingTable = this.remainingTable + removedTable.reservedTable
    return {
      freedTable: removedTable.reservedTable,
      remainingTable: this.remainingTable,
    }
  }
}
