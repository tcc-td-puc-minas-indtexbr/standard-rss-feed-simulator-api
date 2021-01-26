FROM node:12-alpine

MAINTAINER Anderson Contreira <anderson.contreira@gmail.com>

ARG projectName=standard-rss-feed-api
ARG projectRoot=.

RUN echo ${projectName}

WORKDIR /${projectName}

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /${projectName}/

# copy all files
ADD . /${projectName}



#RUN ls
RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]

#CMD [ 'npm' , 'start' ]
#CMD [ "node", "sucrase-node", "src/local.ts" ]