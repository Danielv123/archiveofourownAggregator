FROM node:latest
RUN apt-get update && curl -sL https://deb.nodesource.com/setup_7.x | bash - && apt-get install -y git nodejs && git clone https://github.com/Danielv123/archiveofourownAggregator.git && cd nodeEpub && npm install
EXPOSE 80
WORKDIR archiveofourownAggregator
CMD ["npm", "start"]

# sudo docker build -t archiveofourownAggregator --no-cache --force-rm archiveofourownAggregator
# sudo docker run -d --name archiveofourownAggregator -p 80:80 archiveofourownAggregator
# -p outsidePort:insidePort
