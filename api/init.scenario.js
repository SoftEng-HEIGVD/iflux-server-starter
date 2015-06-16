var
	_ = require('underscore'),
	dotenv = require('dotenv'),
	colors = require('colors'),
	copilot = require('api-copilot');

if (process.env.NODE_ENV != 'docker') {
	dotenv.load();
}

var scenario = new copilot.Scenario({
  name: 'Initialize iFLUX',
	summary: 'Do what is required to setup a full setup',
	defaultRequestOptions: {
		json: true
	}
});

scenario.addParam('iflux_api_url', {
	default: process.env.IFLUX_API_URL
});

scenario.addParam('iflux_admin_user', {
	default: process.env.IFLUX_ADMIN_USER
});

scenario.addParam('iflux_admin_password', {
	default: process.env.IFLUX_ADMIN_PASSWORD
});

scenario.addParam('slack_url', {
	default: process.env.SLACK_GATEWAY_URL
});

scenario.addParam('slack_bot_token', {
	default: process.env.SLACK_GATEWAY_IFLUX_BOT_TOKEN
});

//scenario.addParam('metrics_url', {
//	default: process.env.IFLUXMETRICS_SERVER_URL || 'http://ifluxmetrics:3002'
//});
//
//scenario.addParam('viewer_url', {
//	default: process.env.IFLUXMAPBOX_SERVER_URL || 'http://ifluxmapbox:3004'
//});
//
//scenario.addParam('enable_slack', {
//	default: process.env.ENABLE_SLACK || true
//});

