
# Use an official nginx runtime as a parent image
FROM nginx:1.17.3-alpine

# copy config file
# COPY nginx.conf /etc/nginx/nginx.conf

# copy static files to /usr/share/nginx/htm
COPY dist /usr/share/nginx/html

# copy nginx mime.types  to /usr/share/nginx/htm
# COPY mime.types /etc/nginx/mime.types
COPY ["mime.types", "nginx.conf", "/etc/nginx/"]

COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

# Set the working directory to /app
# WORKDIR /app

# Copy the current directory contents into the container at /app
# ADD . /app

# Install any needed packages specified in requirements.txt
# RUN pip install -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 80

# RUN apt-get install ca-certificates
# ADD export.pem /etc/docker/certs.d/export.pem
# RUN update-ca-certificates

# Define environment variable
ENV PORT 80

# Run app.py when the container launches
# CMD ["python", "./WebApp/app.py"]
