# iflux-server-starter

> [API Copilot](https://github.com/lotaris/api-copilot) script to populate the rules on iFLUX server for a demo setup.

## Introduction

This project is used to setup the iFLUX system in a demo mode. In this mode, several components are supposed to be up and running like [Citizen Engagement](https://github.com/SoftEng-HEIGVD/Teaching-HEIGVD-CM_WEBS-2015-Labo-Express-Impl), [Metrics Action Target](https://github.com/SoftEng-HEIGVD/iflux-metrics-action-target), [Slack Gateway](https://github.com/SoftEng-HEIGVD/iflux-api-gateway-node), [ViewBox](https://github.com/SoftEng-HEIGVD/iflux-mapbox-viewer). Refers to each repo for the development setup and finally to the [iFLUX Docker](https://github.com/SoftEng-HEIGVD/iflux-docker) to have a full setup
through `Docker` and `Docker Compose`.

## Development setup

Create a `.env` file in the root directory of the project and put the following content:

```bash
################
# iFLUX related
################
COMMON_IFLUX_API_URL=http://localhost:3000/v1

# Base data for iFLUX setup
IFLUX_ADMIN_USER=admin@iflux.io
IFLUX_ADMIN_PASSWORD=password

IFLUX_SCHEMAS_URL=http://localhost:3000/schemas

##################
# Citizen related
##################
CITIZEN_URL=http://localhost:3003

##################
# Metrics related
##################
METRICS_URL=http://localhost:3002

################
# Paleo Related
################
PALEO_URL=http://localhost:3008

################
# Slack Related
################
SLACK_GATEWAY_URL=http://localhost:3001

# Token to configure the iFLUX Slack Gateway
SLACK_GATEWAY_IFLUX_BOT_TOKEN=<token>

##################
# Viewbox related
##################
VIEWBOX_URL=http://localhost:3004
```

### Mandatory

| Name                          | Description                               |
| ----------------------------- | ----------------------------------------- |
| COMMON_IFLUX_API_URL          | Should be the URL to post events on iFLUX. |
| IFLUX_ADMIN_USER              | To define the admin user name. |
| IFLUX_ADMIN_PASSWORD          | To define the admin password. |
| IFLUX_SCHEMAS_URL             | To define the base path for the event and action types. Take care the action and event types must be the same than the one configured in each project (citizen, metrics, slack and viewbox). |
| CITIZEN_URL                   | The URL to contact the Citizen Engagement event source. |
| METRICS_URL                   | The URL to contact the Metrics action target. |
| PALEO_URL                     | The URL to contact the paleo action target. |
| SLACK_GATEWAY_URL             | The URL to contact Slack action target. |
| SLACK_GATEWAY_iFLUX_BOT_TOKEN | The iFLUX Bot Token that is used to connect to Slack. |
| VIEWBOX_URL                   | The URL to contact ViewBox action target. |
