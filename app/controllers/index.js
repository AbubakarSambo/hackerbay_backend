const jwt = require('jsonwebtoken')
const request = require('request')
const sharp = require('sharp')
const validator = require('validator')
const { applyPatch, validate } = require('fast-json-patch')
const config = require('../../config/config.js')

exports.login = (req, res) => {
  const { password, username } = req.body
  if (username && password) {
    const token = jwt.sign({ id: username }, config.secretKey, { expiresIn: 86400 })
    return res.status(200).send({ token })
  } else {
    return res.status(400).send({ error: 'Required fields missing' })
  }
}
exports.patch = (req, res) => {
  const { json, patchObj } = req.body
  if (json && patchObj) {
    const validPatch = validate(patchObj)
    if (!validPatch) {
      const patched = applyPatch(json, patchObj).newDocument
      return res.status(200).send({ patched })
    } else {
      return res.status(400).send({ error: 'Invalid patch' })
    }
  } else {
    return res.status(400).send({ error: 'Required fields missing' })
  }
}

exports.resize = (req, res) => {
  const { url } = req.body
  if (!url) return res.status(400).send({ error: 'url is missing' })

  if (validator.isURL(url)) {
    const resizer = sharp().resize(50, 50).toBuffer((err, data) => {
      if (err) return res.status(400).send({ error: 'Sure thats an image?' })
      return res.status(200).send(data.toString('base64'))
    })

    request(url).on('error', () => {
      return res.status(500).send({ error: 'Could not resize that' })
    }).pipe(resizer)
  } else {
    return res.status(400).send({ error: 'invalid url' })
  }
}
