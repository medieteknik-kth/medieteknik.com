#! bin/bash

# Create .env file in the ./backend folder
if [ ! -f backend/.env ]; then
    echo "Creating backend/.env..."
    touch backend/.env
    cat <<EOF > backend/.env
DATABASE_URL=postgres://postgres:password@medieteknik_db:5432/medieteknik
POSTGRES_DB=medieteknik
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
SECRET_KEY=secret_key
RECEPTION_MODE=0
EOF
fi

# Check for node and npm
if ! command -v node &> /dev/null
then
    echo "Node is not installed. Please install Node.js and try again."
    exit
fi

# Installing Frontend requirements
echo "Installing frontend dependencies..."
cd frontend || exit
npm install

# Check for python and pip
if ! command -v python &> /dev/null
then
    echo "Python is not installed. Please install Python and try again."
    exit
fi

if ! command -v pip &> /dev/null
then
    echo "pip is not installed. Please install pip and try again."
    exit
fi

cd ..

# Installing Backend requirements
echo "Installing backend dependencies..."
cd backend || exit
pip install -r requirements.txt

# Docker setup
echo "Checking docker status..."
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker and try again."
    exit
fi

if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker and try again."
    exit
fi

echo "Docker is running. Proceeding with initialization..."
docker-compose up -d --build || { echo "Docker-compose failed. Aborting."; exit 1; }

echo "Initialization complete."