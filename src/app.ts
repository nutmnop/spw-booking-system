import fastify from 'fastify'
import dotenv from 'dotenv'
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts'
import configurationRouter from './router/v1/configuration'
import bookingRouter from './router/v1/booking'
import restaurantPlugin from './plugin/restaurantService'

dotenv.config()

// let restaurant: Restaurant
const app = fastify({ logger: true })
  .withTypeProvider<JsonSchemaToTsProvider>()
  .register(restaurantPlugin)
  .register(configurationRouter, { prefix: '/api/v1/config' })
  .register(bookingRouter, { prefix: 'api/v1/booking'})

app.get('/health', async (request, reply) => {
  return { msg: 'healthy' }
})
// app.post<{
//   Body: {
//     tableNumbers: number
//   }
// }>('/api/v1/init', {
//   schema: {
//     body: {
//       type: 'object',
//       required: ['tableNumbers'],
//       properties: {
//         tableNumbers: { type: 'integer', minimum: 1 },
//       }
//     }
//   }
// }, async (request, reply) => {
//   // if (!restaurant) {
//   //   restaurant = new Restaurant(request.body.tableNumbers)
//   //   reply.send({ msg: `Your restaurant has all set with ${restaurant.getTotalTable()} table(s).`})
//   // }
//   app.restaurantService.initialize(request.body.tableNumbers)
//   reply
//     .code(400)
//     .send({ msg: 'You had already initiate your restaurant.'})
// })
// app.post<{
//   Body: {
//     seat: number
//   }
// }>('/api/v1/reserve', {
//   schema: {
//     body: {
//       type: 'object',
//       required: ['seat'],
//       properties: {
//         seat: { type: 'integer', minimum: 1 },
//       }
//     }
//   }
// }, async (request, reply) => {
//   if (!restaurant) {
//     reply
//     .code(400)
//     .send({ msg: 'Please initiate you restaurant first.' })
//   }
//   try {
//     const bookingDetail = restaurant.reserve(request.body.seat)
//     reply.send(bookingDetail)
//   } catch (err) {
//     const error: Error = err as Error
//     reply
//       .code(400)
//       .send({ msg: error.message })
//   }
// })
// app.post<{
//   Body: {
//     id: string
//   }
// }>('/api/v1/cancel', {
//   schema: {
//     body: {
//       type: 'object',
//       required: ['id'],
//       properties: {
//         id: { type: 'string' },
//       }
//     }
//   }
// }, async (request, reply) => {
//   if (!restaurant) {
//     reply
//     .code(400)
//     .send({ msg: 'Please initiate you restaurant first.' })
//   }
//   try {
//     const deletedDetail = restaurant.cancel(request.body.id)
//     reply.send(deletedDetail)
//   } catch (err) {
//     const error: Error = err as Error
//     reply
//       .code(400)
//       .send({ msg: error.message })
//   }
// })
// app.get('/api/v1/bookings', async (request, reply) => {
//   if (!restaurant) {
//     reply
//     .code(400)
//     .send({ msg: 'Please initiate you restaurant first.' })
//   }
//   try {
//     const bookings = restaurant.getAllBookings()
//     reply.send(bookings)
//   } catch (err) {
//     const error: Error = err as Error
//     reply
//       .code(400)
//       .send({ msg: error.message })
//   }
// })

const start = async () => {
  try {
    const port = process.env.PORT || 3000
    await app.listen({ port: Number(port) })
    console.log('Server running at http://localhost:' + port)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
