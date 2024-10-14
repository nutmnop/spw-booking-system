import cuid from 'cuid'

import Restaurant from '../../../src/entity/restaurant'
import PlatformError from '../../../src/entity/platformError'

class MockRestaurant extends Restaurant {
  constructor() {
    super()
  }
}

describe('Restaurant', () => {

  describe('getInstance', () => {
    it('should return new uninitialize restaurant instance', () => {
      const restaurant = Restaurant.getInstance()

      expect(restaurant).toBeInstanceOf(Restaurant)
    })
  })

  describe('initialize', () => {

    beforeEach(() => {
      Restaurant['instance'] = new MockRestaurant()
    })

    it('should initialize with number of table for the first time', () => {
      const tableNumbers = 5
      const restaurant = Restaurant.getInstance()
      restaurant.initialize(tableNumbers)

      expect(restaurant).toBeInstanceOf(Restaurant)
      expect(restaurant.getInitializeStatus()).toBeTruthy()
      expect(restaurant.getTotalTable()).toEqual(tableNumbers)
    })

    it('should return platform error if initialize multiple time', () => {
      const tableNumbers = 5
      const restaurant = Restaurant.getInstance()
      restaurant.initialize(tableNumbers)

      try {
        const secondTableNumbers = 4
        restaurant.initialize(secondTableNumbers)
      } catch (error) {
        expect(error).toBeInstanceOf(PlatformError)
        expect((error as PlatformError).status).toEqual(400)
        expect((error as PlatformError).message)
          .toEqual('Unable to initialize your restaurants. It has been initiated.')
      }

      expect(restaurant).toBeInstanceOf(Restaurant)
      expect(restaurant.getInitializeStatus()).toBeTruthy()
      expect(restaurant.getTotalTable()).toEqual(tableNumbers)
    })
  })

  describe('getInitializeStatus', () => {

    beforeEach(() => {
      Restaurant['instance'] = new MockRestaurant()
    })

    it('should return false when restaurant instance not initialized', () => {
      const restaurant = Restaurant.getInstance()

      expect(restaurant).toBeInstanceOf(Restaurant)
      expect(restaurant.getInitializeStatus()).toBeFalsy()
    })

    it('should return true when restaurant instance initialized', () => {
      const tableNumbers = 5
      const restaurant = Restaurant.getInstance()
      restaurant.initialize(tableNumbers)

      expect(restaurant).toBeInstanceOf(Restaurant)
      expect(restaurant.getInitializeStatus()).toBeTruthy()
    })
  })

  describe('getTotalTable', () => {

    beforeEach(() => {
      Restaurant['instance'] = new MockRestaurant()
    })

    it('should return number of table correctly', () => {
      const tableNumbers = 5
      const restaurant = Restaurant.getInstance()
      restaurant.initialize(tableNumbers)

      expect(restaurant).toBeInstanceOf(Restaurant)
      expect(restaurant.getInitializeStatus()).toBeTruthy()
      expect(restaurant.getTotalTable()).toEqual(tableNumbers)
    })
  })

  describe('reserve', () => {
    let restaurant: Restaurant
    const tableNumbers = 5
    const tableSeat = 4

    beforeEach(() => {
      Restaurant['instance'] = new MockRestaurant()
      restaurant = Restaurant.getInstance()
      restaurant.initialize(tableNumbers)
    })

    it('should success and return booking detail if request seat equal to max available seat', () => {
      const requestSeat = tableNumbers * tableSeat
      const { id, remainingTable, reservedTable } = restaurant.reserve(requestSeat)

      expect(cuid.isCuid(id)).toBeTruthy()
      expect(remainingTable).toEqual(0)
      expect(reservedTable).toEqual(tableNumbers)
    })

    it(`should success and return booking detail
        if request seat equal to partial available seat and divisible by table seat`, () => {
      const requestSeat = (tableNumbers - 1) * tableSeat
      const { id, remainingTable, reservedTable } = restaurant.reserve(requestSeat)

      expect(cuid.isCuid(id)).toBeTruthy()
      expect(remainingTable).toEqual(1)
      expect(reservedTable).toEqual(tableNumbers - 1)
    })

    it(`should success and return booking detail
        if request seat equal to partial available seat and indivisible by table seat`, () => {
      const requestSeat = ((tableNumbers - 2) * tableSeat) + 1
      const { id, remainingTable, reservedTable } = restaurant.reserve(requestSeat)

      expect(cuid.isCuid(id)).toBeTruthy()
      expect(remainingTable).toEqual(1)
      expect(reservedTable).toEqual(tableNumbers - 1)
    })

    it('should unsuccess and return platform error if request seat exceed maximum available seat', () => {
      const requestSeat = (tableNumbers * tableSeat) + 1
      try {
        restaurant.reserve(requestSeat)
      } catch (error) {
        expect(error).toBeInstanceOf(PlatformError)
        expect((error as PlatformError).status).toEqual(400)
        expect((error as PlatformError).message)
          .toEqual('Unable to book the table. The restaurant does not have enough seat for this booking.')
      }
    })

    it('should unsuccess and return platform error if table is full of reserve', () => {
      const requestSeat = 20
      try {
        restaurant.reserve(requestSeat)
        restaurant.reserve(1)
      } catch (error) {
        expect(error).toBeInstanceOf(PlatformError)
        expect((error as PlatformError).status).toEqual(400)
        expect((error as PlatformError).message)
          .toEqual('Unable to book the table. The restaurant is full of booking.')
      }
    })
  })

  describe('getBookingById', () => {
    let restaurant: Restaurant
    const tableNumbers = 5
    const tableSeat = 4

    beforeAll(() => {
      Restaurant['instance'] = new MockRestaurant()
      restaurant = Restaurant.getInstance()
      restaurant.initialize(tableNumbers)
    })

    it('should return booking detail by booking id', () => {
      const requestSeat = tableSeat
      const reservedDetail = restaurant.reserve(requestSeat)
      const bookingDetail = restaurant.getBookingById(reservedDetail.id)

      expect(bookingDetail.id).toEqual(reservedDetail.id)
      expect(bookingDetail.reservedSeat).toEqual(requestSeat)
      expect(bookingDetail.reservedTable).toEqual(reservedDetail.reservedTable)
    })

    it('should return platform error if booking id is not found', () => {
      try {
        restaurant.getBookingById('mock-false-id')
      } catch (error) {
        expect(error).toBeInstanceOf(PlatformError)
        expect((error as PlatformError).status).toEqual(404)
        expect((error as PlatformError).message)
          .toEqual('Unable to find your booking. Your booking ID is not found.')
      }
    })
  })

  describe('getAllBookings', () => {
    let restaurant: Restaurant
    const tableNumbers = 5
    const tableSeat = 4

    beforeAll(() => {
      Restaurant['instance'] = new MockRestaurant()
      restaurant = Restaurant.getInstance()
      restaurant.initialize(tableNumbers)
    })

    it('should return empty object if there is no booking', () => {
      const bookingList = restaurant.getAllBookings()

      expect(bookingList).toEqual({})
    })

    it('should return 2 booking object if there are two request of reserve', () => {
      restaurant.reserve(tableSeat)
      restaurant.reserve(tableSeat)
      const bookingList = restaurant.getAllBookings()
      const keyList = Object.keys(bookingList)

      expect(keyList.length).toEqual(2)
      expect(keyList[0]).not.toEqual(keyList[1])
    })
  })

  describe('cancel', () => {
    let restaurant: Restaurant
    const tableNumbers = 5
    const tableSeat = 4

    beforeAll(() => {
      Restaurant['instance'] = new MockRestaurant()
      restaurant = Restaurant.getInstance()
      restaurant.initialize(tableNumbers)
    })

    it('should free 1 table when request to cancel one booking of one table by its id', () => {
      const requestSeat = tableSeat
      const reservedDetail = restaurant.reserve(requestSeat)
      const cancelDetail = restaurant.cancel(reservedDetail.id)

      expect(cancelDetail.freedTable).toEqual(1)
      expect(cancelDetail.remainingTable).toEqual(tableNumbers)
    })

    it('should free 2 table when request to cancel one booking of two table by its id', () => {
      const requestSeat = tableSeat * 2
      const reservedDetail = restaurant.reserve(requestSeat)
      const cancelDetail = restaurant.cancel(reservedDetail.id)

      expect(cancelDetail.freedTable).toEqual(2)
      expect(cancelDetail.remainingTable).toEqual(tableNumbers)
    })

    it('should return platform error if booking id is not found', () => {
      try {
        restaurant.cancel('mock-false-id')
      } catch (error) {
        expect(error).toBeInstanceOf(PlatformError)
        expect((error as PlatformError).status).toEqual(404)
        expect((error as PlatformError).message)
          .toEqual('Unable to cancel your booking. Your booking ID is not found.')
      }
    })
  })
})