//var rules = {
//	"SC-CE-AE-SLACK": {
//		description: "Send text notification to slack when action occurred.",
//		reference: "SC-CE-AE-SLACK",
//		if: {
//			eventSource: "smartCity/citizenEngagement",
//			eventType: "actionEvent"
//		},
//		then: {
//			actionTarget: "slack_url",
//			actionSchema: "{\"type\":\"sendSlackMessage\",\"properties\":{\"channel\":\"iflux\",\"message\":\"{{ properties.user }} did an action ({{ properties.type }}) on issue ({{ properties.issueId }}) {{ properties.issue }}. The reason: {{ properties.reason }}. The action was performed on {{ properties.date }}.\"}}"
//		}
//	},
//
//	"SC-CE-AE-GLOBAL-METRICS": {
//		description: "Update metrics globally on metrics action target.",
//		reference: "SC-CE-AE-GLOBAL-METRICS",
//		if: {
//			eventSource: "smartCity/citizenEngagement",
//			eventType: "actionEvent"
//		},
//		then: {
//			actionTarget: "metrics_url",
//			actionSchema: "{\"type\":\"updateMetric\",\"properties\":{\"metric\":\"ch.heigvd.ptl.sc.ce.{{properties.type}}\",\"timestamp\":\"{{timestamp}}\"}}"
//		}
//	},
//
//	"SC-CE-AE-ISSUE-METRICS": {
//		description: "Update metrics for an issue on metrics action target.",
//		reference: "SC-CE-AE-ISSUE-METRICS",
//		if: {
//			eventSource: "smartCity/citizenEngagement",
//			eventType: "actionEvent"
//		},
//		then: {
//			actionTarget: "metrics_url",
//			actionSchema: "{\"type\":\"updateMetric\",\"properties\":{\"metric\":\"ch.heigvd.ptl.sc.ce.{{properties.issueId}}.{{properties.type}}\",\"timestamp\":\"{{timestamp}}\"}}"
//		}
//	},
//
//	"SC-CE-IC-SLACK": {
//		description: "Send text notification to slack on issue creation.",
//		reference: "SC-CE-IC-SLACK",
//		if: {
//			eventSource: "smartCity/citizenEngagement",
//			eventType: "issueCreated"
//		},
//		then: {
//			actionTarget: "slack_url",
//			actionSchema: "{\"type\":\"sendSlackMessage\",\"properties\":{\"channel\":\"iflux\",\"message\":\"{{ properties.creator }} submitted an issue [{{ properties.issueId }}] on {{ properties.date }}. The issue concern: {{ properties.description }} and is situated at [lat: {{ properties.where.lat }}, lng: {{ properties.where.lng }}].\"}}"
//		}
//	},
//
//	"SC-CE-IC-METRICS": {
//		description: "Update metrics globally on issue creation.",
//		reference: "SC-CE-IC-METRICS",
//		if: {
//			eventSource: "smartCity/citizenEngagement",
//			eventType: "issueCreated"
//		},
//		then: {
//			actionTarget: "metrics_url",
//			actionSchema: "{\"type\":\"updateMetric\",\"properties\":{\"metric\":\"ch.heigvd.ptl.sc.ce.issueCreated\",\"timestamp\":\"{{timestamp}}\"}}"
//		}
//	},
//
//	"DEMO-SLACK": {
//		description: "Send notifications to slack",
//		reference: "DEMO-SLACK",
//		if: {
//			eventSource: "docker/slack",
//			eventType: "dockerEvent"
//		},
//		then: {
//			actionTarget: "slack_url",
//			actionSchema: "{\"type\":\"sendSlackMessage\",\"properties\":{\"message\":\"There we go! This is a message from the amazing Docker Infra! {{ properties.custom }}\",\"channel\":\"iflux\"}}"
//		}
//	},
//
//	"DEMO-METRICS": {
//		description: "Slack Metrics",
//		reference: "DEMO-METRICS",
//		if: {
//			eventSource: "docker/slack",
//			eventType: "dockerEvent"
//		},
//		then: {
//			actionTarget: "metrics_url",
//			actionSchema: "{\"type\":\"updateMetric\",\"properties\":{\"metric\":\"ch.heigvd.ptl.slack.messages\",\"timestamp\":\"{{ timestamp }}\"}}"
//		}
//	},
//
//	"PUBLIBIKE-SLACK": {
//		description: "Send text notification to slack to notify bikes availibilities.",
//		reference: "PUBLIBIKE-SLACK",
//		if: {
//			eventSource: "publibike/eventSource",
//			eventType: "movementEvent"
//		},
//		then: {
//			actionTarget: "slack_url",
//			actionSchema: "{\"type\":\"sendSlackMessage\",\"properties\":{\"channel\":\"iflux\",\"message\":\"Only {{ properties.new.bikes }} bike(s) available at the station {{ properties.terminal.name }}, {{ properties.terminal.street }}, {{ properties.terminal.zip }} {{ properties.terminal.city }}.\"}}"
//		}
//	},
//
//	"PUBLIBIKE-METRICS-FREEHOLDERS": {
//		description: "Update metrics for each station (free holders).",
//		reference: "PUBLIBIKE-METRICS-FREEHOLDERS",
//		if: {
//			eventSource: "publibike/eventSource",
//			eventType: "movementEvent"
//		},
//		then: {
//			actionTarget: "metrics_url",
//			actionSchema: "{\"type\":\"updateMetric\",\"properties\":{\"metric\":\"io.iflux.publibike.holders.{{ properties.terminal.terminalid }}\",\"value\":{{ properties.new.freeholders }},\"timestamp\":\"{{timestamp}}\"}}"
//		}
//	},
//
//	"PUBLIBIKE-METRICS-BIKES": {
//		description: "Update metrics for each station (bikes).",
//		reference: "PUBLIBIKE-METRICS-BIKES",
//		if: {
//			eventSource: "publibike/eventSource",
//			eventType: "movementEvent"
//		},
//		then: {
//			actionTarget: "metrics_url",
//			actionSchema: "{\"type\":\"updateMetric\",\"properties\":{\"metric\":\"io.iflux.publibike.bikes.{{ properties.terminal.terminalid }}\",\"value\":{{ properties.new.bikes }},\"timestamp\":\"{{timestamp}}\"}}"
//		}
//	},
//
//	"PUBLIBIKE-VIEWER": {
//		description: "Send data to render on the publibike map",
//		reference: "PUBLIBIKE-VIEWER",
//		if: {
//			eventSource: "publibike/eventSource",
//			eventType: "movementEvent",
//			eventProperties: {}
//		},
//		then: {
//			actionTarget: "viewer_url",
//			actionSchema: "{\"type\":\"newMarker\",\"properties\":{\"markerType\":\"publibike\",\"lat\":{{ properties.terminal.lat }},\"lng\":{{ properties.terminal.lng }},\"date\":\"{{ timestamp }}\",\"key\":\"id\",\"data\":{\"remainingBikes\":{{ properties.new.bikes }},\"id\":\"{{ properties.terminal.terminalid }}\",\"name\":\"{{ properties.terminal.name }}\",\"street\":\"{{ properties.terminal.street }}\",\"city\":\"{{ properties.terminal.city }}\",\"zip\":\"{{ properties.terminal.zip }}\"}}}"
//		}
//	},
//
//	"CITIZEN-VIEWER-NEW": {
//		description: "Send data to render on the citizen map",
//		reference: "CITIZEN-VIEWER-NEW",
//		if: {
//			eventSource: "smartCity/citizenEngagement",
//			eventType: "issueCreated",
//			eventProperties: {}
//		},
//		then: {
//			actionTarget: "viewer_url",
//			actionSchema: "{\"type\":\"newMarker\",\"properties\":{\"markerType\":\"citizen\",\"lat\":{{ properties.where.lat }},\"lng\":{{ properties.where.lng }},\"date\":\"{{ timestamp }}\",\"key\":\"id\",\"data\":{\"description\":\"{{ properties.description }}\",\"id\":\"{{ properties.issueId }}\",\"imageUrl\":\"{{ properties.imageUrl }}\",\"state\":\"{{ properties.state }}\",\"owner\":\"{{ properties.creator }}\",\"createdOn\":\"{{ properties.createdOn }}\",\"updatedOn\":\"{{ properties.updatedOn }}\",\"issueTypeCode\":\"{{ properties.issueTypeCode }}\"}}}"
//		}
//	},
//
//	"CITIZEN-VIEWER-UPDATE": {
//		description: "Send updated data to render on the citizen map",
//		reference: "CITIZEN-VIEWER-UPDATE",
//		if: {
//			eventSource: "smartCity/citizenEngagement",
//			eventType: "issueStateChanged",
//			eventProperties: {}
//		},
//		then: {
//			actionTarget: "viewer_url",
//			actionSchema: "{\"type\":\"updateMarker\",\"properties\":{\"markerType\":\"citizen\",\"lat\":{{ properties.where.lat }},\"lng\":{{ properties.where.lng }},\"date\":\"{{ timestamp }}\",\"key\":\"id\",\"data\":{\"description\":\"{{ properties.description }}\",\"id\":\"{{ properties.issueId }}\",\"imageUrl\":\"{{ properties.imageUrl }}\",\"state\":\"{{ properties.state }}\",\"owner\":\"{{ properties.creator }}\",\"createdOn\":\"{{ properties.createdOn }}\",\"updatedOn\":\"{{ properties.updatedOn }}\",\"issueTypeCode\":\"{{ properties.issueTypeCode }}\"}}}"
//		}
//	}
//
//}

