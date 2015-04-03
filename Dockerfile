FROM ubuntu

# File Author
MAINTAINER Jose

#install dependencies
RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup | sudo bash -
RUN apt-get -y install python build-essential

# Install nodejs
RUN apt-get -y install nodejs

RUN node -v
RUN npm -v

WORKDIR /root/node-app

# Bundle app source
COPY . /src

# Install app dependencies
RUN cd /src; npm install

# Expose port
EXPOSE 3000

# Run app
CMD ["node", "/src/app.js"]
