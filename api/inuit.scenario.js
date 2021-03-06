var
	dotenv = require('dotenv'),
	Runner = require('iflux-populator').Runner;

var runner = new Runner({
  name: 'Initialize iFLUX for iNUIT',
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
	iflux_admin_user: { default: process.env.IFLUX_ADMIN_USER },
	iflux_admin_password: { default: process.env.IFLUX_ADMIN_PASSWORD }
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
	/////////////////////////////////////////////////////////
	// Interfaces
	/////////////////////////////////////////////////////////
	interfaces: {
		data: {
			name: 'Interfaces',
				public: true
		}
	}
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
// EVENT TYPES
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
var eventTypes = {
	/////////////////////////////////////////////////////////
	// Interface Sensor event type
	/////////////////////////////////////////////////////////
	interfacesSensor: {
		data: {
			name: 'Interfaces Sensor',
			description: 'A sensor in the INUIT project',
			public: true,
			type: 'http://inuit.iict.ch/1/sensor'
		}
	},

	/////////////////////////////////////////////////////////
	// Interface Sensor Data event type
	/////////////////////////////////////////////////////////
	interfacesSensorData: {
		data: {
			name: 'Interfaces Sensor Data',
			description: 'Data produced by sensors',
			public: true,
			type: 'http://inuit.iict.ch/1/data'
		}
	},

	/////////////////////////////////////////////////////////
	// Interface Sensor Data Batch event type
	/////////////////////////////////////////////////////////
	interfacesSensorDataBatch: {
		data: {
			name: 'Interfaces Sensor Data Batch',
			description: 'Data produced by sensors, batch format',
			public: true,
			type: 'http://inuit.iict.ch/1/batch'
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
	// Interfaces event source
	/////////////////////////////////////////////////////////
	interfaces: {
		template: eventSourceTemplates.interfaces,
		data: {
			name: 'Interfaces singleton'
		}
	}
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
// ACTION TARGET TEMPLATES
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
var actionTargetTemplates = {
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
// ACTION TYPES
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
var actionTypes = {
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
// ACTION TARGETS
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
var actionTargets = {
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
// RULES
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
var rules = {
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
	orgaName: 'iNUIT'
});