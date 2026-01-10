import pytest
from app import app, db

@pytest.fixture
def client():
    # Configure the app for testing
    app.config['TESTING'] = True
    
    with app.test_client() as client:
        with app.app_context():
            # Create tables in the test database
            db.create_all()
        yield client
        with app.app_context():
            # Clean up after tests
            db.drop_all()

def test_health_endpoint(client):
    """Test the /health endpoint returns 200 OK."""
    response = client.get('/health')
    assert response.status_code == 200
    assert response.get_json() == {"status": "ok"}

def test_create_item(client):
    """Test creating an item in the MySQL/Test database."""
    item_data = {"name": "Test Item", "description": "DevOps Test"}
    response = client.post('/items', json=item_data)
    
    assert response.status_code == 201
    data = response.get_json()
    assert data["name"] == "Test Item"
    assert "id" in data