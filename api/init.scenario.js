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
	default: process.env.COMMON_IFLUX_API_URL
});

scenario.addParam('iflux_schemas_url', {
	default: process.env.IFLUX_SCHEMAS_URL
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

scenario.addParam('viewbox_url', {
	default: process.env.VIEWBOX_URL
});

scenario.addParam('metrics_url', {
	default: process.env.METRICS_URL
});




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
		type: function() { return this.param('iflux_schemas_url') + '/eventTypes/publibikeMovement'; },
		schema: {
			$schema: 'http://json-schema.org/draft-04/schema#',
	    type: 'object',
			properties: {
				terminalid: {
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
	  name: 'iFLUX Slack Gateway',
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
}, {
	data: {
	  name: 'iFLUX ViewBox',
	  public: true,
	  configuration: {
	    schema: {
	      $schema: 'http://json-schema.org/draft-04/schema#',
	      type: 'object',
	      properties: {
	        mapName: {
	          type: 'string'
	        },
		      expiration: {
			      type: 'integer'
		      },
		      mapConfig: {
			      type: 'object',
			      properties: {
				      centerLat: {
					      type: 'number'
				      },
				      centerLng: {
					      type: 'number'
				      },
				      initialZoom: {
					      type: 'integer'
				      },
				      legendType: {
					      type: 'string'
				      }
			      },
			      required: [ 'centerLat', 'centerLng', 'initialZoom', 'legendType' ]
		      }
	      },
	      additionalProperties: false,
	      required: [ 'mapName', 'mapConfig' ]
	    },
	    url: function() { return this.param('viewbox_url') + '/configure'; }
	  },
	  target: {
	    url: function() { return this.param('viewbox_url') + '/actions'; }
	  }
	}
}, {
	data: {
	  name: 'iFLUX Metrics',
	  public: true,
	  target: {
	    url: function() { return this.param('metrics_url') + '/actions'; }
	  }
	}
}]);

var actionTypes = new Iterator([{
	template: actionTargetTemplates.data[0],
	data: {
	  name: 'Slack messages',
	  description: 'Send a message to slack.',
		type: function() { return this.param('iflux_schemas_url') + '/actionTypes/slackMessageSending'; },
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
}, {
	template: actionTargetTemplates.data[1],
	data: {
	  name: 'View marker',
	  description: 'Add or update a view marker.',
		type: function() { return this.param('iflux_schemas_url') + '/actionTypes/viewMarker'; },
	  schema: {
	    $schema: 'http://json-schema.org/draft-04/schema#',
	    type: 'object',
	    properties: {
		    markerId: {
			    type: 'string'
		    },
	      lat: {
	        type: 'number'
	      },
		    lng: {
			    type: 'number'
		    },
		    date: {
			    type: 'date'
		    },
		    data: {
			    type: 'object',
					oneOf: [{
						$ref: "#/definitions/bike"
					}]
		    }
		  },
		  required: [ 'markerId', 'lat', 'lng', 'date', 'data' ],
		  additionalProperties: false,
	    definitions: {
		    bike: {
			    properties: {
				    type: {
					    enum: ['bike']
				    },
				    terminalId: {
					    type: 'string'
				    },
				    name: {
					    type: 'string'
				    },
				    street: {
					    type: 'string'
				    },
				    city: {
					    type: 'string'
				    },
				    zip: {
					    type: 'string'
				    },
				    freeholders: {
					    type: 'integer'
				    },
				    bikes: {
					    type: 'integer'
				    }
			    },
			    required: [ 'type', 'terminalId', 'name', 'street', 'city', 'zip', 'freeholders', 'bikes' ],
			    additionalProperties: false
		    }
	    }
	  }
	}
}, {
	template: actionTargetTemplates.data[2],
	data: {
	  name: 'Metric update',
	  description: 'Update metrics.',
		type: function() { return this.param('iflux_schemas_url') + '/actionTypes/updateMetric'; },
	  schema: {
	    $schema: 'http://json-schema.org/draft-04/schema#',
	    type: 'object',
	    properties: {
	      metric: {
	        type: 'string'
	      },
		    value: {
			    type: 'number'
		    },
		    timestamp: {
			    type: 'date'
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
}, {
	template: actionTargetTemplates.data[1],
  data: {
	  name: 'iFLUX ViewBox Publibike Instance',
	  configuration: {
		  mapName: 'Publibike visualization',
		  expiration: 24 * 60 * 60 * 1000,
		  mapConfig: {
			  centerLat: 46.801111,
			  centerLng: 8.226667,
			  initialZoom: 9,
			  legendType: 'bike'
		  }
	  }
  }
}, {
	template: actionTargetTemplates.data[2],
  data: {
	  name: 'iFLUX Metrics Instance'
  }
}]);

var rules = new Iterator([{
	data: {
		name: 'Publibike movements',
		description: 'Broadcast publibike movements.',
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
						terminalid: 'asdfghjkl',
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
		}, {
			description: 'Notify a change in station to allow a visualization.',
			actionTargetInstanceId: actionTargetInstances.data[1],
			actionTypeId: actionTypes.data[1],
			eventTypeId: eventTypes.data[0],
			fn: {
				expression: "return { markerId: event.properties.terminal.terminalid, lat: event.properties.terminal.lat, lng: event.properties.terminal.lng, date: event.timestamp, data: { type: 'bike', name: event.properties.terminal.name, street: event.properties.terminal.street, city: event.properties.terminal.street, zip: event.properties.terminal.zip, freeholders: event.properties.new.freeholders, bikes: event.properties.new.bikes }};",
				sample: {
					event: {
						terminalid: 'asdfghjkl',
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
		}, {
			description: 'Update free holders metric for each station.',
			actionTargetInstanceId: actionTargetInstances.data[2],
			actionTypeId: actionTypes.data[2],
			eventTypeId: eventTypes.data[0],
			fn: {
				expression: "return { metric: 'io.iflux.publibike.holders.' + event.properties.terminal.terminalid, value: event.properties.new.freeholders, timestamp: event.timestamp };",
				sample: {
					event: {
						terminalid: 'asdfghjkl',
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
		}, {
			description: 'Update bikes metric for each station.',
			actionTargetInstanceId: actionTargetInstances.data[2],
			actionTypeId: actionTypes.data[2],
			eventTypeId: eventTypes.data[0],
			fn: {
				expression: "return { metric: 'io.iflux.publibike.bikes.' + event.properties.terminal.terminalid, value: event.properties.new.bikes, timestamp: event.timestamp };",
				sample: {
					event: {
						terminalid: 'asdfghjkl',
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

var Manager = function(iterator, itemName, itemPath, options) {
	var manager = this;

	this.iterator = iterator;
	this.itemName = itemName;
	this.itemPath = itemPath;

	if (options) {
		if (options.next) {
			this.next = options.next;
		}

		if (options.extend) {
			this.extend = options.extend;
		}

		if (options.getUrl) {
			this.getUrl = options.getUrl;
		}
	}

	this.iterate = function() {
		if (manager.iterator.hasNext()) {
			return manager.find(manager.iterator.next());
		}
		else {
			//return iterateActionTypes();
			if (manager.next) {
				if (_.isFunction(manager.next)) {
					return manager.next();
				}
				else {
					return manager.next.iterate();
				}
			}
		}
	};

	this.find = function(item, retry) {
		var retryText = retry ? 'retry: ' : '';

		return scenario
			.step(retryText + 'find ' + manager.itemName + ': ' + item.data.name, function () {
				var baseGetUrl = '/' + manager.itemPath + '?name=' + item.data.name;
				return this.get({
					url: manager.getUrl ? manager.getUrl(item, baseGetUrl) : baseGetUrl
				});
			})
			.step(retryText + 'check ' + manager.itemName + ' found: ' + item.data.name, function (response) {
				if (response.statusCode == 200 && response.body.length == 1) {
					item.id = response.body[0].id;
					console.log('%s found with id: %s'.green, manager.itemName, item.id);

					return manager.update(item);
				}
				else {
					console.log('%s: %s not found.'.yellow, manager.itemName, item.data.name);
					return manager.create(item);
				}
			})
	};

	this.create = function(item) {
		return scenario
			.step('try to create ' + manager.itemName + ': ' + item.data.name, function () {
				var data = manager.extend ? manager.extend(item) : item.data;

				return this.post({
					url: '/' + manager.itemPath,
					body: data,
				});
			})
			.step('check ' + manager.itemName + ' created for: ' + item.data.name, function (response) {
				if (response.statusCode == 201) {
					item.id = extractId(response);
					console.log('%s created with id: %s'.green, manager.itemName, item.id);
					return manager.iterate();
				}

				else if (response.statusCode == 500 && response.body.message && response.body.message == 'Unable to configure the remote action target.') {
					console.log('An error has occured in the creation of %s'.yellow, item.data.name);
					console.log('%s'.yellow, response.body.message);
					console.log('The iFLUX system may not behave as you expected.');
					return manager.find(item, true);
				}

				else {
					console.log('An error has occured in the creation of %s'.red, item.data.name);
					console.log(item.data);
					console.log(response.body);
				}
			});
		};

	this.update = function(item) {
		return scenario
			.step('try to update ' + manager.itemName + ': ' + item.data.name, function() {
				return this.patch({
					url: '/' + manager.itemPath + '/' + item.id,
					body: manager.extend ? manager.extend(item) : item.data
				});
			})
			.step('check ' + manager.itemName + ' updated for: ' + item.data.name, function(response) {
				if (response.statusCode == 201) {
					console.log('%s %s updated.'.green, manager.itemName, item.data.name);
				}

				else if (response.statusCode == 304) {
					console.log('nothing updated on %s %s'.yellow, manager.itemName, item.data.name);
				}

				else if (response.statusCode == 500 && response.body.message && response.body.message == 'Unable to configure the remote action target.') {
					console.log('An error has occured in the creation of %s'.yellow, item.data.name);
					console.log('%s'.yellow, response.body.message);
					console.log('The iFLUX system may not behave as you expected.');
					return manager.find(item, true);
				}

				else {
					console.log('There is an error: %s'.red, response.statusCode);
					console.log(response.body);
				}

				return manager.iterate();
			});
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

				eventSourceTemplateManager.iterate();
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

			return eventSourceTemplateManager.iterate();
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

	//return iterateRules();
	return ruleManager.iterate();
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

var ruleManager = new Manager(rules, 'rule', 'rules', { next: logging, extend: function(item) { return _.extend(item.data, { organizationId: organizationId }); }});

var actionTargetInstanceManager = new Manager(actionTargetInstances, 'action target instance', 'actionTargetInstances', {
	next: prepareRules,
	getUrl: function(item, baseGetUrl) {
		return baseGetUrl + '&actionTargetTemplateId=' + item.template.id
	},
	extend: function(item) {
		return _.extend(item.data, {
			organizationId: organizationId,
			actionTargetTemplateId: item.template.id
		});
	}
});

var actionTypeManager = new Manager(actionTypes, 'action type', 'actionTypes', {
	next: actionTargetInstanceManager,
	getUrl: function(item, baseGetUrl) {
		return baseGetUrl + '&actionTargetTemplateId=' + item.template.id
	},
	extend: function(item) {
		return _.extend(item.data, {
			actionTargetTemplateId: item.template.id
		});
	}
});

var actionTargetTemplateManager = new Manager(actionTargetTemplates, 'action target template', 'actionTargetTemplates', {
	next: actionTypeManager,
	extend: function(item) {
		return _.extend(item.data, {
			organizationId: organizationId,
		});
	}
});

var eventSourceInstanceManager = new Manager(eventSourceInstances, 'event source instance', 'eventSourceInstances', {
	next: actionTargetTemplateManager,
	getUrl: function(item, baseGetUrl) {
		return baseGetUrl + '&eventSourceTemplateId=' + item.template.id
	},
	extend: function(item) {
		return _.extend(item.data, {
			organizationId: organizationId,
			eventSourceTemplateId: item.template.id
		});
	}
});

var eventTypeManager = new Manager(eventTypes, 'event type', 'eventTypes', {
	next: eventSourceInstanceManager,
	getUrl: function(item, baseGetUrl) {
		return baseGetUrl + '&eventSourceTemplateId=' + item.template.id
	},
	extend: function(item) {
		return _.extend(item.data, {
			eventSourceTemplateId: item.template.id
		});
	}
});

var eventSourceTemplateManager = new Manager(eventSourceTemplates, 'event source template', 'eventSourceTemplates', {
	next: eventTypeManager,
	extend: function(item) {
		return _.extend(item.data, {
			organizationId: organizationId,
		});
	}
});

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

		_.each(eventTypes.data, function(eventType) {
			eventType.data.type = _.bind(eventType.data.type, this)();
		}, this)

		_.each(actionTypes.data, function(actionType) {
			actionType.data.type = _.bind(actionType.data.type, this)();
		}, this)

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

module.exports = scenario;