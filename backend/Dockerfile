FROM python:3.12.4-slim-bullseye

RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt
COPY env/service-account-file.json /app/service-account-file.json

# Expose port 8080
EXPOSE 8080

# Run the application with gunicorn
CMD ["gunicorn", "main:app"]