import fp from 'fastify-plugin'
import { Restaurant } from '../entity/restaurant'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

async function restaurantPlugin(app: FastifyInstance, _opts: FastifyPluginOptions) {
  const restaurantService = Restaurant.getInstance()
  app.decorate('restaurantService', restaurantService)
}

export default fp(restaurantPlugin)
