from flask import Blueprint, request, jsonify, Flask, g, render_template, url_for, session, flash, redirect
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, JWTManager
from .models import User, Account, Transaction, Budget, SavingsGoal, Bill, Investment, Debt
from . import db
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from functools import wraps
from .utils import login_required
import uuid
main = Blueprint('main', __name__) 
app = Flask(__name__)
jwt = JWTManager(app)


@main.route('/', methods=['GET'])
@login_required
def index():
    return render_template('index.html')

@main.route('/gettingStarted', methods=[ 'POST'])
@login_required
def gettingStarted():
    print(request.json)
    response = {
        'success': True,
        'message': '"Budget successfully created"',
    }   
    return jsonify(response)


@main.route('/dashboard', methods=['GET'])
@login_required
def dashboard():
    return redirect(url_for('main.index'))

@main.route('/accounts', methods=['GET', 'POST'])
@login_required
def accounts():
    """Handle account creation and viewing."""
    if request.method == 'POST':
        # Handle account creation
        name = request.form.get('name')
        account_type = request.form.get('type')
        balance = request.form.get('balance')
        currency = request.form.get('currency')

        if not all([name, account_type, balance, currency]):
            flash('All fields are required', 'error')
        else:
            try:
                balance = float(balance)
                new_account = Account(
                    user_id=g.user.id,  # Use g.user.id to get the user id
                    name=name,
                    type=account_type,
                    balance=balance,
                    currency=currency
                )
                db.session.add(new_account)
                db.session.commit()
                flash('Account created successfully', 'success')
            except ValueError:
                flash('Invalid balance amount', 'error')
            except Exception as e:
                db.session.rollback()
                flash(f'An error occurred: {str(e)}', 'error')

        return redirect(url_for('main.accounts'))

    # GET request: Fetch and display accounts
    accounts = Account.query.filter_by(user_id=g.user.id).all()
    return render_template('money/accounts.html', accounts=accounts)

@main.route('/account/<uuid:account_id>')
@login_required
def account_details(account_id):
    account = Account.query.get_or_404(account_id)
    transactions = Transaction.query.filter_by(account_id=account_id).order_by(Transaction.date.desc()).all()
    return render_template('money/account_details.html', account=account, transactions=transactions)














@main.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200



@main.route('/bills', methods=['GET'])
@login_required
def bills():
    user_id = session['user_id']
    current_date = datetime.utcnow().date()
    
    # Get all bills and update their status
    all_bills = Bill.query.filter_by(user_id=user_id).all()
    for bill in all_bills:
        bill.reset_payment_status()
    db.session.commit()

    # Get upcoming and unpaid bills
    upcoming_bills = Bill.query.filter(
        Bill.user_id == user_id,
        Bill.payment_status == 'unpaid'
    ).order_by(Bill.due_date).all()
    
    # Get paid bills
    paid_bills = Bill.query.filter(
        Bill.user_id == user_id,
        Bill.payment_status == 'paid'
    ).order_by(Bill.last_paid_date.desc()).all()

    accounts = Account.query.filter_by(user_id=user_id).all()
    return render_template('money/bills.html', upcoming_bills=upcoming_bills, paid_bills=paid_bills, accounts=accounts)


@main.route('/bills/add', methods=['POST'])
@login_required
def add_bill():
    user_id = session['user_id']
    data = request.json
    
    try:
        new_bill = Bill(
            user_id=user_id,
            name=data['name'],
            amount=float(data['amount']),
            due_date=datetime.strptime(data['due_date'], '%Y-%m-%d'),
            recurring=data.get('recurring', False),
            frequency=data.get('frequency'),
            category=data.get('category'),
            account_id=data.get('account_id'),
            is_credit_card=data.get('is_credit_card', False)
        )
        db.session.add(new_bill)
        db.session.commit()
        return jsonify({"message": "Bill added successfully", "id": str(new_bill.id)}), 201
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"message": f"Error adding bill: {str(e)}"}), 400

@main.route('/bills/<uuid:bill_id>/mark_paid', methods=['POST'])
@login_required
def mark_bill_paid(bill_id):
    bill = Bill.query.get_or_404(bill_id)
    if bill.user_id != session['user_id']:
        return jsonify({"message": "Unauthorized"}), 403

    bill.mark_as_paid()
    db.session.commit()
    return jsonify({"message": "Bill marked as paid successfully"}), 200


@main.route('/bills/<uuid:bill_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_bill(bill_id):
    bill = Bill.query.get_or_404(bill_id)
    if bill.user_id != session['user_id']:
        return jsonify({"message": "Unauthorized"}), 403

    if request.method == 'POST':
        data = request.json
        try:
            bill.name = data['name']
            bill.amount = float(data['amount'])
            bill.due_date = datetime.strptime(data['due_date'], '%Y-%m-%d')
            bill.recurring = data.get('recurring', False)
            bill.frequency = data.get('frequency')
            bill.category = data.get('category')
            bill.is_credit_card = data.get('is_credit_card', False)

            account_id = data.get('account_id')
            if account_id:
                bill.account_id = uuid.UUID(account_id)
            else:
                bill.account_id = None

            db.session.commit()
            return jsonify({"message": "Bill updated successfully"}), 200
        except Exception as e:
            print(e)
            db.session.rollback()
            return jsonify({"message": f"Error updating bill: {str(e)}"}), 400

    # For GET requests, return the bill data
    return jsonify(bill.to_dict()), 200

@main.route('/bills/<uuid:bill_id>/delete', methods=['POST'])
@login_required
def delete_bill(bill_id):
    bill = Bill.query.get_or_404(bill_id)
    if bill.user_id != session['user_id']:
        return jsonify({"message": "Unauthorized"}), 403

    try:
        db.session.delete(bill)
        db.session.commit()
        return jsonify({"message": "Bill deleted successfully"}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"message": f"Error deleting bill: {str(e)}"}), 400


