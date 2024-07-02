from app import create_app, db, celery
from app.models import User, Account, Transaction, Budget, SavingsGoal, Bill, Investment, Debt
from flask.cli import FlaskGroup

app = create_app()
cli = FlaskGroup(app)

@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'User': User,
        'Account': Account,
        'Transaction': Transaction,
        'Budget': Budget,
        'SavingsGoal': SavingsGoal,
        'Bill': Bill,
        'Investment': Investment,
        'Debt': Debt
    }

@cli.command("create_db")
def create_db():
    db.create_all()
    print("Database tables created")

@cli.command("drop_db")
def drop_db():
    db.drop_all()
    print("Database tables dropped")

@cli.command("seed_db")
def seed_db():
    # Add some sample data
    user = User(username="testuser", email="test@example.com")
    user.set_password("password123")
    db.session.add(user)

    account = Account(user=user, name="Checking Account", type="Checking", balance=1000.00, currency="USD")
    db.session.add(account)

    transaction = Transaction(account=account, amount=-50.00, description="Groceries", category="Food", date=datetime.utcnow(), type="expense")
    db.session.add(transaction)

    budget = Budget(user=user, category="Food", amount=300.00, period="monthly", start_date=datetime.utcnow())
    db.session.add(budget)

    savings_goal = SavingsGoal(user=user, name="Emergency Fund", target_amount=5000.00, current_amount=1000.00)
    db.session.add(savings_goal)

    db.session.commit()
    print("Database seeded with sample data")

if __name__ == '__main__':
    cli()