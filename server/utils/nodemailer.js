const nodemailer = require('nodemailer')

const config = {
  host: 'smtp.qq.com',
  port: 465,
  auth: {
    user: '814930498@qq.com',
    pass: '****************'
  }
}

const transporter = nodemailer.createTransport(config)

async function sendMail (mail) {
  const res = await transporter.sendMail(mail)
  return res
}

function generateCode () {
  let Code = ''
  for (let i = 0; i < 6; i++) {
    Code += Math.floor(Math.random() * 10)
  }
  return Code
}

function CreateMail (To, Code) {
  return {
    from: '<814930498@qq.com>',
    subject: '验证码',
    to: To,
    text: Code
  }
}

module.exports = {
  sendMail,
  CreateMail,
  generateCode
}
