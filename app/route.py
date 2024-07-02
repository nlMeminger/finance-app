from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import User, Account, Transaction, Budget, SavingsGoal, Bill, Investment, Debt
from . import db
from sqlalchemy.exc import IntegrityError
from datetime import datetime

main = Blueprint('main', __name__)

@main.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@main.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    try:
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Username or email already exists"}), 400

@main.route('/login', methods=['POST'])
def login():
    # Implement login logic here
    pass

@main.route('/accounts', methods=['GET', 'POST'])
@jwt_required()
def accounts():
    user_id = get_jwt_identity()
    if request.method == 'GET':
        accounts = Account.query.filter_by(user_id=user_id).all()
        return jsonify([account.to_dict() for account in accounts]), 200
    elif request.method == 'POST':
        data = request.get_json()
        new_account = Account(user_id=user_id, name=data['name'], type=data['type'], 
                              balance=data['balance'], currency=data['currency'])
        db.session.add(new_account)
        db.session.commit()
        return jsonify(new_account.to_dict()), 201

@main.route('/transactions', methods=['GET', 'POST'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
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

@main.route('/bills', methods=['GET', 'POST'])
@jwt_required()
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

@main.route('/investments', methods=['GET', 'POST'])
@jwt_required()
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
@jwt_required()
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

@main.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    user_id = get_jwt_identity()
    # Implement dashboard data aggregation here
    # This could include total balance, recent transactions, budget status, etc.
    return jsonify({"message": "Dashboard data"}), 200

# Add more routes as needed for other features