var organizationId;

function Iterator(data) {
	this.data = data;
	this.start = 0;

	this.next = function() {
		if (this.start < this.data.length) {
			this.start++;
			return this.data[this.start - 1];
		}
	};

	this.hasNext = function() {
		return this.start < this.data.length;
	};
}

// ############################################################################################
// START OF DATA
// ############################################################################################

var eventSourceTemplates = new Iterator([{
	data: {
		name: 'Publibike',
		public: true
	}
}]);

var eventTypes = new Iterator([{
	template: eventSourceTemplates.data[0],
	data: {
		name: 'Publibike movement event',
		description: 'Represent a movement in the stock of bikes at any station',
		schema: {
			$schema: 'http://json-schema.org/draft-04/schema#',
	    type: 'object',
			properties: {
				terminalId: {
					type: 'string'
				},
				terminal: {
					type: 'object',
					properties: {
						name: {
							type: 'string'
						},
						infotext: {
							type: 'string'
						},
						zip: {
							type: 'string'
						},
						city: {
							type: 'string'
						},
						country: {
							type: 'string'
						},
						lat: {
							type: 'number'
						},
						lng: {
							type: 'number'
						},
						image: {
							type: 'string'
						}
					}
				},
				old: {
					type: 'object',
					properties: {
						freeholders: {
							type: 'integer'
						},
						bikes: {
							type: 'integer'
						}
					}
				},
				new: {
					type: 'object',
					properties: {
						freeholders: {
							type: 'integer'
						},
						bikes: {
							type: 'integer'
						}
					}
				}
			}
		}
	}
}]);

