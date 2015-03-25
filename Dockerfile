FROM node:0.12.0-wheezy
MAINTAINER Laurent Prevost <laurent.prevost@heig-vd.ch>

RUN npm install -g api-copilot-cli

# See: http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /nodejs/iflux-starter && cp -a /tmp/node_modules /nodejs/iflux-starter

ADD . /nodejs/iflux-starter

RUN useradd -m -r -U iflux \
	&& chown -R iflux:iflux /nodejs/iflux-starter \
	&& chmod +x /nodejs/iflux-starter/run.sh

USER iflux

WORKDIR /nodejs/iflux-starter

CMD ["./run.sh"]