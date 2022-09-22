async function getTilledForm(tilled, type) {
    const form = await tilled.form({
        payment_method_type: type,
    })
    console.log('You got tilled form')
    return form;
}

export default getTilledForm