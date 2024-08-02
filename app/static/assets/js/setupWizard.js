const { useState, useEffect } = React;
const { Modal, Button } = ReactBootstrap;

const BudgetPage = () => {
    const [budget, setBudget] = useState(null);
    const [showCreateButton, setShowCreateButton] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const { Modal, Button, Accordion } = ReactBootstrap;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [formData, setFormData] = useState({
        income: {
            primaryIncome: '',
            sideIncome: '',
            investmentIncome: '',
            rentalIncome: '',
            otherIncome: ''
        },
        housing: {
            housingType: '',
            housingCost: '',
            homeInsurance: '',
            utilities: {
                electricity: '',
                waterSewer: '',

                other: '',
            },
        },
        essentials: {
            cellPhone: '',
            internet: '',
            groceries: '',
            healthCare: '',
            healthInsurance: '',
            dentalInsurance: '',
            visionInsurance: '',
            lifeInsurance: ''
        },
        vehicles: [],


        accounts: {
            checking: [],
            savings: [],
            creditCards: [],
            loans: [],
            investmentAccounts: [],
        },

        subscriptionServices: []
    });

    const handleInputChange = (category, field, value) => {
        setFormData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    const handleNestedInputChange = (category, nestedCategory, field, value) => {
        setFormData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [nestedCategory]: {
                    ...prev[category][nestedCategory],
                    [field]: value
                }
            }
        }));
    };

    const handleArrayAdd = (category, subcategory, newItem) => {
        setFormData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [subcategory]: [...prev[category][subcategory], newItem]
            }
        }));
    };

    const handleArrayRemove = (category, subcategory, index) => {
        setFormData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [subcategory]: prev[category][subcategory].filter((_, i) => i !== index)
            }
        }));
    };

    const handleArrayItemChange = (category, subcategory, index, field, value) => {
        setFormData(prev => {
            const updatedArray = [...prev[category][subcategory]];
            updatedArray[index] = { ...updatedArray[index], [field]: value };
            return {
                ...prev,
                [category]: {
                    ...prev[category],
                    [subcategory]: updatedArray
                }
            };
        });
    };

    useEffect(() => {
        // Fetch existing budget data here
        // If budget exists, setBudget(budgetData) and setShowCreateButton(false)
    }, []);



    const handleUtilityChange = (utility, value) => {
        setFormData((prev) => ({
            ...prev,
            utilities: { ...prev.utilities, [utility]: value },
        }));
    };

    const handleLoanAdd = (type) => {
        setFormData(prev => ({
            ...prev,
            loans: [
                ...prev.loans,
                { type, name: '', balance: '', interestRate: '', monthlyPayment: '' }
            ]
        }));
    };

    const handleLoanChange = (index, field, value) => {
        setFormData(prev => {
            const updatedLoans = [...prev.loans];
            updatedLoans[index] = { ...updatedLoans[index], [field]: value };
            return { ...prev, loans: updatedLoans };
        });
    };

    const handleLoanRemove = (index) => {
        setFormData(prev => ({
            ...prev,
            loans: prev.loans.filter((_, i) => i !== index)
        }));
    };



    const handleCreditCardAdd = () => {
        setFormData(prev => ({
            ...prev,
            creditCards: [
                ...prev.creditCards,
                { dueDate: '', minPayment: '', interestRate: '', balance: '' }
            ]
        }));
    };

    const handleCreditCardChange = (index, field, value) => {
        setFormData(prev => {
            const updatedCards = [...prev.creditCards];
            updatedCards[index] = { ...updatedCards[index], [field]: value };
            return { ...prev, creditCards: updatedCards };
        });
    };

    const handleCreditCardRemove = (index) => {
        setFormData(prev => ({
            ...prev,
            creditCards: prev.creditCards.filter((_, i) => i !== index)
        }));
    };







    const handleInvestmentAccountAdd = () => {
        setFormData(prev => ({
            ...prev,
            investmentAccounts: [
                ...prev.investmentAccounts,
                { name: '', stocks: [] }
            ]
        }));
    };

    const handleInvestmentAccountChange = (index, field, value) => {
        setFormData(prev => {
            const updatedAccounts = [...prev.investmentAccounts];
            updatedAccounts[index] = { ...updatedAccounts[index], [field]: value };
            return { ...prev, investmentAccounts: updatedAccounts };
        });
    };

    const handleInvestmentAccountRemove = (index) => {
        setFormData(prev => ({
            ...prev,
            investmentAccounts: prev.investmentAccounts.filter((_, i) => i !== index)
        }));
    };



    const handleSubscriptionAdd = () => {
        setFormData(prev => ({
            ...prev,
            subscriptionServices: [
                ...prev.subscriptionServices,
                { name: '', monthlyCost: '', billingDate: '' }
            ]
        }));
    };

    const handleSubscriptionChange = (index, field, value) => {
        setFormData(prev => {
            const updatedSubscriptions = [...prev.subscriptionServices];
            updatedSubscriptions[index] = { ...updatedSubscriptions[index], [field]: value };
            return { ...prev, subscriptionServices: updatedSubscriptions };
        });
    };

    const handleSubscriptionRemove = (index) => {
        setFormData(prev => ({
            ...prev,
            subscriptionServices: prev.subscriptionServices.filter((_, i) => i !== index)
        }));
    };

    const handleVehicleAdd = () => {
        setFormData(prev => ({
            ...prev,
            vehicles: [
                ...prev.vehicles,
                { carOwnership: '', carPayment: '', carInsurance: '' }
            ]
        }));
    };

    const handleVehicleChange = (index, field, value) => {
        setFormData(prev => {
            const updatedVehicles = [...prev.vehicles];
            updatedVehicles[index] = { ...updatedVehicles[index], [field]: value };
            return { ...prev, vehicles: updatedVehicles };
        });
    };

    const handleVehicleRemove = (index) => {
        setFormData(prev => ({
            ...prev,
            vehicles: prev.vehicles.filter((_, i) => i !== index)
        }));
    };


    const handleAccountAdd = (accountType) => {
        const newAccount = {
            name: '',
            balance: '',
            ...(accountType === 'checking' && { monthlyFee: '' }),
            ...(accountType === 'savings' && { interestRate: '' }),
            ...(accountType === 'creditCards' && {
                creditLimit: '',
                interestRate: '',
                dueDate: ''
            }),
            ...(accountType === 'loans' && {
                interestRate: '',
                monthlyPayment: '',
                totalAmount: '',
                remainingTerm: ''
            }),
            ...(accountType === 'investmentAccounts' && {
                accountType: '',
                stocks: []
            })
        };

        setFormData(prev => ({
            ...prev,
            accounts: {
                ...prev.accounts,
                [accountType]: [...prev.accounts[accountType], newAccount]
            }
        }));
    };

    const handleAccountChange = (accountType, index, field, value) => {
        setFormData(prev => {
            const updatedAccounts = [...prev.accounts[accountType]];
            updatedAccounts[index] = { ...updatedAccounts[index], [field]: value };

            // Special handling for numeric fields
            if (['balance', 'monthlyFee', 'creditLimit', 'interestRate', 'monthlyPayment', 'totalAmount', 'remainingTerm'].includes(field)) {
                updatedAccounts[index][field] = value === '' ? '' : Number(value);
            }

            // Special handling for date fields
            if (field === 'dueDate') {
                updatedAccounts[index][field] = value;
            }

            return {
                ...prev,
                accounts: {
                    ...prev.accounts,
                    [accountType]: updatedAccounts
                }
            };
        });
    };

    const handleAccountRemove = (accountType, index) => {
        setFormData(prev => ({
            ...prev,
            accounts: {
                ...prev.accounts,
                [accountType]: prev.accounts[accountType].filter((_, i) => i !== index)
            }
        }));
    };

    const renderAccountSection = (accountType, title) => (
        <Accordion.Item eventKey={accountType}>
            <Accordion.Header>{title}</Accordion.Header>
            <Accordion.Body>
                {formData.accounts[accountType].map((account, index) => (
                    <div key={index} className="card mb-3">
                        <div className="card-body">
                            <div className="row mb-3">
                                <label htmlFor={`${accountType}Name-${index}`} className="col-sm-3 col-form-label">Account Name</label>
                                <div className="col-sm-9">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id={`${accountType}Name-${index}`}
                                        value={account.name}
                                        onChange={(e) => handleAccountChange(accountType, index, 'name', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor={`${accountType}Balance-${index}`} className="col-sm-3 col-form-label">Balance</label>
                                <div className="col-sm-9">
                                    <div className="input-group">
                                        <span className="input-group-text">$</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id={`${accountType}Balance-${index}`}
                                            value={account.balance}
                                            onChange={(e) => handleAccountChange(accountType, index, 'balance', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            {accountType === 'checking' && (
                                <div className="row mb-3">
                                    <label htmlFor={`${accountType}MonthlyFee-${index}`} className="col-sm-3 col-form-label">Monthly Fee</label>
                                    <div className="col-sm-9">
                                        <div className="input-group">
                                            <span className="input-group-text">$</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id={`${accountType}MonthlyFee-${index}`}
                                                value={account.monthlyFee}
                                                onChange={(e) => handleAccountChange(accountType, index, 'monthlyFee', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {accountType === 'savings' && (
                                <div className="row mb-3">
                                    <label htmlFor={`${accountType}InterestRate-${index}`} className="col-sm-3 col-form-label">Interest Rate</label>
                                    <div className="col-sm-9">
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id={`${accountType}InterestRate-${index}`}
                                                value={account.interestRate}
                                                onChange={(e) => handleAccountChange(accountType, index, 'interestRate', e.target.value)}
                                            />
                                            <span className="input-group-text">%</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {accountType === 'creditCards' && (
                                <>
                                    <div className="row mb-3">
                                        <label htmlFor={`${accountType}CreditLimit-${index}`} className="col-sm-3 col-form-label">Credit Limit</label>
                                        <div className="col-sm-9">
                                            <div className="input-group">
                                                <span className="input-group-text">$</span>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id={`${accountType}CreditLimit-${index}`}
                                                    value={account.creditLimit}
                                                    onChange={(e) => handleAccountChange(accountType, index, 'creditLimit', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label htmlFor={`${accountType}InterestRate-${index}`} className="col-sm-3 col-form-label">Interest Rate</label>
                                        <div className="col-sm-9">
                                            <div className="input-group">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id={`${accountType}InterestRate-${index}`}
                                                    value={account.interestRate}
                                                    onChange={(e) => handleAccountChange(accountType, index, 'interestRate', e.target.value)}
                                                />
                                                <span className="input-group-text">%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label htmlFor={`${accountType}DueDate-${index}`} className="col-sm-3 col-form-label">Due Date</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="date"
                                                className="form-control"
                                                id={`${accountType}DueDate-${index}`}
                                                value={account.dueDate}
                                                onChange={(e) => handleAccountChange(accountType, index, 'dueDate', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                            {accountType === 'loans' && (
                                <>
                                    <div className="row mb-3">
                                        <label htmlFor={`${accountType}InterestRate-${index}`} className="col-sm-3 col-form-label">Interest Rate</label>
                                        <div className="col-sm-9">
                                            <div className="input-group">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id={`${accountType}InterestRate-${index}`}
                                                    value={account.interestRate}
                                                    onChange={(e) => handleAccountChange(accountType, index, 'interestRate', e.target.value)}
                                                />
                                                <span className="input-group-text">%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label htmlFor={`${accountType}MonthlyPayment-${index}`} className="col-sm-3 col-form-label">Monthly Payment</label>
                                        <div className="col-sm-9">
                                            <div className="input-group">
                                                <span className="input-group-text">$</span>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id={`${accountType}MonthlyPayment-${index}`}
                                                    value={account.monthlyPayment}
                                                    onChange={(e) => handleAccountChange(accountType, index, 'monthlyPayment', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label htmlFor={`${accountType}TotalAmount-${index}`} className="col-sm-3 col-form-label">Total Loan Amount</label>
                                        <div className="col-sm-9">
                                            <div className="input-group">
                                                <span className="input-group-text">$</span>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id={`${accountType}TotalAmount-${index}`}
                                                    value={account.totalAmount}
                                                    onChange={(e) => handleAccountChange(accountType, index, 'totalAmount', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label htmlFor={`${accountType}RemainingTerm-${index}`} className="col-sm-3 col-form-label">Remaining Term (months)</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id={`${accountType}RemainingTerm-${index}`}
                                                value={account.remainingTerm}
                                                onChange={(e) => handleAccountChange(accountType, index, 'remainingTerm', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                            {accountType === 'investmentAccounts' && (
                                <>
                                    <div className="row mb-3">
                                        <label htmlFor={`${accountType}Type-${index}`} className="col-sm-3 col-form-label">Account Type</label>
                                        <div className="col-sm-9">
                                            <select
                                                className="form-select"
                                                id={`${accountType}Type-${index}`}
                                                value={account.accountType}
                                                onChange={(e) => handleAccountChange(accountType, index, 'accountType', e.target.value)}
                                            >
                                                <option value="">Select...</option>
                                                <option value="401k">401(k)</option>
                                                <option value="ira">IRA</option>
                                                <option value="brokerage">Brokerage</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <h6>Stocks</h6>
                                        {account.stocks.map((stock, stockIndex) => (
                                            <div key={stockIndex} className="card mb-2">
                                                <div className="card-body">
                                                    <div className="row mb-2">
                                                        <div className="col-sm-4">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Symbol"
                                                                value={stock.symbol}
                                                                onChange={(e) => handleStockChange(index, stockIndex, 'symbol', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                placeholder="Quantity"
                                                                value={stock.quantity}
                                                                onChange={(e) => handleStockChange(index, stockIndex, 'quantity', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="input-group">
                                                                <span className="input-group-text">$</span>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    placeholder="Cost Basis"
                                                                    value={stock.costBasis}
                                                                    onChange={(e) => handleStockChange(index, stockIndex, 'costBasis', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleStockRemove(index, stockIndex)}
                                                    >
                                                        Remove Stock
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => handleStockAdd(index)}
                                        >
                                            Add Stock
                                        </button>
                                    </div>
                                </>
                            )}
                            <button
                                type="button"
                                className="btn btn-danger mt-3"
                                onClick={() => handleAccountRemove(accountType, index)}
                            >
                                Remove Account
                            </button>
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleAccountAdd(accountType)}
                >
                    Add {title}
                </button>
            </Accordion.Body>
        </Accordion.Item>
    );


    const handleStockAdd = (accountIndex) => {
        setFormData(prev => {
            const updatedInvestmentAccounts = [...prev.accounts.investmentAccounts];
            updatedInvestmentAccounts[accountIndex].stocks.push({ symbol: '', quantity: '', costBasis: '' });
            return {
                ...prev,
                accounts: {
                    ...prev.accounts,
                    investmentAccounts: updatedInvestmentAccounts
                }
            };
        });
    };

    const handleStockChange = (accountIndex, stockIndex, field, value) => {
        setFormData(prev => {
            const updatedInvestmentAccounts = [...prev.accounts.investmentAccounts];
            updatedInvestmentAccounts[accountIndex].stocks[stockIndex] = {
                ...updatedInvestmentAccounts[accountIndex].stocks[stockIndex],
                [field]: value
            };
            return {
                ...prev,
                accounts: {
                    ...prev.accounts,
                    investmentAccounts: updatedInvestmentAccounts
                }
            };
        });
    };

    const handleStockRemove = (accountIndex, stockIndex) => {
        setFormData(prev => {
            const updatedInvestmentAccounts = [...prev.accounts.investmentAccounts];
            updatedInvestmentAccounts[accountIndex].stocks = updatedInvestmentAccounts[accountIndex].stocks.filter((_, i) => i !== stockIndex);
            return {
                ...prev,
                accounts: {
                    ...prev.accounts,
                    investmentAccounts: updatedInvestmentAccounts
                }
            };
        });
    };



    const steps = [


        {
            title: 'Income',
            content: (
                <>
                    <h5 className="mb-3">Your Income</h5>
                    {Object.entries(formData.income).map(([key, value]) => (
                        <div key={key} className="row mb-3">
                            <label htmlFor={key} className="col-sm-3 col-form-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                            <div className="col-sm-9">
                                <div className="input-group">
                                    <span className="input-group-text">$</span>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id={key}
                                        value={value}
                                        onChange={(e) => handleInputChange('income', key, e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            ),
        },
        {
            title: 'Housing',
            content: (
                <>
                    <h5 className="mb-3">Housing Expenses</h5>
                    <div className="row mb-3">
                        <label htmlFor="housingType" className="col-sm-3 col-form-label">Housing Type</label>
                        <div className="col-sm-9">
                            <select
                                className="form-select"
                                id="housingType"
                                value={formData.housing.housingType}
                                onChange={(e) => handleInputChange('housing', 'housingType', e.target.value)}
                            >
                                <option value="">Select...</option>
                                <option value="rent">Rent</option>
                                <option value="own">Own</option>
                            </select>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="housingCost" className="col-sm-3 col-form-label">Housing Cost</label>
                        <div className="col-sm-9">
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="housingCost"
                                    value={formData.housing.housingCost}
                                    onChange={(e) => handleInputChange('housing', 'housingCost', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="homeInsurance" className="col-sm-3 col-form-label">Home Insurance</label>
                        <div className="col-sm-9">
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="homeInsurance"
                                    value={formData.housing.homeInsurance}
                                    onChange={(e) => handleInputChange('housing', 'homeInsurance', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <h6 className="mt-4 mb-3">Utilities</h6>
                    {Object.entries(formData.housing.utilities).map(([key, value]) => (
                        <div key={key} className="row mb-3">
                            <label htmlFor={`utilities-${key}`} className="col-sm-3 col-form-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                            <div className="col-sm-9">
                                <div className="input-group">
                                    <span className="input-group-text">$</span>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id={`utilities-${key}`}
                                        value={value}
                                        onChange={(e) => handleNestedInputChange('housing', 'utilities', key, e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            ),
        },
        {
            title: 'Essential Expenses',
            content: (
                <>
                    <h5 className="mb-3">Essential Expenses</h5>
                    <div className="row mb-3">
                        <label htmlFor="cellPhone" className="col-sm-3 col-form-label">Cell Phone</label>
                        <div className="col-sm-9">
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="cellPhone"
                                    value={formData.essentials.cellPhone}
                                    onChange={(e) => handleInputChange('essentials', 'cellPhone', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="internet" className="col-sm-3 col-form-label">Internet</label>
                        <div className="col-sm-9">
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="internet"
                                    value={formData.essentials.internet}
                                    onChange={(e) => handleInputChange('essentials', 'internet', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="groceries" className="col-sm-3 col-form-label">Groceries</label>
                        <div className="col-sm-9">
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="groceries"
                                    value={formData.essentials.groceries}
                                    onChange={(e) => handleInputChange('essentials', 'groceries', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="healthcare" className="col-sm-3 col-form-label">Healthcare</label>
                        <div className="col-sm-9">
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="healthcare"
                                    value={formData.essentials.healthcare}
                                    onChange={(e) => handleInputChange('essentials', 'healthcare', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="healthInsurance" className="col-sm-3 col-form-label">Health Insurance</label>
                        <div className="col-sm-9">
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="healthInsurance"
                                    value={formData.essentials.healthInsurance}
                                    onChange={(e) => handleInputChange('essentials', 'healthInsurance', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="dentalInsurance" className="col-sm-3 col-form-label">Dental Insurance</label>
                        <div className="col-sm-9">
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="dentalInsurance"
                                    value={formData.essentials.dentalInsurance}
                                    onChange={(e) => handleInputChange('essentials', 'dentalInsurance', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="visionInsurance" className="col-sm-3 col-form-label">Vision Insurance</label>
                        <div className="col-sm-9">
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="visionInsurance"
                                    value={formData.essentials.visionInsurance}
                                    onChange={(e) => handleInputChange('essentials', 'visionInsurance', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="lifeInsurance" className="col-sm-3 col-form-label">Life Insurance</label>
                        <div className="col-sm-9">
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="lifeInsurance"
                                    value={formData.essentials.lifeInsurance}
                                    onChange={(e) => handleInputChange('essentials', 'lifeInsurance', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                </>
            ),
        },

        {
            title: 'Vehicles',
            content: (
                <>
                    <h5 className="mb-3">Your Vehicles</h5>
                    {formData.vehicles.map((vehicle, index) => (
                        <div key={index} className="card mb-3">
                            <div className="card-body">
                                <h6 className="card-title">Vehicle {index + 1}</h6>
                                <div className="row mb-3">
                                    <label htmlFor={`carOwnership-${index}`} className="col-sm-3 col-form-label">Ownership Type</label>
                                    <div className="col-sm-9">
                                        <select
                                            className="form-select"
                                            id={`carOwnership-${index}`}
                                            value={vehicle.carOwnership}
                                            onChange={(e) => handleVehicleChange(index, 'carOwnership', e.target.value)}
                                        >
                                            <option value="">Select...</option>
                                            <option value="own">Own</option>
                                            <option value="lease">Lease</option>
                                            <option value="finance">Finance</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor={`carPayment-${index}`} className="col-sm-3 col-form-label">Monthly Payment</label>
                                    <div className="col-sm-9">
                                        <div className="input-group">
                                            <span className="input-group-text">$</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id={`carPayment-${index}`}
                                                value={vehicle.carPayment}
                                                onChange={(e) => handleVehicleChange(index, 'carPayment', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor={`carInsurance-${index}`} className="col-sm-3 col-form-label">Monthly Insurance</label>
                                    <div className="col-sm-9">
                                        <div className="input-group">
                                            <span className="input-group-text">$</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id={`carInsurance-${index}`}
                                                value={vehicle.carInsurance}
                                                onChange={(e) => handleVehicleChange(index, 'carInsurance', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <label htmlFor={`vehicleYear-${index}`} className="form-label">Year</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id={`vehicleYear-${index}`}
                                            value={vehicle.year}
                                            onChange={(e) => handleVehicleChange(index, 'year', e.target.value)}
                                            placeholder="e.g., 2023"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor={`vehicleMake-${index}`} className="form-label">Make</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id={`vehicleMake-${index}`}
                                            value={vehicle.make}
                                            onChange={(e) => handleVehicleChange(index, 'make', e.target.value)}
                                            placeholder="e.g., Toyota"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor={`vehicleModel-${index}`} className="form-label">Model</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id={`vehicleModel-${index}`}
                                            value={vehicle.model}
                                            onChange={(e) => handleVehicleChange(index, 'model', e.target.value)}
                                            placeholder="e.g., Camry"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleVehicleRemove(index)}
                                >
                                    Remove Vehicle
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleVehicleAdd}
                    >
                        Add Vehicle
                    </button>
                </>
            ),
        },
        {
            title: 'Accounts',
            content: (
                <>
                    <h5 className="mb-3">Your Accounts</h5>
                    <Accordion defaultActiveKey="0">
                        {renderAccountSection('checking', 'Checking Account')}
                        {renderAccountSection('savings', 'Savings Account')}
                        {renderAccountSection('creditCards', 'Credit Card')}
                        {renderAccountSection('loans', 'Loan')}
                        {renderAccountSection('investmentAccounts', 'Investment Account')}
                    </Accordion>
                </>
            ),
        },


        {
            title: 'Subscription Services',
            content: (
                <>
                    <h5 className="mb-3">Your Subscription Services</h5>
                    {formData.subscriptionServices.map((subscription, index) => (
                        <div key={index} className="card mb-3">
                            <div className="card-body">
                                <h6 className="card-title">Subscription {index + 1}</h6>
                                <div className="row mb-3">
                                    <label htmlFor={`subscriptionName-${index}`} className="col-sm-3 col-form-label">Service Name</label>
                                    <div className="col-sm-9">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id={`subscriptionName-${index}`}
                                            value={subscription.name}
                                            onChange={(e) => handleSubscriptionChange(index, 'name', e.target.value)}
                                            placeholder="e.g., Netflix, Spotify"
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor={`subscriptionCost-${index}`} className="col-sm-3 col-form-label">Monthly Cost</label>
                                    <div className="col-sm-9">
                                        <div className="input-group">
                                            <span className="input-group-text">$</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id={`subscriptionCost-${index}`}
                                                value={subscription.monthlyCost}
                                                onChange={(e) => handleSubscriptionChange(index, 'monthlyCost', e.target.value)}
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor={`subscriptionBillingDate-${index}`} className="col-sm-3 col-form-label">Billing Date</label>
                                    <div className="col-sm-9">
                                        <input
                                            type="date"
                                            className="form-control"
                                            id={`subscriptionBillingDate-${index}`}
                                            value={subscription.billingDate}
                                            onChange={(e) => handleSubscriptionChange(index, 'billingDate', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleSubscriptionRemove(index)}
                                >
                                    Remove Subscription
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSubscriptionAdd}
                    >
                        Add Subscription Service
                    </button>
                </>
            ),
        }

        // ... other steps ...
    ];


    const modalStyle = {
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
    };

    const modalBodyStyle = {
        height: 'calc(100% - 120px)', // Adjust this value as needed
        overflowY: 'auto',
    };

    const modalFooterStyle = {
        marginTop: 'auto',
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const response = await fetch('/gettingStarted', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit budget data');
            }

            const result = await response.json();
            setBudget(result);
            setShowCreateButton(false);
            setShowModal(false);
        } catch (error) {
            console.error('Error submitting budget:', error);
            setSubmitError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (

        <div className="budget-page">
            {showCreateButton ? (
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>Get Started</button>
            ) : budget ? (
                <div className="alert alert-success">
                    Budget successfully created!
                </div>
            ) : null}

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" dialogClassName="modal-90w">
                <div style={modalStyle}>
                    <Modal.Header closeButton>
                        <Modal.Title>{steps[currentStep].title}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body style={modalBodyStyle}>
                        {steps[currentStep]?.content}
                        {submitError && (
                            <div className="alert alert-danger mt-3">
                                {submitError}
                            </div>
                        )}
                    </Modal.Body>

                    <Modal.Footer style={modalFooterStyle}>
                        {currentStep > 0 && (
                            <Button variant="secondary" onClick={() => setCurrentStep(currentStep - 1)} disabled={isSubmitting}>
                                Back
                            </Button>
                        )}
                        <Button
                            variant="primary"
                            onClick={() => {
                                if (currentStep === steps.length - 1) {
                                    handleSubmit();
                                } else {
                                    setCurrentStep(currentStep + 1);
                                }
                            }}
                            disabled={isSubmitting}
                        >
                            {currentStep === steps.length - 1 ? (isSubmitting ? 'Submitting...' : 'Submit') : 'Next'}
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('getStartedButton'));
root.render(<BudgetPage />);