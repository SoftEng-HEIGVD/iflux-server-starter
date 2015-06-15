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

//scenario.addParam('slack_url', {
//	default: process.env.IFLUXSLACK_SERVER_URL || 'http://ifluxslack:3001'
//});
//
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

scenario.step('parameters', function() {
	console.log("iFLUX API URL: %s", this.param('iflux_api_url'));
	//console.log("Slack URL: %s", this.param('slack_url'));
	//console.log("Metrics URL: %s", this.param('metrics_url'));
	//console.log("Viewer URL: %s", this.param('viewer_url'));
	//console.log("Slack is enabled: %s", this.param('enable_slack'));
});

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
				terminal: {
					type: 'string'
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

function extractId(response) {
	var locationParts = response.headers.location.split('/');
	return parseInt(locationParts[locationParts.length - 1]);
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

			iterateEventSourceTemplates();
		});
}

function iterateEventSourceTemplates() {
	if (eventSourceTemplates.hasNext()) {
		return findEventSourceTemplate(eventSourceTemplates.next());
	}
	else {
		iterateEventTypes();
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
				body: _.extend(eventSourceTemplate,data, {
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
		iterateEventSourceInstances();
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
			console.log('event type created with id: %s'.green, eventType.id);

			return iterateEventTypes();
		});
}

function iterateEventSourceInstances() {
	if (eventSourceInstances.hasNext()) {
		return findEventSourceInstance(eventSourceInstances.next());
	}
	else {
		// TODO: Create next relevant objects
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
			console.log('event source instance created with id: %s'.green, eventSourceInstance.id);

			return iterateEventSourceInstances();
		});
}

scenario
	.step('configure base URL', function() {
		return this.configure({
			baseUrl: this.param('iflux_api_url')
		});
	});

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