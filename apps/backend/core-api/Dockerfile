# Stage 1: Build stage
FROM ghcr.io/astral-sh/uv:python3.13-alpine@sha256:1532f083c2d2b709373725897a7abdff4d4db9aef165ebda45078240e6a52d8f AS build

ENV PATH=/opt/venv/bin:$PATH

# Install build dependencies
RUN apk add --no-cache \
    gcc \
    python3-dev \
    postgresql-dev \
    musl-dev

# Set working directory
WORKDIR /app

# Create a virtual environment
RUN uv venv /opt/venv

# Copy the requirements file first to leverage Docker cache
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN uv pip install -r requirements.txt

# Install additional dependencies
RUN uv pip install python-minifier

# Copy the rest of the application code
COPY . .

# Minify the Python files in the app directory, can also use "--remove-literal-statements" to remove string literals
# RUN find . -name "*.py" -exec sh -c 'pyminify "$1" > "$1.tmp" && mv "$1.tmp" "$1"' _ {} \;

# Remove unnecessary files
RUN rm -rf .gitignore requirements.txt package.json init.sql .vscode .turbo .mypy_cache .docker __pycache__

# Remove additional dependencies
RUN uv pip uninstall python-minifier

# ----------------------------------------------

# Stage 2: Final stage
FROM python:alpine@sha256:b4d299311845147e7e47c970566906caf8378a1f04e5d3de65b5f2e834f8e3bf

# Install runtime dependencies
RUN apk add --no-cache libpq

# Set working directory
WORKDIR /app

# Copy the service account file into the container at /app
COPY env/service-account-file.json /app/service-account-file.json

# Copy only the necessary files from the build stage
COPY --from=build /app /app

# Copy the virtual environment from the previous stage
COPY --from=build /opt/venv /opt/venv

# Set environment variables
ENV VIRTUAL_ENV=/opt/venv
ENV PATH=/opt/venv/bin:$PATH

# Expose port 80
EXPOSE 80

# Run the application with gunicorn
CMD ["/opt/venv/bin/gunicorn", "--access-logfile", "-", "--error-logfile", "-", "main:app"]	