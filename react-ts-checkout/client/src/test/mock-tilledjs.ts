export class Tilled {
    constructor(public_key: string, account_id: string, options: {
        sandbox: boolean
    }) {
        this.public_key = public_key;
        this.account_id = account_id;
        this.options = options;
    }

    public_key: string;
    account_id: string;
    options: { sandbox: boolean };

    form(options: { payment_method_type: string }) {
        return new Promise((resolve, reject) => {
            resolve(new Form(options));
        });
    }



}

class Form {
    constructor(options: { payment_method_type: string }) {
        this.options = options;
    }

    options: { payment_method_type: string };

    createField(formFieldType: FormFieldType, options?: { selector: string | Element }) {
        return new Field(formFieldType, options);
    }
    teardown() {
        return true;
    }
}

enum FormFieldType {
    cardNumber = 'cardNumber',
    cardExpiry = 'cardExpiry',
    cardCvv = 'cardCvv',
    bankRoutingNumber = 'bankRoutingNumber',
    bankAccountNumber = 'bankAccountNumber'
}