var eventSourceInstances = new Iterator([{
	template: eventSourceTemplates.data[0],
  data: {
	  name: 'Publibike singleton data poller'
  }
}]);

var actionTargetTemplates = new Iterator([{
	data: {
	  name: 'iFlux Slack Gateway',
	  public: true,
	  configuration: {
	    schema: {
	      $schema: 'http://json-schema.org/draft-04/schema#',
	      type: 'object',
	      properties: {
	        token: {
	          type: 'string'
	        }
	      },
	      additionalProperties: false,
	      required: [ 'token' ]
	    },
	    url: function() { return this.param('slack_url') + '/configure'; }
	  },
	  target: {
	    url: function() { return this.param('slack_url') + '/actions'; }
	  }
	}
}]);

var actionTypes = new Iterator([{
	template: actionTargetTemplates.data[0],
	data: {
	  name: 'Slack messages',
	  description: 'Send a message to slack.',
	  schema: {
	    $schema: 'http://json-schema.org/draft-04/schema#',
	    type: 'object',
	    properties: {
	      message: {
	        type: 'string'
	      }
	    }
	  }
	}
}]);

var actionTargetInstances = new Iterator([{
	template: actionTargetTemplates.data[0],
  data: {
	  name: 'iFLUX Slack Gateway Instance',
	  configuration: function() { return { token: this.param('slack_bot_token') }; }
  }
}]);

var rules = new Iterator([{
	data: {
		name: 'Publibike annoucements on Slack',
		description: 'From publibike annoucements, a message is sent to iFLUX Slack Gateway channel.',
		active: true,
		conditions: [{
			description: 'Detect bike movements',
			eventTypeId: eventTypes.data[0]
		}],
		transformations: [{
			description: 'Broadcast a message on the Slack channel',
			actionTargetInstanceId: actionTargetInstances.data[0],
			actionTypeId: actionTypes.data[0],
			eventTypeId: eventTypes.data[0],
			fn: {
				expression: "return { channel: 'iflux', message: 'Only ' + event.properties.new.bikes + ' bike(s) available at the station ' + event.properties.terminal.name + ', ' + event.properties.terminal.street + ', ' + event.properties.terminal.zip + ' ' + event.properties.terminal.city + '.' };",
				sample: {
					event: {
						terminalId: 'asdfghjkl',
						terminal: {
							name: 'Y-Parc',
							infotext: 'Parc Scientifique - Yverdon',
							zip: '1400',
							city: 'Yverdon-les-Bains',
							country: 'Switzerland',
							lat: 46.764968,
							lng: 6.646069,
							image: ''
						},
						old: {
							freeholders: 10,
							bikes: 3
						},
						new: {
							freeholders: 11,
							bikes: 2
						}
					},
					eventSourceTemplateId: eventSourceTemplates.data[0]
				}
			}
		}]
	}
}]);

// ############################################################################################
// END OF DATA
// ############################################################################################

function extractId(response) {
	var locationParts = response.headers.location.split('/');
	return parseInt(locationParts[locationParts.length - 1]);
}

function extractGenId(response) {
	return response.headers['x-iflux-generated-id'];
}

function jwtRequestFilterFactory(jwtToken) {
	return function(requestOptions) {
		requestOptions.headers = {
			'Authorization': 'bearer ' + jwtToken
		};

		// the filter function must return the updated request options
		return requestOptions;
	}
}

function signin(label) {
	return scenario
		.step(label, function() {
			return this.post({
				url:'/auth/signin',
				body: {
					email: this.param('iflux_admin_user'),
					password: this.param('iflux_admin_password')
				}
			});
		});
}

function register() {
	return scenario
		.step('register user', function() {
			return this.post({
				url: '/auth/register',
				body: {
					lastName: "Admin",
					firstName: "Admin",
					email: this.param('iflux_admin_user'),
					password: this.param('iflux_admin_password'),
					passwordConfirmation: this.param('iflux_admin_password')
				},
				expect: {
					statusCode: 201
				}
			});
		})
		.step('check registration', function() {
			return signin('second try to signing after registration')
				.step('store token', function(response) {
					this.addRequestFilter(jwtRequestFilterFactory(response.body.token));
					return findOrganization('after registration');
				});
		})
}

