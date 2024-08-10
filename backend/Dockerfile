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
COPY env/service-account-file.json /app/service-account-file.json

# Set up the relevant environment variable
ENV GOOGLE_APPLICATION_CREDENTIALS="/app/service-account-file.json"

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Expose port 8000
EXPOSE 8000

# Run the application with gunicorn
CMD ["gunicorn", "main:app"]