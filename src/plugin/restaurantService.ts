import fp from 'fastify-plugin'
import Restaurant from '../entity/restaurant'
import { FastifyInstance } from 'fastify'

async function restaurantPlugin(app: FastifyInstance) {
  const restaurantService = Restaurant.getInstance()
  app.decorate('restaurantService', restaurantService)
}

export default fp(restaurantPlugin)
