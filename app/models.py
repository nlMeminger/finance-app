from . import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import timedelta
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    accounts = db.relationship('Account', back_populates='user', lazy=True)
    budgets = db.relationship('Budget', back_populates='user', lazy=True)
    savings_goals = db.relationship('SavingsGoal', back_populates='user', lazy=True)
    bills = db.relationship('Bill', back_populates='user', lazy=True)
    investments = db.relationship('Investment', back_populates='user', lazy=True)
    debts = db.relationship('Debt', back_populates='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Account(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    balance = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), nullable=False)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', back_populates='accounts')
    transactions = db.relationship('Transaction', back_populates='account', lazy=True)
    bills = db.relationship('Bill', back_populates='account', lazy=True)

    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'name': self.name,
            'type': self.type,
            'balance': self.balance,
            'currency': self.currency,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None
        }

class Transaction(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    account_id = db.Column(UUID(as_uuid=True), db.ForeignKey('account.id'), nullable=False)
    bill_id = db.Column(UUID(as_uuid=True), db.ForeignKey('bill.id'), nullable=True)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200))
    category = db.Column(db.String(100))
    date = db.Column(db.DateTime, nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'income' or 'expense'

    account = db.relationship('Account', back_populates='transactions')
    bill = db.relationship('Bill', back_populates='transactions')

    def to_dict(self):
        return {
            'id': str(self.id),
            'account_id': str(self.account_id),
            'bill_id': str(self.bill_id) if self.bill_id else None,
            'amount': self.amount,
            'description': self.description,
            'category': self.category,
            'date': self.date.isoformat(),
            'type': self.type
        }

class Budget(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    period = db.Column(db.String(20), nullable=False)  # 'monthly', 'yearly', etc.
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime)

    user = db.relationship('User', back_populates='budgets')

class SavingsGoal(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    target_amount = db.Column(db.Float, nullable=False)
    current_amount = db.Column(db.Float, nullable=False, default=0)
    target_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='savings_goals')
class Bill(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=False)
    account_id = db.Column(UUID(as_uuid=True), db.ForeignKey('account.id'), nullable=True)
    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    due_date = db.Column(db.DateTime, nullable=False)
    recurring = db.Column(db.Boolean, default=False)
    frequency = db.Column(db.String(20))
    payment_status = db.Column(db.String(20), default='unpaid')
    category = db.Column(db.String(50))
    is_credit_card = db.Column(db.Boolean, default=False)
    last_paid_date = db.Column(db.DateTime, nullable=True)
    
    user = db.relationship('User', back_populates='bills')
    account = db.relationship('Account', back_populates='bills')
    transactions = db.relationship('Transaction', back_populates='bill', lazy='dynamic')
    pdf_files = db.relationship('BillPDF', back_populates='bill', lazy=True)

    def mark_as_paid(self):
        self.payment_status = 'paid'
        self.last_paid_date = datetime.utcnow()

    def should_reset_payment_status(self):
        if not self.recurring or not self.last_paid_date:
            return False

        today = datetime.utcnow().date()
        days_since_last_paid = (today - self.last_paid_date.date()).days

        if self.frequency == 'monthly' and days_since_last_paid >= 28:
            return True
        elif self.frequency == 'yearly' and days_since_last_paid >= 365:
            return True

        return False

    def reset_payment_status(self):
        if self.should_reset_payment_status():
            self.payment_status = 'unpaid'
            # Update the due date
            if self.frequency == 'monthly':
                self.due_date = self.last_paid_date + timedelta(days=30)
            elif self.frequency == 'yearly':
                self.due_date = self.last_paid_date + timedelta(days=365)

    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'account_id': str(self.account_id) if self.account_id else None,
            'name': self.name,
            'amount': self.amount,
            'due_date': self.due_date.isoformat(),
            'recurring': self.recurring,
            'frequency': self.frequency,
            'payment_status': self.payment_status,
            'category': self.category,
            'is_credit_card': self.is_credit_card,
            'last_paid_date': self.last_paid_date.isoformat() if self.last_paid_date else None
        }
class BillPDF(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bill_id = db.Column(UUID(as_uuid=True), db.ForeignKey('bill.id'), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)

    bill = db.relationship('Bill', back_populates='pdf_files')

class Investment(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    current_value = db.Column(db.Float)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='investments')

class Debt(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    interest_rate = db.Column(db.Float)
    minimum_payment = db.Column(db.Float)
    due_date = db.Column(db.DateTime)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='debts')