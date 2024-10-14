import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { PlatformError } from '../../entity/platformError'

async function configurationRouters (app: FastifyInstance, opts: FastifyPluginOptions) {
  app.post<{
      Body: {
        tableNumbers: number
      }
    }>('/init', {
    schema: {
      body: {
        type: 'object',
        required: ['tableNumbers'],
        properties: {
          tableNumbers: { type: 'integer', minimum: 1 },
        }
      }
    }
  }, async (request, reply) => {
    try {
      app.restaurantService.initialize(request.body.tableNumbers)
      reply.send({ msg: `Your restaurant has all set with ${app.restaurantService.getTotalTable()} table(s).`})
    } catch (err) {
      if (err instanceof PlatformError) {
        reply
          .code(err.status)
          .send({ msg: err.message })
      }
      throw err
    }
  })
}

export default configurationRouters