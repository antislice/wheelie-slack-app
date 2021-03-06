'use strict'

const qs = require('querystring')
const bluebird = require('bluebird')
const parser = require('yargs')
  .usage('Usage: /<command> <args>')
  .commandDir('../commands')
  .strict()
  .help(false)

module.exports = path => server => server.post(path, command)

function command (req, res, next) {
  const params = qs.parse(req.body)
  // console.log( 'user', params.user_name, `(team: ${params.team_id})`, 'invoked command: ', params.command, params.text)
  if (params.token !== process.env.VERIFICATION_TOKEN) {
    console.log('bad verification token: ', params.token, process.env.VERIFICATION_TOKEN)
    res.send(401, {error: 'invalid verification token'})
    return next()
  }
  const ctx = Object.assign({
    _send: (code, data) => res.send(code, data) && next(),
    respond: respond
  }, params)

  const cmd = params.command === '/help?'
  ? '--help'
  : params.command.substr(1) + ' ' + params.text
  parser.parse(cmd, ctx, (err, argv, output) => {
    if (err) {
      console.error('Unexpected handler error: ', err)
      res.send(err.code || 500, {error: err.message})
      next()
    } else if (output) {
      res.send(200, { text: output })
      next()
    }
  })
}

function respond (response, opts) {
  opts = opts || {}
  bluebird.resolve(response).then(resp => {
    this._send(opts.code || 200, resp)
  }, err => {
    console.error('Unexpected handler error: ', err)
    this._send(err.code || 500, {error: err.message})
  })
}