function findOrganization(label) {
	return scenario
		.step('try to retrieve the organization: ' + label, function() {
			return this.get({
				url: '/organizations?name=iFLUX'
			});
		})
		.step('check organization retrieved: ' + label, function(response) {
			if (response.statusCode == 200 && response.body.length == 1) {
				organizationId = response.body[0].id;
				console.log('organization found with id: %s'.green, organizationId);

				iterateEventSourceTemplates();
			}
			else {
				console.log('unable to retrieve the iFLUX organization'.yellow);
				return createOrganization();
			}
		})
}

function createOrganization() {
	return scenario
		.step('try to create organization', function() {
			return this.post({
				url: '/organizations',
				body: {
					name: 'iFLUX'
				},
				expect: {
					statusCode: 201
				}
			});
		})
		.step('check organization created', function(response) {
			organizationId = extractId(response);
			console.log('organization created with id: %s'.green, organizationId);

			return iterateEventSourceTemplates();
		});
}

function iterateEventSourceTemplates() {
	if (eventSourceTemplates.hasNext()) {
		return findEventSourceTemplate(eventSourceTemplates.next());
	}
	else {
		return iterateEventTypes();
	}
}

function findEventSourceTemplate(eventSourceTemplate) {
	return scenario
		.step('find event source template: ' + eventSourceTemplate.data.name, function() {
			return this.get({
				url: '/eventSourceTemplates?name=' + eventSourceTemplate.data.name
			});
		})
		.step('check event source template found: ' + eventSourceTemplate.data.name, function(response) {
			if (response.statusCode == 200 && response.body.length == 1) {
				eventSourceTemplate.id = response.body[0].id;
				console.log('event source template found with id: %s'.green, eventSourceTemplate.id);

				return iterateEventSourceTemplates();
			}
			else {
				console.log('event source template: %s not found.'.yellow, eventSourceTemplate.data.name);
				return createEventSourceTemplate(eventSourceTemplate);
			}
		})
}

function createEventSourceTemplate(eventSourceTemplate) {
	return scenario
		.step('try to create event source template: ' + eventSourceTemplate.data.name, function() {
			return this.post({
				url: '/eventSourceTemplates',
				body: _.extend(eventSourceTemplate.data, {
					organizationId: organizationId
				}),
				expect: {
					statusCode: 201
				}
			});
		})
		.step('check event source template created for: ' + eventSourceTemplate.data.name, function(response) {
			eventSourceTemplate.id = extractId(response);
			console.log('event source template created with id: %s'.green, eventSourceTemplate.id);

			return iterateEventSourceTemplates();
		});
}

function iterateEventTypes() {
	if (eventTypes.hasNext()) {
		return findEventType(eventTypes.next());
	}
	else {
		return iterateEventSourceInstances();
	}
}

function findEventType(eventType) {
	return scenario
		.step('find event type: ' + eventType.data.name, function() {
			return this.get({
				url: '/eventTypes?eventSourceTemplateId=' + eventType.template.id + '&name=' + eventType.data.name
			});
		})
		.step('check event type found: ' + eventType.data.name, function(response) {
			if (response.statusCode == 200 && response.body.length == 1) {
				eventType.id = response.body[0].id;
				eventType.genId = response.body[0].eventTypeId;
				console.log('event type found with id: %s'.green, eventType.id);

				return iterateEventTypes();
			}
			else {
				console.log('event type: %s not found.'.yellow, eventType.data.name);
				return createEventType(eventType);
			}
		})
}

function createEventType(eventType) {
	return scenario
		.step('try to create event type: ' + eventType.data.name, function() {
			return this.post({
				url: '/eventTypes',
				body: _.extend(eventType.data, { eventSourceTemplateId: eventType.template.id }),
				expect: {
					statusCode: 201
				}
			});
		})
		.step('check event type created for: ' + eventType.data.name, function(response) {
			eventType.id = extractId(response);
			eventType.genId = extractGenId(response);
			console.log('event type created with id: %s'.green, eventType.id);

			return iterateEventTypes();
		});
}

