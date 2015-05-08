# Outlet
A simple blogging application written in Node.js/Express.js

This is a node.js  blogging web application. It is the source code for [DuckTapedIO's Blog](http://blog.ducktaped.io) 
my personal website's blog.

It supports easy article submission and user login via application UI. Articles are persisted using MongoDB.  

Interested in deploying your own blog?
Read the Usage section

## Usage

### Local Deployment

#### Requirements
  - Node.js version: 0.10.35 or above
  - MongoDB version: 2.4 or above

#### Steps
  1. Fork or Download the code
  2. Run npm install
  3. Run node app.js

  After completing the above visit your [http://localhost:3000/](http://localhost:3000/)
  
### Docker Container Deployment
For conveniently deploying as a docker container an automation script is provided. By default
the script provides sane assumptions about your docker environment. Additionally, it assumes you already have a mongodb container 
running mapped to the Host's 27017 port. Please review the content of the script before executing.

#### Steps
  1. Fork or Download the code 
  2. Review/Customize ```shell deploy-dockerc.sh``` to your needs  
  3. Run ```shell deploy-dockerc.sh``` shell script
  
  After completing the above visit your custom http://your-host:port
===
Enjoy!
