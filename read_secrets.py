import os

def read_secret(secret_name):
    """
    Read a secret from the Docker secrets directory or fall back to an environment variable.
    
    :param secret_name: Name of the secret to read
    :return: The secret value as a string, or None if not found
    """
    try:
        with open(f'/run/secrets/{secret_name}', 'r') as secret_file:
            return secret_file.read().strip()
    except IOError:
        # If the file doesn't exist, fall back to environment variable
        return os.environ.get(secret_name.upper())

def get_secret(secret_name, default=None):
    """
    Get a secret value, falling back to a default if not found.
    
    :param secret_name: Name of the secret to read
    :param default: Default value to return if secret is not found
    :return: The secret value, the environment variable value, or the default
    """
    value = read_secret(secret_name)
    return value if value is not None else default

# Example usage of secrets
DB_PASSWORD = get_secret('db_password')
JWT_SECRET_KEY = get_secret('jwt_secret_key')
PLAID_CLIENT_ID = get_secret('plaid_client_id')
PLAID_SECRET = get_secret('plaid_secret')

# You can add more secrets as needed