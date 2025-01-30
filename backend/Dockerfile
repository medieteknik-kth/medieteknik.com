# Stage 1: Build stage
FROM python:3.13.1-alpine AS build

ENV PATH /opt/venv/bin:$PATH

# Install build dependencies
RUN apk add --no-cache \
    gcc \
    python3-dev \
    postgresql-dev \
    musl-dev

# Set working directory
WORKDIR /app

# Create a virtual environment
RUN python -m venv /opt/venv

# Copy the requirements file first to leverage Docker cache
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt 

# Copy the rest of the application code
COPY . .

# ----------------------------------------------

# Stage 2: Final stage
FROM python:3.13.1-alpine

# Install runtime dependencies
RUN apk add --no-cache libpq

# Set working directory
WORKDIR /app

# Copy the service account file into the container at /app
COPY env/service-account-file.json /app/service-account-file.json

# Copy only the necessary files from the build stage
COPY . .

# Copy the virtual environment from the previous stage
COPY --from=build /opt/venv /opt/venv

# Set environment variables
ENV VIRTUAL_ENV /opt/venv
ENV PATH /opt/venv/bin:$PATH

# Expose port 80
EXPOSE 80

# Run the application with gunicorn
CMD ["/opt/venv/bin/gunicorn", "main:app"]