function iterateEventSourceInstances() {
	if (eventSourceInstances.hasNext()) {
		return findEventSourceInstance(eventSourceInstances.next());
	}
	else {
		return iterateActionTargetTemplates();
	}
}

function findEventSourceInstance(eventSourceInstance) {
	return scenario
		.step('find event source instance: ' + eventSourceInstance.data.name, function() {
			return this.get({
				url: '/eventSourceInstances?eventSourceTemplateId=' + eventSourceInstance.template.id + '&name=' + eventSourceInstance.data.name
			});
		})
		.step('check event source instance found: ' + eventSourceInstance.data.name, function(response) {
			if (response.statusCode == 200 && response.body.length == 1) {
				eventSourceInstance.id = response.body[0].id;
				eventSourceInstance.genId = response.body[0].eventSourceInstanceId;
				console.log('event source instance found with id: %s'.green, eventSourceInstance.id);

				return iterateEventSourceInstances();
			}
			else {
				console.log('event source instance: %s not found.'.yellow, eventSourceInstance.data.name);
				return createEventSourceInstance(eventSourceInstance);
			}
		})
}

function createEventSourceInstance(eventSourceInstance) {
	return scenario
		.step('try to create event source instance: ' + eventSourceInstance.data.name, function() {
			return this.post({
				url: '/eventSourceInstances',
				body: _.extend(eventSourceInstance.data, {
					organizationId: organizationId,
					eventSourceTemplateId: eventSourceInstance.template.id
				}),
				expect: {
					statusCode: 201
				}
			});
		})
		.step('check event source instance created for: ' + eventSourceInstance.data.name, function(response) {
			eventSourceInstance.id = extractId(response);
			eventSourceInstance.genId = extractGenId(response);
			console.log('event source instance created with id: %s'.green, eventSourceInstance.id);

			return iterateEventSourceInstances();
		});
}

function iterateActionTargetTemplates() {
	if (actionTargetTemplates.hasNext()) {
		return findActionTargetTemplate(actionTargetTemplates.next());
	}
	else {
		return iterateActionTypes();
	}
}

function findActionTargetTemplate(actionTargetTemplate) {
	return scenario
		.step('find action target template: ' + actionTargetTemplate.data.name, function() {
			return this.get({
				url: '/actionTargetTemplates?name=' + actionTargetTemplate.data.name
			});
		})
		.step('check action target template found: ' + actionTargetTemplate.data.name, function(response) {
			if (response.statusCode == 200 && response.body.length == 1) {
				actionTargetTemplate.id = response.body[0].id;
				console.log('action target template found with id: %s'.green, actionTargetTemplate.id);

				return iterateActionTargetTemplates();
			}
			else {
				console.log('action target template: %s not found.'.yellow, actionTargetTemplate.data.name);
				return createActionTargetTemplate(actionTargetTemplate);
			}
		})
}

function createActionTargetTemplate(actionTargetTemplate) {
	return scenario
		.step('try to create action target template: ' + actionTargetTemplate.data.name, function() {
			return this.post({
				url: '/actionTargetTemplates',
				body: _.extend(actionTargetTemplate.data, {
					organizationId: organizationId
				}),
				expect: {
					statusCode: 201
				}
			});
		})
		.step('check action target template created for: ' + actionTargetTemplate.data.name, function(response) {
			actionTargetTemplate.id = extractId(response);
			console.log('action target template created with id: %s'.green, actionTargetTemplate.id);

			return iterateActionTargetTemplates();
		});
}

function iterateActionTypes() {
	if (actionTypes.hasNext()) {
		return findActionType(actionTypes.next());
	}
	else {
		return iterateActionTargetInstances();
	}
}

function findActionType(actionType) {
	return scenario
		.step('find action type: ' + actionType.data.name, function() {
			return this.get({
				url: '/actionTypes?actionTargetTemplateId=' + actionType.template.id + '&name=' + actionType.data.name
			});
		})
		.step('check action type found: ' + actionType.data.name, function(response) {
			if (response.statusCode == 200 && response.body.length == 1) {
				actionType.id = response.body[0].id;
				actionType.genId = response.body[0].actionTypeId;
				console.log('action type found with id: %s'.green, actionType.id);

				return iterateActionTypes();
			}
			else {
				console.log('action type: %s not found.'.yellow, actionType.data.name);
				return createActionType(actionType);
			}
		})
}

