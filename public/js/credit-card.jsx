class CreditCart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonDisabled: false,
            success: false,
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            errors: {}
        };

    }

    //Check if card is American Express
    isAmericanCard = () => {
        if (/^(34|37)/.test(this.state.cardNumber)) {
            this.setState({'placeholderCvv': '****'});
            return true;
        }
        this.setState({'placeholderCvv': '***'});
        return false;
    }

    modifyCardNumber(value) {
        value = value.replace(/\D/g, '');
        if (value.length > 19) {
            value = value.slice(0, 19);
        }
        return value;
    }

    modifyCvv(value) {
        value = value.replace(/\D/g, '');
        let isAmerican = this.isAmericanCard();
        if (isAmerican && value.length > 4) {
            value = value.slice(0, 4);
        } else if (!isAmerican && value.length > 3) {
            value = value.slice(0, 3);
        }
        return value;
    }

    modifyExpiryDate(value) {
        value = value.replace(/\D/g, '');
        if (value.length === 1 && value > 1) {
            value = '0' + value + '/';
        } else if (value.length === 2 && value > 12) {
            value = '01/';
        } else if (value.length === 2 && value <= 12) {
            value = value + '/';
        } else if (value.length > 2) {
            //Current date
            let date = new Date();

            //Split max 4 digits
            let split = value.split('', 4);

            //Set format date to MM/YY
            value = split[0] + split[1] + '/' + split[2] + (split[3] || '');

            if (
                //Check if date is not in future without month
                parseInt(split[2] + (split[3] || '')) < date.getFullYear() - 2000 ||

                //Check if date is not in future with year and month
                date.getFullYear() - 2000 - parseInt(split[2] + (split[3] || '')) === 0 &&
                parseInt(split[0] + split[1]) < date.getMonth() + 1
            ) {
                //Set format date to MM/Y
                value = split[0] + split[1] + '/' + split[2];
            }
        }
        return value;
    }


    handleChange = (event) => {
        const target = event.target;
        let value = target.value;
        const name = target.name;

        //delete errors if exist
        this.setState(state => {
            const {errors} = state;
            delete errors[name];
            return {
                errors
            };
        });

        if (name === 'cardNumber') {
            value = this.modifyCardNumber(value);
        } else if (name === 'expiryDate') {
            value = this.modifyExpiryDate(value);
        } else if (name === 'cvv') {
            value = this.modifyCvv(value);
        }

        //Change placeholder in cvv field
        this.isAmericanCard();

        this.setState({
            [name]: value
        });

    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.state.buttonDisabled = true;
        //delete errors if exist
        this.setState({errors: {}});

        fetch('/api', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.state)
        })
            .then(response => response.json())
            .then(data => {
                this.state.buttonDisabled = false;
                this.setState({
                    errors: data.errors,
                    success: data.success
                })
            });

    }

    render() {
        return (
            <form className="border p-4 rounded" style={{maxWidth: '600px'}} onSubmit={this.handleSubmit}>
                <div className="row">
                    <div className="col-12">
                        <label htmlFor="basic-url" className="form-label">Card number</label>
                        <input placeholder="**** **** **** ****" className={"form-control " + (this.state.errors.cardNumber ? "is-invalid" : '')} type="text" name="cardNumber" value={this.state.cardNumber} onChange={this.handleChange}/>
                        {this.state.errors.cardNumber &&
                            <div className="invalid-feedback">{this.state.errors.cardNumber}</div>}

                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-6">
                                <label htmlFor="basic-url" className="form-label">Expiry date</label>
                                <input placeholder="MM/YY" className={"form-control " + (this.state.errors.expiryDate ? "is-invalid" : '')} type="text" name="expiryDate" value={this.state.expiryDate} onChange={this.handleChange}/>
                                {this.state.errors.expiryDate &&
                                    <div className="invalid-feedback">{this.state.errors.expiryDate}</div>}
                            </div>
                            <div className="col-6">
                                <label htmlFor="basic-url" className="form-label">Security code</label>
                                <input placeholder={this.state.placeholderCvv || '***'} className={"form-control " + (this.state.errors.cvv ? "is-invalid" : '')} type="text" name="cvv" value={this.state.cvv} onChange={this.handleChange}/>
                                {this.state.errors.cvv &&
                                    <div className="invalid-feedback">{this.state.errors.cvv}</div>}
                            </div>
                        </div>
                    </div>

                </div>
                {!this.state.success &&
                    <div className="mt-4">
                        <button disabled={this.state.buttonDisabled} className="btn btn-primary" type="submit">
                            <span className="sr-only">
                                {this.state.buttonDisabled ? "Loading..." : "Pay"}
                            </span>
                        </button>
                    </div>
                }
                {this.state.success &&
                    <div className="mt-4">
                        <div className="alert alert-success" role="alert">
                            <strong>Success!</strong> Your payment was successful.
                        </div>
                    </div>
                }
            </form>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(<CreditCart/>);