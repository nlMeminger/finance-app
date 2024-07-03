import os
from app import create_app, celery

os.environ.setdefault('FLASK_APP', 'app')
os.environ.setdefault('FLASK_ENV', 'development')

app = create_app()
app.app_context().push()