import fastify from 'fastify'
import dotenv from 'dotenv'
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts'
import configurationRouter from './router/v1/configuration'
import bookingRouter from './router/v1/booking'
import restaurantPlugin from './plugin/restaurantService'

dotenv.config()

const app = fastify({ logger: true })
  .withTypeProvider<JsonSchemaToTsProvider>()
  .register(restaurantPlugin)
  .register(configurationRouter, { prefix: '/api/v1/config' })
  .register(bookingRouter, { prefix: 'api/v1/booking'})

app.get('/health', async (request, reply) => {
  return { msg: 'healthy' }
})

const start = async () => {
  try {
    const port = process.env.PORT || 3000
    await app.listen({ port: Number(port), host: '0.0.0.0' })
    console.log('Server running at http://localhost:' + port)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()

export default app
