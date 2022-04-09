require('dotenv').config();

const express = require('express')
const port = 3000 || process.env.PORT;

const email = require('./src/email')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.get('/', (req,res)=>{
  res.json({message:'Success'})
})

//http://localhost:3000/
app.listen(port, ()=>{
  console.log(`Accede al sitio web dando clic aquí: http://localhost:${port}`)
})

app.post('/api/email/confirmacion', async(req,res,next)=>{
  try{
    res.json(await email.sendOrder(req.body))
  }catch(err){
      next(err)
  }
})

app.use((err, req, res, next)=>{
  const statusCode = err.statusCode || 500
  console.error(err.message, err.stack)
  res.status(statusCode).json({'message': error.message})
  return
})

function getMessage(){
  const body = 'Mensaje enviado'
  return{
    from: 'mariaj.jaramilloa@autonoma.edu.co',
    to: 'mariaj.jaramilloa@autonoma.edu.co',
    subject: 'Prueba sendgrid V2',
    text: body,
    html:`<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>

    </head>
    <body>
      <div class="container section">
        <label><strong>Producto</strong></label>
        <img src = "https://concepto.de/wp-content/uploads/2019/11/producto-packaging-e1572738514178.jpg" alt="" width="400px">

      </div>
    </body>
    </html>`
  }
}

async function sendEmail(){
  try{
    await sgMail.send(getMessage())
    console.log('El correo ha sido enviado')
  }catch(err){
    console.error('No se pudo enviar el mensaje')
    console.error(err)
    if(err.response) console.error(err.response.body)
  }
}

(async()=>{
  console.log('Enviando correo electronico')
  await sendEmail()
})

const client = require('twilio')(accountSID, authToken)
//Enviar mensaje a whatsapp
client.messages
  .create({
  body: 'Bienvenido a la semana IV del ciclo final de Ingenieria de sistema',
  from: 'whatsapp:+14155238886',
  to: 'whatsapp:+573007190637'
}).then(message => console.log(`Mensaje enviado ${message.sid}`))


client.messages
  .create({
     body: 'Prueba de twilio. ',
     from: '+13093154903',
     to: '+573007190637'
   })
  .then(message => console.log(message.sid));
