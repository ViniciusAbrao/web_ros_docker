# How to create the docker image: docker build -t my_nginx:v0 .

# Let's use "ubuntu:20.04" as the base of our image
FROM ubuntu:20.04

# Exporting a variable to install pkgs without any interactive questions
ENV DEBIAN_FRONTEND=noninteractive

# Installing nginx
RUN apt-get update \
    && apt-get install -y nginx  \
    && rm -rf /var/lib/apt/lists/*

# Copying the local entrypoint.sh file to /entrypoint.sh in the docker image
COPY ./entrypoint.sh /entrypoint.sh

# Copying the local my_webpage to /var/www/html in the docker image
COPY ./my_webpage /var/www/html

# /bin/bash is the command we want to execute when running a docker container
ENTRYPOINT ["/bin/bash"]

# We want /bin/bash to execute our /entrypoint.sh when container starts
CMD ["/entrypoint.sh"]