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
			type: 'http://inuit.iict.ch/1/sensor',
			schema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"title": "Sensor",
				"description": "A sensor in the INUIT project",
				"type": "object",
				"properties": {
					"id": {
						"description": "unique sensor id, UUID version 4 in canoncial form (for example 550e8400-e29b-41d4-a716-446655440000)",
						"type": "string"
					},
					"name": {
						"description": "human-friendly name of the sensor",
						"type": "string"
					},
					"type": {
						"description": "type of the sensor",
						"enum": ["smartphone", "wifiprobe", "thermometer", "hygrometer", "flowmeter", "door", "button"]
					},
					"description": {
						"description": "human-friendly description of the sensor",
						"type": "string"
					},
					"manufacturer": {
						"description": "manufacturer of the sensor",
						"type": "string"
					},
					"model": {
						"description": "model of the sensor",
						"type": "string"
					},
					"os": {
						"description": "operating system of the sensor",
						"type": "string"
					},
					"osVer": {
						"description": "operating system version of the sensor",
						"type": "string"
					},
					"app": {
						"description": "name of software application running on the sensor",
						"type": "string"
					},
					"appVer": {
						"description": "version of software application running on the sensor",
						"type": "string"
					},
					"locLat": {
						"description": "for fixed sensors, location latitude in the form [+-]DDD.DDDDD where D indicates degrees",
						"type": "number"
					},
					"locLon": {
						"description": "for fixed sensors, location longitude in the form [+-]DDD.DDDDD where D indicates degrees",
						"type": "number"
					},
					"locAlt": {
						"description": "for fixed sensors, location altitude, in meters above sea level",
						"type": "number"
					},
					"locName": {
						"description": "for fixed sensors, location name",
						"type": "string"
					},
					"locProv": {
						"description": "for fixed sensors, location provider. It can be either network (cell tower localization), gps (only gps chip) or fused (gps + network + wifi).",
						"type": "string"
					}
				},
				"required": ["id"]
			}
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
			type: 'http://inuit.iict.ch/1/data',
			schema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"title": "SensorData",
				"description": "Data produced by sensors",
				"type": "object",
				"properties": {
					"id": {
						"description": "unique sensor id, UUID version 4 in canoncial form (for example 550e8400-e29b-41d4-a716-446655440000)",
						"type": "string"
					},
					"t": {
						"description": "timestamp of the measurement in UTC time in milliseconds since January 1st 1970",
						"type": "integer"
					},
					"locLat": {
						"description": "location latitude in the form [+-]DDD.DDDDD where D indicates degrees",
						"type": "number"
					},
					"locLon": {
						"description": "location longitude in the form [+-]DDD.DDDDD where D indicates degrees",
						"type": "number"
					},
					"locAlt": {
						"description": "location altitude, in meters above sea level",
						"type": "number"
					},
					"locAcc": {
						"description": "accuracy estimation of horizontal location in meters",
						"type": "number"
					},
					"locName": {
						"description": "location name (logical location)",
						"type": "string"
					},
					"locProv": {
						"description": "location provider. It can be either network (cell tower localization), gps (only gps chip) or fused (gps + network + wifi).",
						"type": "string"
					},
					"bearing": {
						"description": "bearing, in degrees (horizontal direction of travel, not related to orientation)",
						"type": "number"
					},
					"speed": {
						"description": "speed, in meters/second over ground",
						"type": "number"
					},
					"accelX": {
						"description": "accelerometer, acceleration force along the x axis (including gravity) in m/s^2",
						"type": "number"
					},
					"accelY": {
						"description": "accelerometer, acceleration force along the y axis (including gravity) in m/s^2",
						"type": "number"
					},
					"accelZ": {
						"description": "accelerometer, acceleration force along the z axis (including gravity) in m/s^2",
						"type": "number"
					},
					"temp": {
						"description": "temperature measured in Kelvin",
						"type": "number"
					},
					"humid": {
						"description": "relative humidity measured as a ratio between 0.0 and 1.0",
						"type": "number"
					},
					"flow": {
						"description": "fluid flow measured in cubic meters",
						"type": "number"
					},
					"locked": {
						"description": "indicates whether door is locked",
						"type": "boolean"
					},
					"event": {
						"description": "button event",
						"enum": ["down", "up"]
					},
					"macaddr": {
						"description": "mac address of detected wifi client in canonical format (for example 00:0F:20:CF:8B:42)",
						"type": "string"
					},
					"power": {
						"description": "power of received signal from wifi client",
						"type": "number"
					},
					"ssids": {
						"description": "array of SSIDs the detected wifi client is actively searching for",
						"type": "array",
						"items": {"type": "string"}
					},
					"channel": {
						"description": "wifi channel on which wifi client is detected",
						"type": "number"
					}
				},
				"required": ["id", "t"]
			}
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
			type: 'http://inuit.iict.ch/1/batch',
			schema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"title": "SensorDataBatch",
				"description": "Data produced by sensors, batch format",
				"type": "object",
				"properties": {
					"id": {
						"description": "unique sensor id, UUID version 4 in canoncial form (for example 550e8400-e29b-41d4-a716-446655440000)",
						"type": "string"
					},
					"t": {
						"description": "timestamp of the measurement in UTC time in milliseconds since January 1st 1970",
						"type": "array",
						"items": {"type": "integer"}
					},
					"locLat": {
						"description": "location latitude in the form [+-]DDD.DDDDD where D indicates degrees",
						"type": "array",
						"items": {"type": "number"}
					},
					"locLon": {
						"description": "location longitude in the form [+-]DDD.DDDDD where D indicates degrees",
						"type": "array",
						"items": {"type": "number"}
					},
					"locAlt": {
						"description": "location altitude, in meters above sea level",
						"type": "array",
						"items": {"type": "number"}
					},
					"locAcc": {
						"description": "accuracy estimation of horizontal location in meters",
						"type": "array",
						"items": {"type": "number"}
					},
					"locName": {
						"description": "location name (logical location)",
						"type": "array",
						"items": {"type": "string"}
					},
					"locProv": {
						"description": "location provider. It can be either network (cell tower localization), gps (only gps chip) or fused (gps + network + wifi).",
						"type": "array",
						"items": {"type": "string"}
					},
					"bearing": {
						"description": "bearing, in degrees (horizontal direction of travel, not related to orientation)",
						"type": "array",
						"items": {"type": "number"}
					},
					"speed": {
						"description": "speed, in meters/second over ground",
						"type": "array",
						"items": {"type": "number"}
					},
					"accelX": {
						"description": "accelerometer, acceleration force along the x axis (including gravity) in m/s^2",
						"type": "array",
						"items": {"type": "number"}
					},
					"accelY": {
						"description": "accelerometer, acceleration force along the y axis (including gravity) in m/s^2",
						"type": "array",
						"items": {"type": "number"}
					},
					"accelZ": {
						"description": "accelerometer, acceleration force along the z axis (including gravity) in m/s^2",
						"type": "array",
						"items": {"type": "number"}
					},
					"temp": {
						"description": "temperature measured in Kelvin",
						"type": "array",
						"items": {"type": "number"}
					},
					"humid": {
						"description": "relative humidity measured as a ratio between 0.0 and 1.0",
						"type": "array",
						"items": {"type": "number"}
					},
					"flow": {
						"description": "fluid flow measured in cubic meters",
						"type": "array",
						"items": {"type": "number"}
					},
					"locked": {
						"description": "indicates whether door is locked",
						"type": "array",
						"items": {"type": "boolean"}
					},
					"event": {
						"description": "button event",
						"type": "array",
						"items": {"enum": ["down", "up"]}
					},
					"macaddr": {
						"description": "mac address of detected wifi client in canonical format (for example 00:0F:20:CF:8B:42)",
						"type": "array",
						"items": {"type": "string"}
					},
					"power": {
						"description": "power of received signal from wifi client",
						"type": "array",
						"items": {"type": "number"}
					},
					"ssids": {
						"description": "array of SSIDs the detected wifi client is actively searching for",
						"type": "array",
						"items": {"type": "array"}
					},
					"channel": {
						"description": "wifi channel on which wifi client is detected",
						"type": "array",
						"items": {"type": "number"}
					}
				},
				"required": ["id", "t"]
			}
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