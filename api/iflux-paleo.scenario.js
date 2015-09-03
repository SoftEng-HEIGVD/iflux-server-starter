var
	dotenv = require('dotenv'),
	Runner = require('iflux-populator').Runner;

var runner = new Runner({
  name: 'Initialize iFLUX',
	summary: 'Do what is required to setup a full setup',
	defaultRequestOptions: {
		json: true
	}
});

if (process.env.NODE_ENV != 'docker') {
	dotenv.load();
}

// ############################################################################################
// START OF PARAMETERS
// ############################################################################################
runner.addParams({
	iflux_api_url: { default: process.env.COMMON_IFLUX_API_URL },
	iflux_schemas_url: { default: process.env.IFLUX_SCHEMAS_URL },
	iflux_admin_user: { default: process.env.IFLUX_ADMIN_USER },
	iflux_admin_password: { default: process.env.IFLUX_ADMIN_PASSWORD },
	paleo_url: { default: process.env.PALEO_URL }
});
// ############################################################################################
// END OF PARAMETERS
// ############################################################################################

// ############################################################################################
// START OF DATA
// ############################################################################################

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
// EVENT SOURCE TEMPLATES
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
var eventSourceTemplates = {
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
// EVENT TYPES
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
var eventTypes = {
	/////////////////////////////////////////////////////////
	// Paleo update event type
	/////////////////////////////////////////////////////////
	paleoUpdate: {
		searchOnly: true,
		data: {
			name: 'Paleo/update'
		}
	}
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
// EVENT SOURCES
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
var eventSources = {
	/////////////////////////////////////////////////////////
	// Paleo car entry detector
	/////////////////////////////////////////////////////////
	paleoCarEntryDetector: {
		searchOnly: true,
		data: {
			name: 'paleoCarEntryDetector'
		}
	},

	/////////////////////////////////////////////////////////
	// Paleo car exit detector
	/////////////////////////////////////////////////////////
	paleoCarExitDetector: {
		searchOnly: true,
		data: {
			name: 'paleoCarExitDetector'
		}
	}
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
// ACTION TARGET TEMPLATES
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
var actionTargetTemplates = {
	/////////////////////////////////////////////////////////
	// Paleo metrics action target template
	/////////////////////////////////////////////////////////
	paleoMetrics: {
		data: {
		  name: 'iFLUX Paleo Metrics and Viewer',
		  public: true,
		  target: {
		    url: function() { return this.param('paleo_url') + '/actions'; }
		  }
		}
	}
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
// ACTION TYPES
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
var actionTypes = {
	/////////////////////////////////////////////////////////
	// Paleo metrics update action type
	/////////////////////////////////////////////////////////
	paleoCarIn: {
		data: {
			name: 'Paleo metric update (car in)',
			description: 'Paleo update metrics when a car enters the parking.',
			public: true,
			type: function () {
				return this.param('iflux_schemas_url') + '/actionTypes/carIn';
			},
			schema: {
				$schema: 'http://json-schema.org/draft-04/schema#',
				type: 'object',
				properties: {
					location: {
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
	},

	paleoCarOut: {
		data: {
			name: 'Paleo metric update (car out)',
			description: 'Paleo update metrics when a car exit the parking.',
			public: true,
			type: function () {
				return this.param('iflux_schemas_url') + '/actionTypes/carOut';
			},
			schema: {
				$schema: 'http://json-schema.org/draft-04/schema#',
				type: 'object',
				properties: {
					location: {
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
	}
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
// ACTION TARGETS
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
var actionTargets = {
	/////////////////////////////////////////////////////////
	// Paleor metrics action target
	/////////////////////////////////////////////////////////
	ifluxPaleoMetrics: {
		template: actionTargetTemplates.paleoMetrics,
	  data: {
		  name: 'iFLUX Paleo Metrics Instance'
	  }
	}
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
// RULES
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
var rules = {
	/////////////////////////////////////////////////////////
	// Paleo car in rule
	/////////////////////////////////////////////////////////
	paleoCarIn: {
		data: {
			name: 'Paleo Car In',
			description: 'Detects any cars entering the parking.',
			active: true,
			conditions: [{
				description: 'Detection done from source and type.',
				eventSourceId: eventSources.paleoCarEntryDetector,
				eventTypeId: eventTypes.paleoUpdate
			}],
			transformations: [{
				description: 'Update the metrics ',
				actionTargetId: actionTargets.ifluxPaleoMetrics,
				actionTypeId: actionTypes.paleoCarIn,
				fn: {
					expression: "return { location: event.properties.location, timestamp: event.timestamp };",
					sample: {
						event: {
							location: 'westEntry'
						},
						eventSourceId: eventSources.paleoCarEntryDetector
					}
				}
			}]
		}
	},

	/////////////////////////////////////////////////////////
	// Paleo car out rule
	/////////////////////////////////////////////////////////
	paleoCarOut: {
		data: {
			name: 'Paleo Car Out',
			description: 'Detects any cars exiting the parking.',
			active: true,
			conditions: [{
				description: 'Detection done from source and type.',
				eventSourceId: eventSources.paleoCarExitDetector,
			}],
			transformations: [{
				description: 'Update the metrics ',
				actionTargetId: actionTargets.ifluxPaleoMetrics,
				actionTypeId: actionTypes.paleoCarOut,
				eventTypeId: eventTypes.paleoUpdate,
				fn: {
					expression: "return { location: event.properties.location, timestamp: event.timestamp };",
					sample: {
						event: {
							location: 'westEntry'
						},
						eventSourceId: eventSources.paleoCarExitDetector
					}
				}
			}]
		}
	}

};

// ############################################################################################
// END OF DATA
// ############################################################################################

// ############################################################################################
// SETUP DATA IN THE RUNNER
// ############################################################################################

runner.addActionTargetTemplates(actionTargetTemplates);
runner.addActionTypes(actionTypes);
runner.addActionTargets(actionTargets);
runner.addEventSourceTemplates(eventSourceTemplates);
runner.addEventTypes(eventTypes);
runner.addEventSources(eventSources);
runner.addRules(rules);

module.exports = runner.run({
	baseUrlParam: 'iflux_api_url',
	userParam: 'iflux_admin_user',
	passwordParam: 'iflux_admin_password',
	orgaName: 'iFLUX'
});