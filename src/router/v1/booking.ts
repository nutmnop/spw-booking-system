import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import PlatformError from '../../entity/platformError'

async function bookingRouters(app: FastifyInstance, opts: FastifyPluginOptions) {
  app.addHook('preHandler', async (request, reply) => {
    if (!app.restaurantService.getInitializeStatus()) {
      reply.code(400).send({ msg: 'Please initiate you restaurant first.' })
    }
  })

  app.get('/', async (request, reply) => {
    try {
      const bookings = app.restaurantService.getAllBookings()
      reply.send(bookings)
    } catch (err) {
      if (err instanceof PlatformError) {
        reply.code(err.status).send({ msg: err.message })
      }
      throw err
    }
  })

  app.get<{
    Params: {
      id: string
    }
  }>(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const deletedDetail = app.restaurantService.cancel(request.params.id)
        reply.send(deletedDetail)
      } catch (err) {
        if (err instanceof PlatformError) {
          reply.code(err.status).send({ msg: err.message })
        }
        throw err
      }
    },
  )

  app.post<{
    Body: {
      seat: number
    }
  }>(
    '/reserve',
    {
      schema: {
        body: {
          type: 'object',
          required: ['seat'],
          properties: {
            seat: { type: 'integer', minimum: 1 },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const bookingDetail = app.restaurantService.reserve(request.body.seat)
        reply.send(bookingDetail)
      } catch (err) {
        if (err instanceof PlatformError) {
          reply.code(err.status).send({ msg: err.message })
        }
        throw err
      }
    },
  )

  app.delete<{
    Params: {
      id: string
    }
  }>(
    '/:id/cancel',
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const deletedDetail = app.restaurantService.cancel(request.params.id)
        reply.send(deletedDetail)
      } catch (err) {
        if (err instanceof PlatformError) {
          reply.code(err.status).send({ msg: err.message })
        }
        throw err
      }
    },
  )
}

export default bookingRouters
