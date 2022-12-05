import getTilledForm from './getTilledForm'
import injectFields from './injectFields'
import updateCardBrand from './updateCardBrand'

async function buildForm(paymentTypeObj) {
  paymentTypeObj.form = await getTilledForm(paymentTypeObj.tilled, paymentTypeObj.type)
  injectFields(paymentTypeObj.fields, paymentTypeObj.form)

  // update card brand
  if (paymentTypeObj.type === 'card') updateCardBrand(paymentTypeObj.form.fields.cardNumber)

  // Build the form
  paymentTypeObj.form.build()
}

  export default buildForm