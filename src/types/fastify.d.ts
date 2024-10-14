import 'fastify'
import { Restaurant } from '../entity/restaurant'

declare module 'fastify' {
  interface FastifyInstance {
    restaurantService: Restaurant
  }
}
