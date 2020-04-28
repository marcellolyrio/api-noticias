'use strict'

const Message = use('App/Models/Message')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with messages
 */
class MessageController {
  /**
   * Show a list of all messages.
   * GET messages
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const messages = await Message.query().with('user').fetch();


    return messages
  }

  /**
   * Create/save a new message.
   * POST messages
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({auth, request}) {
    const data = request.only([
      'title',
      'message'      
    ])
  
    const message = await Message.create({ ...data, user_id: auth.user.id })
  
    return message
  }

  /**
   * Display a single message.
   * GET messages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const message = await Message.findOrFail(params.id)

    return message
  }

  /**
   * Update message details.
   * PUT or PATCH messages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const message = await Message.findOrFail(params.id)

    const data = request.only([
      'title',
      'message'
    ])

    message.merge(data)

    await message.save()

    return message
  }

  /**
   * Delete a message with id.
   * DELETE messages/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ auth, params, response }) {
   
    const message = await Message.findOrFail(params.id)

    if (message.user_id !== auth.user.id) {
      return response.status(401).send({ error: 'Not authorized' })
    }else{
      await message.delete()
      return response.status(200).send({ success: 'Excluido com sucesso' })
    }

   
  }
}

module.exports = MessageController
