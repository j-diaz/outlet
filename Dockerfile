FROM josediaz30/nodejs-thin

# File Author
MAINTAINER Jose Diaz

# Bundle app source
COPY . /src

# Install app dependencies
RUN cd /src; npm install

# Expose port
EXPOSE 3000

# Setting run configuration
ENV MODE=production

# Run app
CMD ["node", "/src/app.js"]