function createActionType(actionType) {
	return scenario
		.step('try to create action type: ' + actionType.data.name, function() {
			return this.post({
				url: '/actionTypes',
				body: _.extend(actionType.data, { actionTargetTemplateId: actionType.template.id }),
				expect: {
					statusCode: 201
				}
			});
		})
		.step('check action type created for: ' + actionType.data.name, function(response) {
			actionType.id = extractId(response);
			actionType.genId = extractGenId(response);
			console.log('action type created with id: %s'.green, actionType.id);

			return iterateActionTypes();
		});
}

function iterateActionTargetInstances() {
	if (actionTargetInstances.hasNext()) {
		return findActionTargetInstance(actionTargetInstances.next());
	}
	else {
		return prepareRules();
	}
}

function findActionTargetInstance(actionTargetInstance) {
	return scenario
		.step('find action target instance: ' + actionTargetInstance.data.name, function() {
			return this.get({
				url: '/actionTargetInstances?actionTargetTemplateId=' + actionTargetInstance.template.id + '&name=' + actionTargetInstance.data.name
			});
		})
		.step('check action target instance found: ' + actionTargetInstance.data.name, function(response) {
			if (response.statusCode == 200 && response.body.length == 1) {
				actionTargetInstance.id = response.body[0].id;
				actionTargetInstance.genId = response.body[0].actionTargetInstanceId;
				console.log('action target instance found with id: %s'.green, actionTargetInstance.id);

				return iterateActionTargetInstances();
			}
			else {
				console.log('action target instance: %s not found.'.yellow, actionTargetInstance.data.name);
				return createActionTargetInstance(actionTargetInstance);
			}
		})
}

function createActionTargetInstance(actionTargetInstance) {
	return scenario
		.step('try to create action target instance: ' + actionTargetInstance.data.name, function() {
			return this.post({
				url: '/actionTargetInstances',
				body: _.extend(actionTargetInstance.data, {
					organizationId: organizationId,
					actionTargetTemplateId: actionTargetInstance.template.id
				}),
				expect: {
					statusCode: 201
				}
			});
		})
		.step('check action target instance created for: ' + actionTargetInstance.data.name, function(response) {
			actionTargetInstance.id = extractId(response);
			actionTargetinstance.genId = extractGenId(response);
			console.log('action target instance created with id: %s'.green, actionTargetInstance.id);

			return iterateActionTargetInstances();
		});
}

function prepareRules() {
	scenario
		.step('prepare the rules.', function() {
			_.each(rules.data, function(rule) {
				_.each(rule.data.conditions, function(condition) {
					if (condition.eventSourceInstanceId) {
						condition.eventSourceInstanceId = condition.eventSourceInstanceId.id;
					}

					if (condition.eventTypeId) {
						condition.eventTypeId = condition.eventTypeId.id;
					}
				}, this);

				_.each(rule.data.transformations, function(transformation) {
					if (transformation.actionTargetInstanceId) {
						transformation.actionTargetInstanceId = transformation.actionTargetInstanceId.id;
					}

					if (transformation.actionTypeId) {
						transformation.actionTypeId = transformation.actionTypeId.id;
					}

					if (transformation.eventTypeId) {
						transformation.eventTypeId = transformation.eventTypeId.id;
					}

					if (transformation.fn && transformation.fn.sample && transformation.fn.sample.eventSourceTemplateId) {
						transformation.fn.sample.eventSourceTemplateId = transformation.fn.sample.eventSourceTemplateId.id;
					}
				}, this);
			}, this);
		});

	return iterateRules();
}

function iterateRules() {
	if (rules.hasNext()) {
		return findRule(rules.next());
	}
	else {
		return logging();
	}
}

function findRule(rule) {
	return scenario
		.step('find rule: ' + rule.data.name, function() {
			return this.get({
				url: '/rules?name=' + rule.data.name
			});
		})
		.step('check rule found: ' + rule.data.name, function(response) {
			if (response.statusCode == 200 && response.body.length == 1) {
				rule.id = response.body[0].id;
				console.log('rule found with id: %s'.green, rule.id);

				return iterateRules();
			}
			else {
				console.log('rule: %s not found.'.yellow, rule.data.name);
				return createRule(rule);
			}
		})
}

