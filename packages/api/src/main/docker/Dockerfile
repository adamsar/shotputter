FROM node:12-alpine

COPY "./shotput-server.js" "/opt/app/shotput-server.js"

EXPOSE 3000

ENTRYPOINT ["node", "/opt/app/shotput-server.js"]
CMD ['--help']
