from flask import jsonify, g, session, redirect, url_for
from werkzeug.exceptions import HTTPException
import jwt
from functools import wraps
from flask import request, current_app
from .models import User
import re
from datetime import datetime, timedelta

def handle_error(e):
    """Global error handler."""
    code = 500
    if isinstance(e, HTTPException):
        code = e.code
    return jsonify(error=str(e)), code

def validate_email(email):
    """Validate email format."""
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """
    Validate password strength.
    Password should be at least 8 characters long and contain a mix of uppercase, lowercase, numbers and special characters.
    """
    if len(password) < 8:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'[a-z]', password):
        return False
    if not re.search(r'\d', password):
        return False
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False
    return True

def generate_confirmation_token(user_id):
    """Generate a confirmation token for email verification."""
    expiration = datetime.utcnow() + timedelta(hours=24)
    return jwt.encode(
        {'confirm': user_id, 'exp': expiration},
        current_app.config['SECRET_KEY'],
        algorithm='HS256'
    )

def confirm_token(token):
    """Confirm a verification token."""
    try:
        data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
    except:
        return False
    if 'confirm' not in data:
        return False
    return data['confirm']

def send_email(to, subject, template):
    """
    Send an email.
    This is a placeholder function. You'll need to implement the actual email sending logic.
    """
    # Implement email sending logic here
    print(f"Sending email to {to} with subject {subject}")

def requires_roles(*roles):
    """
    Function decorator for role-based access control.
    Usage: @requires_roles('admin', 'manager')
    """
    def wrapper(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return jsonify({'message': 'Missing authorization header'}), 401
            try:
                token = auth_header.split()[1]
                payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
                user = User.query.get(payload['sub'])
                if not user or not any(role in user.roles for role in roles):
                    return jsonify({'message': 'Insufficient permissions'}), 403
            except jwt.ExpiredSignatureError:
                return jsonify({'message': 'Token has expired'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'message': 'Invalid token'}), 401
            return f(*args, **kwargs)
        return wrapped
    return wrapper

def calculate_financial_ratios(income, expenses, assets, liabilities):
    """Calculate various financial ratios."""
    ratios = {}
    
    # Debt-to-Income Ratio
    if income > 0:
        ratios['debt_to_income'] = liabilities / income
    
    # Savings Rate
    if income > 0:
        ratios['savings_rate'] = (income - expenses) / income
    
    # Debt-to-Asset Ratio
    if assets > 0:
        ratios['debt_to_asset'] = liabilities / assets
    
    # Liquidity Ratio (assuming current assets and current liabilities)
    if liabilities > 0:
        ratios['liquidity'] = assets / liabilities
    
    return ratios

def categorize_transaction(description):
    """
    Categorize a transaction based on its description.
    This is a simple example and should be expanded based on your needs.
    """
    description = description.lower()
    if any(word in description for word in ['grocery', 'supermarket', 'food']):
        return 'Groceries'
    elif any(word in description for word in ['restaurant', 'cafe', 'bar']):
        return 'Dining Out'
    elif any(word in description for word in ['uber', 'lyft', 'taxi', 'transport']):
        return 'Transportation'
    elif any(word in description for word in ['netflix', 'spotify', 'hulu']):
        return 'Entertainment'
    else:
        return 'Miscellaneous'

def format_currency(amount, currency='USD'):
    """Format a currency amount."""
    if currency == 'USD':
        return f'${amount:,.2f}'
    elif currency == 'EUR':
        return f'€{amount:,.2f}'
    else:
        return f'{amount:,.2f} {currency}'


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        print(session.keys())
        if 'user_id' not in session:
            return redirect(url_for('auth.login'))
        user = User.query.get(session['user_id'])
        if user is None:
            return redirect(url_for('auth.login'))
        g.user = user  # Store user in Flask's g object for the duration of the request
        return f(*args, **kwargs)
    return decorated_function