@main.route('/bills/<uuid:bill_id>/details')
@login_required
def bill_details(bill_id):
    bill = Bill.query.get_or_404(bill_id)
    if bill.user_id != session['user_id']:
        return jsonify({"message": "Unauthorized"}), 403
    
    # Get all transactions linked to this bill
    transactions = Transaction.query.filter_by(bill_id=bill_id).order_by(Transaction.date.desc()).all()
    
    return render_template('money/bill_details.html', bill=bill, transactions=transactions)















@main.route('/transactions', methods=['GET', 'POST'])
@login_required
def transactions():
    user_id = get_jwt_identity()
    if request.method == 'GET':
        account_id = request.args.get('account_id')
        transactions = Transaction.query.join(Account).filter(Account.user_id == user_id)
        if account_id:
            transactions = transactions.filter(Transaction.account_id == account_id)
        transactions = transactions.order_by(Transaction.date.desc()).all()
        return jsonify([transaction.to_dict() for transaction in transactions]), 200
    elif request.method == 'POST':
        data = request.get_json()
        new_transaction = Transaction(account_id=data['account_id'], amount=data['amount'],
                                      description=data['description'], category=data['category'],
                                      date=datetime.fromisoformat(data['date']), type=data['type'])
        db.session.add(new_transaction)
        db.session.commit()
        return jsonify(new_transaction.to_dict()), 201

@main.route('/budgets', methods=['GET', 'POST'])
@login_required
def budgets():
    user_id = get_jwt_identity()
    if request.method == 'GET':
        budgets = Budget.query.filter_by(user_id=user_id).all()
        return jsonify([budget.to_dict() for budget in budgets]), 200
    elif request.method == 'POST':
        data = request.get_json()
        new_budget = Budget(user_id=user_id, category=data['category'], amount=data['amount'],
                            period=data['period'], start_date=datetime.fromisoformat(data['start_date']))
        if 'end_date' in data:
            new_budget.end_date = datetime.fromisoformat(data['end_date'])
        db.session.add(new_budget)
        db.session.commit()
        return jsonify(new_budget.to_dict()), 201

@main.route('/savings-goals', methods=['GET', 'POST'])
@login_required
def savings_goals():
    user_id = get_jwt_identity()
    if request.method == 'GET':
        goals = SavingsGoal.query.filter_by(user_id=user_id).all()
        return jsonify([goal.to_dict() for goal in goals]), 200
    elif request.method == 'POST':
        data = request.get_json()
        new_goal = SavingsGoal(user_id=user_id, name=data['name'], target_amount=data['target_amount'],
                               current_amount=data.get('current_amount', 0))
        if 'target_date' in data:
            new_goal.target_date = datetime.fromisoformat(data['target_date'])
        db.session.add(new_goal)
        db.session.commit()
        return jsonify(new_goal.to_dict()), 201

"""
@main.route('/bills', methods=['GET', 'POST'])
@login_required
def bills():
    user_id = get_jwt_identity()
    if request.method == 'GET':
        bills = Bill.query.filter_by(user_id=user_id).all()
        return jsonify([bill.to_dict() for bill in bills]), 200
    elif request.method == 'POST':
        data = request.get_json()
        new_bill = Bill(user_id=user_id, name=data['name'], amount=data['amount'],
                        due_date=datetime.fromisoformat(data['due_date']),
                        recurring=data.get('recurring', False),
                        frequency=data.get('frequency'))
        db.session.add(new_bill)
        db.session.commit()
        return jsonify(new_bill.to_dict()), 201
"""
@main.route('/investments', methods=['GET', 'POST'])
@login_required
def investments():
    user_id = get_jwt_identity()
    if request.method == 'GET':
        investments = Investment.query.filter_by(user_id=user_id).all()
        return jsonify([investment.to_dict() for investment in investments]), 200
    elif request.method == 'POST':
        data = request.get_json()
        new_investment = Investment(user_id=user_id, name=data['name'], type=data['type'],
                                    amount=data['amount'], date=datetime.fromisoformat(data['date']),
                                    current_value=data.get('current_value', data['amount']))
        db.session.add(new_investment)
        db.session.commit()
        return jsonify(new_investment.to_dict()), 201

@main.route('/debts', methods=['GET', 'POST'])
@login_required
def debts():
    user_id = get_jwt_identity()
    if request.method == 'GET':
        debts = Debt.query.filter_by(user_id=user_id).all()
        return jsonify([debt.to_dict() for debt in debts]), 200
    elif request.method == 'POST':
        data = request.get_json()
        new_debt = Debt(user_id=user_id, name=data['name'], amount=data['amount'],
                        interest_rate=data.get('interest_rate'),
                        minimum_payment=data.get('minimum_payment'),
                        due_date=datetime.fromisoformat(data['due_date']) if 'due_date' in data else None)
        db.session.add(new_debt)
        db.session.commit()
        return jsonify(new_debt.to_dict()), 201