function createRule(rule) {
	return scenario
		.step('try to create rule: ' + rule.data.name, function() {
			return this.post({
				url: '/rules',
				body: _.extend(rule.data, {
					organizationId: organizationId
				//}),
				//expect: {
				//	statusCode: 201
				})
			});
		})
		.step('check rule created for: ' + rule.data.name, function(response) {
			rule.id = extractId(response);
			console.log('rule created with id: %s'.green, rule.id);

			return iterateRules();
		});
}

function logging() {
	return scenario
		.step('logging', function() {
			console.log('event source templates');
			console.log(eventSourceTemplates);
			console.log('------------------------');

			console.log('event types');
			console.log(eventTypes);
			console.log('------------------------');

			console.log('event source instances');
			console.log(eventSourceInstances);
			console.log('------------------------');

			console.log('action target templates');
			console.log(actionTargetTemplates);
			console.log('------------------------');

			console.log('action types');
			console.log(actionTypes);
			console.log('------------------------');

			console.log('action target instances');
			console.log(actionTargetInstances);
			console.log('------------------------');

			console.log('rules');
			console.log(rules);
			console.log('------------------------');
		});
}

scenario
	.step('configure base URL', function() {
		return this.configure({
			baseUrl: this.param('iflux_api_url')
		});
	})

	.step('make sure all the data are well prepared.', function() {
		_.each(eventSourceTemplates.data, function(eventSourceTemplate) {
			if (eventSourceTemplate.data.configuration && _.isFunction(eventSourceTemplate.data.configuration.url)) {
				eventSourceTemplate.data.configuration.url = _.bind(eventSourceTemplate.data.configuration.url, this)();
			}
		}, this);

		_.each(actionTargetTemplates.data, function(actionTargetTemplate) {
			if (actionTargetTemplate.data.configuration && _.isFunction(actionTargetTemplate.data.configuration.url)) {
				actionTargetTemplate.data.configuration.url = _.bind(actionTargetTemplate.data.configuration.url, this)();
			}

			if (_.isFunction(actionTargetTemplate.data.target.url)) {
				actionTargetTemplate.data.target.url = _.bind(actionTargetTemplate.data.target.url, this)();
			}
		}, this);

		_.each(actionTargetInstances.data, function(actionTargetInstance) {
			if (actionTargetInstance.data.configuration && _.isFunction(actionTargetInstance.data.configuration)) {
				actionTargetInstance.data.configuration = _.bind(actionTargetInstance.data.configuration, this)();
			}

			console.log(actionTargetInstance);
		}, this);
	})
;

signin('first try to signing')
	.step('check authentication done', function(response) {
		if (response.statusCode == 401) {
			return register();
		}
		else {
			this.addRequestFilter(jwtRequestFilterFactory(response.body.token));
			return findOrganization('after first attempt to signin');
		}
	});





//_.each(rules, function(rule, ref) {
//	scenario.step('retrieve rule: ' + ref, function() {
//		return this.get({
//			url: '/v1/rules',
//			qs: {
//				reference: ref
//			}
//		});
//	});
//
//	scenario.step('configure rule: ' + ref, function(response) {
//		var retrievedRules = response.body;
//
//		var rule = rules[ref];
//
//		rule.then.actionTarget = this.param(rule.then.actionTarget);
//
//		console.log("New action target: %s", rule.then.actionTarget);
//
//		var enabled = true;
//
//		if (ref.indexOf('SLACK') > -1) {
//			enabled = this.param('enable_slack');
//		}
//
//		if (retrievedRules.length == 1) {
//			return this.patch({
//				url: '/v1/rules/' + retrievedRules[0].id,
//				body: {
//					enabled: enabled,
//					then: {
//						actionTarget: rule.then.actionTarget,
//						actionSchema: rule.then.actionSchema
//					}
//				}
//			});
//		}
//		else if (retrievedRules.length == 0) {
//			rule.enabled = enabled;
//
//			return this.post({
//				url: '/v1/rules',
//				body: rule
//			});
//		}
//		else {
//			throw new Error('More than one rule exist for rule: ' + ref);
//		}
//	});
//});

module.exports = scenario;