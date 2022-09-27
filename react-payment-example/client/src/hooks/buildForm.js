import getTilledForm from './getTilledForm'
import injectFields from './injectFields'

async function buildForm(paymentTypeObj) {
  paymentTypeObj.form = await getTilledForm(paymentTypeObj.tilled, paymentTypeObj.type)
  injectFields(paymentTypeObj.fields, paymentTypeObj.form)

  // Build the form
  paymentTypeObj.form.build()
}

  export default buildForm