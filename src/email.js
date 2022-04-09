const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function sendEmailConfirmationHTML(customerName, orderNro){
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

</head>
<body>
  <div class="container section">
    <label>Productos</label>
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6Zbe-hcHSIYt8hp96snQYmonc0xngp5aIKg&usqp=CAU">
    <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/huda-beauty-nude-eyeshadow-1544525969.jpg?crop=680,854,offset-x50,offset-y0,safe&width=480&auto=webp&optimize=medium&io=1">
  </div>
</body>
</html>`
}

function getMessage(emailParams){
  return{
    from:'mariaj.jaramilloa@autonoma.edu.co',
    to:'mariaj.jaramilloa@autonoma.edu.co',
    subject:'Confirmación orden de compra black Friday',
    text:`Hola ${emailParams.customerName}, te enviamos las imagenes de los productos comprados y la
    factura con número ${emailParams.orderNro}. Gracias por su compra`,
    html:sendEmailConfirmationHTML(emailParams.customerName, emailParams.orderNro)
  }
}

async function sendOrder(emailParams){
  try{
    await sgMail.send(getMessage(emailParams))
    return {message: 'Confirmación de compra enviada'}
  }catch(err){
    const message ='No se pudo enviar la orden de compra. Valide los errores'
    console.error(message)
    console.error(err)
    if(err.response) console.error(err.response.body)
    return {message}
  }
}

module.exports={ sendOrder }