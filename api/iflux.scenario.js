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
	slack_url: { default: process.env.SLACK_GATEWAY_URL },
	slack_bot_token: { default: process.env.SLACK_GATEWAY_IFLUX_BOT_TOKEN },
	slack_active: { default: process.env.COMMON_SLACK_ENABLE },
	viewbox_url: { default: process.env.VIEWBOX_URL },
	metrics_url: { default: process.env.METRICS_URL },
	citizen_url: { default: process.env.CITIZEN_URL }
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
	// Publibike event source template
	/////////////////////////////////////////////////////////
	publibike: {
		data: {
			name: 'Publibike',
				public: true
		}
	},

	/////////////////////////////////////////////////////////
	// Citizen event source template
	/////////////////////////////////////////////////////////
	citizen: {
		data: {
			name: 'Citizen Engagement',
			public: true,
			configuration: {
				schema: {
					$schema: 'http://json-schema.org/draft-04/schema#',
					type: 'object',
					properties: {
						all: {
							type: 'boolean'
						},
						'default': {
							type: 'boolean'
						},
						zipCodes: {
							type: 'array',
							minItems: 1,
							items: {
								type: 'integer'
							},
							uniqueItems: true
						},
					}
				},
				url: function () {
					return this.param('citizen_url') + '/configure';
				}
			}
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
	// Publibike movement event type
	/////////////////////////////////////////////////////////
	publibikeMovement: {
		data: {
			name: 'Publibike movement event',
			description: 'Represent a movement in the stock of bikes at any station',
			public: true,
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
	},

	/////////////////////////////////////////////////////////
	// Citizen issue creation event type
	/////////////////////////////////////////////////////////
	citizenIssueCreation: {
		data: {
			name: 'Issue creation',
			description: 'Issue created on Citizen Engagement',
			public: true,
			type: function () {
				return this.param('iflux_schemas_url') + '/eventTypes/citizenIssue';
			},
			schema: {
				$schema: 'http://json-schema.org/draft-04/schema#',
				type: 'object',
				properties: {
					issueId: {
						type: 'string'
					},
					imageUrl: {
						type: 'string'
					},
					creator: {
						type: 'string'
					},
					description: {
						type: 'string'
					},
					state: {
						enum: ['created', 'assigned', 'acknowledged', 'in_progress', 'rejected', 'resolved']
					},
					issueTypeCode: {
						type: 'string'
					},
					lat: {
						type: 'number'
					},
					lng: {
						type: 'number'
					},
					createdOn: {
						type: 'date'
					},
					updatedOn: {
						type: 'date'
					}
				}
			}
		}
	},

	/////////////////////////////////////////////////////////
	// Citizen issue status change event type
	/////////////////////////////////////////////////////////
	citizenIssueStatusChange: {
		data: {
			name: 'Issue status change',
			description: 'Issue state changed on Citizen Engagement',
			public: true,
			type: function() { return this.param('iflux_schemas_url') + '/eventTypes/citizenStatus'; },
			schema: {
				$schema: 'http://json-schema.org/draft-04/schema#',
		    type: 'object',
				properties: {
					issueId: {
						type: 'string'
					},
					imageUrl: {
						type: 'string'
					},
					creator: {
						type: 'string'
					},
					description: {
						type: 'string'
					},
					state: {
						enum: [ 'created', 'assigned', 'acknowledged', 'in_progress', 'rejected', 'resolved' ]
					},
					issueTypeCode: {
						type: 'string'
					},
					lat: {
						type: 'number'
					},
					lng: {
						type: 'number'
					},
					createdOn: {
						type: 'date'
					},
					updatedOn: {
						type: 'date'
					}
				}
			}
		}
	},

	/////////////////////////////////////////////////////////
	// Citizen action event type
	/////////////////////////////////////////////////////////
	citizenAction: {
		data: {
			name: 'Action taken on issues',
			description: 'Action performed on issue on Citizen Engagement',
			public: true,
			type: function () {
				return this.param('iflux_schemas_url') + '/eventTypes/citizenAction';
			},
			schema: {
				$schema: 'http://json-schema.org/draft-04/schema#',
				type: 'object',
				properties: {
					type: {
						enum: ['comment', 'addTags', 'removeTags', 'replaceTags', 'assign', 'ack', 'start', 'reject', 'resolve']
					},
					reason: {
						type: 'string'
					},
					user: {
						type: 'string'
					},
					issueId: {
						type: 'string'
					},
					issue: {
						type: 'string'
					},
					state: {
						enum: ['created', 'assigned', 'acknowledged', 'in_progress', 'rejected', 'resolved']
					},
					date: {
						type: 'date'
					}
				}
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
	// Publibike event source
	/////////////////////////////////////////////////////////
	ifluxPublibike: {
		template: eventSourceTemplates.publibike,
		data: {
			name: 'Publibike singleton data poller'
		}
	},

	/////////////////////////////////////////////////////////
	// Citizen for Yverdon event source
	/////////////////////////////////////////////////////////
	ifluxCitizenYverdon: {
		template: eventSourceTemplates.citizen,
	  data: {
		  name: 'Citizen Engagement - Yverdon',
		  configuration: {
			  zipCodes: [ 1400, 1401 ]
		  }
	  }
	},

	/////////////////////////////////////////////////////////
	// Citizen for Baulmes event source
	/////////////////////////////////////////////////////////
	ifluxCitizenBaulmes: {
		template: eventSourceTemplates.citizen,
	  data: {
		  name: 'Citizen Engagement - Baulmes',
		  configuration: {
			  zipCodes: [ 1446 ]
		  }
	  }
	},

	/////////////////////////////////////////////////////////
	// Citizen for Payerne event source
	/////////////////////////////////////////////////////////
	ifluxCitizenPayerne: {
		template: eventSourceTemplates.citizen,
	  data: {
		  name: 'Citizen Engagement - Payerne',
		  configuration: {
			  zipCodes: [ 1530 ]
		  }
	  }
	},

	/////////////////////////////////////////////////////////
	// Citizen for All event source
	/////////////////////////////////////////////////////////
	ifluxCitizenAll: {
		template: eventSourceTemplates.citizen,
		data: {
			name: 'Citizen Engagement - All',
			configuration: {
				all: true
			}
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
	// Slack action target template
	/////////////////////////////////////////////////////////
	slack: {
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
	},

	/////////////////////////////////////////////////////////
	// ViewBox action target template
	/////////////////////////////////////////////////////////
	viewBox: {
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
	},

	/////////////////////////////////////////////////////////
	// Metrics action target template
	/////////////////////////////////////////////////////////
	metrics: {
		data: {
		  name: 'iFLUX Metrics',
		  public: true,
		  target: {
		    url: function() { return this.param('metrics_url') + '/actions'; }
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
	// Slack message action type
	/////////////////////////////////////////////////////////
	slackMessage: {
		data: {
		  name: 'Slack messages',
		  description: 'Send a message to slack.',
			public: true,
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
	},

	/////////////////////////////////////////////////////////
	// ViewBox marker action type
	/////////////////////////////////////////////////////////
	viewBoxMarker: {
		data: {
		  name: 'View marker',
		  description: 'Add or update a view marker.',
			public: true,
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
						oneOf: [
							{ $ref: "#/definitions/bike" },
							{ $ref: "#/definitions/citizen"}
						]
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
			    },
			    citizen: {
				    type: {
					    enum: [ 'citizen' ]
				    },
				    state: {
					    enum: [ 'created', 'assigned', 'acknowledged', 'in_progress', 'rejected', 'resolved' ]
				    },
				    issueTypeCode: {
					    type: 'string'
				    },
				    description: {
					    type: 'string'
				    },
				    imageUrl: {
					    type: 'string'
				    },
				    owner: {
					    type: 'string'
				    },
				    createdOn: {
					    type: 'date'
				    }
			    }
		    }
		  }
		}
	},

	/////////////////////////////////////////////////////////
	// Metrics update action type
	/////////////////////////////////////////////////////////
	metricsUpdate: {
		data: {
			name: 'Metric update',
			description: 'Update metrics.',
			public: true,
			type: function () {
				return this.param('iflux_schemas_url') + '/actionTypes/updateMetric';
			},
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
	}
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
// ACTION TARGETS
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
var actionTargets = {
	/////////////////////////////////////////////////////////
	// Slack action target
	/////////////////////////////////////////////////////////
	ifluxSlack: {
		template: actionTargetTemplates.slack,
	  data: {
		  name: 'iFLUX Slack Gateway Instance',
		  configuration: function() { return { token: this.param('slack_bot_token') }; }
	  }
	},

	/////////////////////////////////////////////////////////
	// ViewBox action target
	/////////////////////////////////////////////////////////
	ifluxViewBox: {
		template: actionTargetTemplates.viewBox,
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
	},

	/////////////////////////////////////////////////////////
	// Metrics action target
	/////////////////////////////////////////////////////////
	ifluxMetrics: {
		template: actionTargetTemplates.metrics,
	  data: {
		  name: 'iFLUX Metrics Instance'
	  }
	},

	/////////////////////////////////////////////////////////
	// ViewBox for Citizen Yverdon - action target
	/////////////////////////////////////////////////////////
	ifluxViewBoxCitizenYverdon: {
		template: actionTargetTemplates.viewBox,
	  data: {
		  name: 'iFLUX ViewBox for Citizen Yverdon',
		  configuration: {
			  mapName: 'Citizen Engagement - Yverdon',
			  expiration: 5 * 60 * 1000,
			  mapConfig: {
				  centerLat: 46.77518,
				  centerLng: 6.6369435,
				  initialZoom: 15,
				  legendType: 'citizen'
			  }
		  }
	  }
	},

	/////////////////////////////////////////////////////////
	// ViewBox for Citizen Baulmes - action target
	/////////////////////////////////////////////////////////
	ifluxViewBoxCitizenBaulmes: {
		template: actionTargetTemplates.viewBox,
	  data: {
		  name: 'iFLUX ViewBox for Citizen Baulmes',
		  configuration: {
			  mapName: 'Citizen Engagement - Baulmes',
			  expiration: 5 * 60 * 1000,
			  mapConfig: {
				  centerLat: 46.79221800961638,
				  centerLng: 6.541028022766113,
				  initialZoom: 15,
				  legendType: 'citizen'
			  }
		  }
	  }
	},

	/////////////////////////////////////////////////////////
	// ViewBox for Citizen Payerne - action target
	/////////////////////////////////////////////////////////
	ifluxViewBoxCitizenPayerne: {
		template: actionTargetTemplates.viewBox,
	  data: {
		  name: 'iFLUX ViewBox for Citizen Payerne',
		  configuration: {
			  mapName: 'Citizen Engagement - Payerne',
			  expiration: 5 * 60 * 1000,
			  mapConfig: {
				  centerLat: 46.83532443497212,
				  centerLng: 6.956748962402344,
				  initialZoom: 15,
				  legendType: 'citizen'
			  }
		  }
	  }
	},

	/////////////////////////////////////////////////////////
	// ViewBox for Citizen action target
	/////////////////////////////////////////////////////////
	ifluxViewBoxCitizenAll: {
		template: actionTargetTemplates.viewBox,
	  data: {
		  name: 'iFLUX ViewBox for Citizen',
		  configuration: {
			  mapName: 'Citizen Engagement - All Cities',
			  expiration: 5 * 60 * 1000,
			  mapConfig: {
				  centerLat: 46.83532443497212,
				  centerLng: 6.514763832092285,
				  initialZoom: 11,
				  legendType: 'citizen'
			  }
		  }
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
	// iFLUX Publibike Movement rule
	/////////////////////////////////////////////////////////
	ifluxPublibikeMovementRule: {
		data: {
			name: 'Publibike movements',
			description: 'Broadcast publibike movements.',
			active: true,
			conditions: [{
				description: 'Detect bike movements',
				eventTypeId: eventTypes.publibikeMovement
			}],
			transformations: [{
				description: 'Notify a change in station to allow a visualization.',
				actionTargetId: actionTargets.ifluxViewBox,
				actionTypeId: actionTypes.viewBoxMarker,
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
						eventSourceTemplateId: eventSourceTemplates.publibike
					}
				}
			}, {
				description: 'Update free holders metric for each station.',
				actionTargetId: actionTargets.ifluxMetrics,
				actionTypeId: actionTypes.metricsUpdate,
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
						eventSourceTemplateId: eventSourceTemplates.publibike
					}
				}
			}, {
				description: 'Update bikes metric for each station.',
				actionTargetId: actionTargets.ifluxMetrics,
				actionTypeId: actionTypes.metricsUpdate,
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
						eventSourceTemplateId: eventSourceTemplates.publibike
					}
				}
			}]
		}
	},

	/////////////////////////////////////////////////////////
	// iFLUX Publibike Movement rule (SLACK specific)
	/////////////////////////////////////////////////////////
	ifluxPublibikeMovementSlackRule: {
		data: {
			name: 'Publibike movements notifications',
			description: 'Broadcast publibike movements notifications to Slack.',
			active: true,
			conditions: [{
				description: 'Detect bike movements',
				eventTypeId: eventTypes.publibikeMovement
			}],
			transformations: [{
				description: 'Broadcast a message on the Slack channel',
				actionTargetId: actionTargets.ifluxSlack,
				actionTypeId: actionTypes.slackMessage,
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
						eventSourceTemplateId: eventSourceTemplates.publibike
					}
				}
			}]
		}
	},

	/////////////////////////////////////////////////////////
	// iFLUX Citizen operations for all instances rule
	/////////////////////////////////////////////////////////
	citizenAllOperationsRule: {
		data: {
			name: 'Citizen operations',
			description: 'Broadcast Citizen Operations.',
			active: true,
			conditions: [{
				description: 'Detects issue creation.',
				eventTypeId: eventTypes.citizenIssueCreation
			}],
			transformations: [{
				description: 'Update the visualization of the issue creation on MapBox.',
				actionTargetId: actionTargets.ifluxViewBoxCitizenAll,
				actionTypeId: actionTypes.viewBoxMarker,
				fn: {
					expression: "return { markerId: event.properties.issueId, lat: event.properties.lat, lng: event.properties.lng, date: event.properties.createdOn, data: { type: 'citizen', description: event.properties.description, imageUrl: event.properties.imageUrl, state: event.properties.state, owner: event.properties.creator, createdOn: event.properties.createdOn, updatedOn: event.properties.updatedOn, issueTypeCode: event.properties.issueTypeCode }};",
					sample: {
						event: {
							issueId: 'asdgdgqwrasd',
							imageUrl: '',
							creator: 'Henri Dupont',
							description: 'Something went wrong',
							state: 'created',
							issueTypeCode: 'cdn',
							lat: 1.2345,
							lng: 6.7890,
							createdOn: '2015-05-12H12:34:56:000Z',
							updatedOn: '2015-05-12H12:34:56:000Z'
						},
						eventSourceTemplateId: eventSourceTemplates.citizen
					}
				}
			}, {
				description: 'Update the global metric that account the issue creations for all issues.',
				actionTargetId: actionTargets.ifluxMetrics,
				actionTypeId: actionTypes.metricsUpdate,
				fn: {
					expression: "return { metric: 'ch.heigvd.ptl.sc.ce.issues.creation', timestamp: event.timestamp };",
					sample: {
						event: {}
					}
				}
			}]
		}
	},

  citizenAllOperationsStatusChangeRule: {
 		data: {
 			name: 'Citizen operations Status Change',
 			description: 'Broadcast Citizen Operations.',
 			active: true,
 			conditions: [{
 				description: 'Detects issue status changes.',
 				eventTypeId: eventTypes.citizenIssueStatusChange
 			}],
 			transformations: [{
 				description: 'Update the visualization of the issue status change on MapBox.',
 				actionTargetId: actionTargets.ifluxViewBoxCitizenAll,
 				actionTypeId: actionTypes.viewBoxMarker,
 				fn: {
 					expression: "return { markerId: event.properties.issueId, lat: event.properties.lat, lng: event.properties.lng, date: event.properties.createdOn, data: { type: 'citizen', description: event.properties.description, imageUrl: event.properties.imageUrl, state: event.properties.state, owner: event.properties.creator, createdOn: event.properties.createdOn, updatedOn: event.properties.updatedOn, issueTypeCode: event.properties.issueTypeCode }};",
 					sample: {
 						event: {
 							issueId: 'asdgdgqwrasd',
 							imageUrl: '',
 							creator: 'Henri Dupont',
 							description: 'Something went wrong',
 							state: 'created',
 							issueTypeCode: 'cdn',
 							lat: 1.2345,
 							lng: 6.7890,
 							createdOn: '2015-05-12H12:34:56:000Z',
 							updatedOn: '2015-05-12H12:34:56:000Z'
 						},
 						eventSourceTemplateId: eventSourceTemplates.citizen
 					}
 				}
 			}]
 		}
 	},

  citizenAllOperationsActionRule: {
 		data: {
 			name: 'Citizen operations Action',
 			description: 'Broadcast Citizen Operations.',
 			active: true,
 			conditions: [{
 				description: 'Detects actions performed on issues.',
 				eventTypeId: eventTypes.citizenAction
 			}],
 			transformations: [{
 				description: 'Update the global metric that account the actions for all issues.',
 				actionTargetId: actionTargets.ifluxMetrics,
 				actionTypeId: actionTypes.metricsUpdate,
 				fn: {
 					expression: "return { metric: 'ch.heigvd.ptl.sc.ce.actions.' + event.properties.type, timestamp: event.timestamp };",
 					sample: {
 						event: {
 							type: 'created'
 						}
 					}
 				}
 			}]
 		}
 	},


	/////////////////////////////////////////////////////////
	// iFLUX Citizen operations for all instances rule (SLACK specific)
	/////////////////////////////////////////////////////////
  citizenAllOperationsSlackRule: {
 		data: {
 			name: 'Citizen operations for Slack notifications',
 			description: 'Broadcast Citizen Operations to Slack.',
 			active: true,
 			conditions: [{
 				description: 'Detects issue creation.',
 				eventTypeId: eventTypes.citizenIssueCreation
 			}],
 			transformations: [{
 				description: 'Broadcast a creation message on Slack.',
 				actionTargetId: actionTargets.ifluxSlack,
 				actionTypeId: actionTypes.slackMessage,
 				fn: {
 					expression: "return { channel: 'citizen', message: 'New issue created by ' + event.properties.creator + '. The problem is: ' + event.properties.description + ' and is situated at [' + event.properties.lat + ', ' + event.properties.lng + '].' };",
 					sample: {
 						event: {
 							issueId: 'asdgdgqwrasd',
 							imageUrl: '',
 							creator: 'Henri Dupont',
 							description: 'Something went wrong',
 							state: 'created',
 							issueTypeCode: 'cdn',
 							lat: 1.2345,
 							lng: 6.7890,
 							createdOn: '2015-05-12H12:34:56:000Z',
 							updatedOn: '2015-05-12H12:34:56:000Z'
 						},
 						eventSourceTemplateId: eventSourceTemplates.citizen
 					}
 				}
 			}]
 		}
 	},

  citizenAllOperationsSlackStatusChangeRule: {
 		data: {
 			name: 'Citizen operations for Slack notifications for status changes',
 			description: 'Broadcast Citizen Operations to Slack.',
 			active: true,
 			conditions: [{
 				description: 'Detects issue status changes.',
 				eventTypeId: eventTypes.citizenIssueStatusChange
 			}],
 			transformations: [{
 				description: 'Broadcast a status change message on Slack.',
 				actionTargetId: actionTargets.ifluxSlack,
 				actionTypeId: actionTypes.slackMessage,
 				fn: {
 					expression: "return { channel: 'citizen', message: 'The issue created by ' + event.properties.creator + ' is now in state: ' + event.properties.state + '.' };",
 					sample: {
 						event: {
 							issueId: 'asdgdgqwrasd',
 							imageUrl: '',
 							creator: 'Henri Dupont',
 							description: 'Something went wrong',
 							state: 'created',
 							issueTypeCode: 'cdn',
 							lat: 1.2345,
 							lng: 6.7890,
 							createdOn: '2015-05-12H12:34:56:000Z',
 							updatedOn: '2015-05-12H12:34:56:000Z'
 						},
 						eventSourceTemplateId: eventSourceTemplates.citizen
 					}
 				}
 			}]
 		}
 	},

  citizenAllOperationsSlackActionRule: {
 		data: {
 			name: 'Citizen operations for Slack notifications for actions',
 			description: 'Broadcast Citizen Operations to Slack.',
 			active: true,
 			conditions: [{
 				description: 'Detects actions performed on issues.',
 				eventTypeId: eventTypes.citizenAction
 			}],
 			transformations: [{
 				description: 'Broadcast a message on Slack for an action performed on issue.',
 				actionTargetId: actionTargets.ifluxSlack,
 				actionTypeId: actionTypes.slackMessage,
 				fn: {
 					expression: "return { channel: 'citizen', message: 'The action: ' + event.properties.type + ' has been done on issue: ' + event.properties.issue + ' by ' + event.properties.user + '.' };",
 					sample: {
 						event: {
 							type: 'comment',
 							reason: 'Did something',
 							user: 'Henri Dupont',
 							issueId: 'asdgdgqwrasd',
 							issue: 'Something went wrong',
 							state: 'created',
 							date: '2015-05-12H12:34:56:000Z'
 						},
 						eventSourceTemplateId: eventSourceTemplates.citizen
 					}
 				}
 			}]
 		}
 	},

  /////////////////////////////////////////////////////////
	// iFLUX Citizen operations for Yverdon
	/////////////////////////////////////////////////////////
	citizenYverdonOperationsRule: {
		data: {
			name: 'Citizen operations for Yverdon',
			description: 'Broadcast Citizen Operations for Yverdon.',
			active: true,
			conditions: [{
				description: 'Detects issue creation.',
				eventSourceId: eventSources.ifluxCitizenYverdon,
				eventTypeId: eventTypes.citizenIssueCreation
			}],
			transformations: [{
				description: 'Update the visualization of the issue creation in Yverdon on MapBox.',
				actionTargetId: actionTargets.ifluxViewBoxCitizenYverdon,
				actionTypeId: actionTypes.viewBoxMarker,
				fn: {
					expression: "return { markerId: event.properties.issueId, lat: event.properties.lat, lng: event.properties.lng, date: event.properties.createdOn, data: { type: 'citizen', description: event.properties.description, imageUrl: event.properties.imageUrl, state: event.properties.state, owner: event.properties.creator, createdOn: event.properties.createdOn, updatedOn: event.properties.updatedOn, issueTypeCode: event.properties.issueTypeCode }};",
					sample: {
						event: {
							issueId: 'asdgdgqwrasd',
							imageUrl: '',
							creator: 'Henri Dupont',
							description: 'Something went wrong',
							state: 'created',
							issueTypeCode: 'cdn',
							lat: 1.2345,
							lng: 6.7890,
							createdOn: '2015-05-12H12:34:56:000Z',
							updatedOn: '2015-05-12H12:34:56:000Z'
						},
						eventSourceTemplateId: eventSourceTemplates.citizen
					}
				}
			}, {
				description: 'Update the global metric that account the issue creations for Yverdon issues.',
				actionTargetId: actionTargets.ifluxMetrics,
				actionTypeId: actionTypes.metricsUpdate,
				fn: {
					expression: "return { metric: 'ch.heigvd.ptl.sc.ce.yverdon.issues.creation', timestamp: event.timestamp };",
					sample: {
						event: {}
					}
				}
			}]
		}
	},

  citizenYverdonOperationsStatusChangeRule: {
 		data: {
 			name: 'Citizen operations for Yverdon for status change',
 			description: 'Broadcast Citizen Operations for Yverdon.',
 			active: true,
 			conditions: [{
 				description: 'Detects issue status changes.',
 				eventSourceId: eventSources.ifluxCitizenYverdon,
 				eventTypeId: eventTypes.citizenIssueStatusChange
 			}],
 			transformations: [{
 				description: 'Update the visualization of the issue status change in Yverdon on MapBox.',
 				actionTargetId: actionTargets.ifluxViewBoxCitizenYverdon,
 				actionTypeId: actionTypes.viewBoxMarker,
 				fn: {
 					expression: "return { markerId: event.properties.issueId, lat: event.properties.lat, lng: event.properties.lng, date: event.properties.createdOn, data: { type: 'citizen', description: event.properties.description, imageUrl: event.properties.imageUrl, state: event.properties.state, owner: event.properties.creator, createdOn: event.properties.createdOn, updatedOn: event.properties.updatedOn, issueTypeCode: event.properties.issueTypeCode }};",
 					sample: {
 						event: {
 							issueId: 'asdgdgqwrasd',
 							imageUrl: '',
 							creator: 'Henri Dupont',
 							description: 'Something went wrong',
 							state: 'created',
 							issueTypeCode: 'cdn',
 							lat: 1.2345,
 							lng: 6.7890,
 							createdOn: '2015-05-12H12:34:56:000Z',
 							updatedOn: '2015-05-12H12:34:56:000Z'
 						},
 						eventSourceTemplateId: eventSourceTemplates.citizen
 					}
 				}
 			}]
 		}
 	},

  citizenYverdonOperationsActionRule: {
 		data: {
 			name: 'Citizen operations for Yverdon for action',
 			description: 'Broadcast Citizen Operations for Yverdon.',
 			active: true,
 			conditions: [{
 				description: 'Detects actions performed on issues.',
 				eventSourceId: eventSources.ifluxCitizenYverdon,
 				eventTypeId: eventTypes.citizenAction
 			}],
 			transformations: [{
 				description: 'Update the global metric that account the actions for Yverdon issues.',
 				actionTargetId: actionTargets.ifluxMetrics,
 				actionTypeId: actionTypes.metricsUpdate,
 				fn: {
 					expression: "return { metric: 'ch.heigvd.ptl.sc.ce.yverdon.actions.' + event.properties.type, timestamp: event.timestamp };",
 					sample: {
 						event: {
 							type: 'created'
 						}
 					}
 				}
 			}]
 		}
 	},

	/////////////////////////////////////////////////////////
	// iFLUX Citizen operations for Baulmes
	/////////////////////////////////////////////////////////
	citizenBaulmesOperationsRule: {
		data: {
			name: 'Citizen operations for Baulmes',
			description: 'Broadcast Citizen Operations for Baulmes.',
			active: true,
			conditions: [{
				description: 'Detects issue creation.',
				eventSourceId: eventSources.ifluxCitizenBaulmes,
				eventTypeId: eventTypes.citizenIssueCreation
			}],
			transformations: [{
				description: 'Update the visualization of the issue creation in Baulmes on MapBox.',
				actionTargetId: actionTargets.ifluxViewBoxCitizenBaulmes,
				actionTypeId: actionTypes.viewBoxMarker,
				fn: {
					expression: "return { markerId: event.properties.issueId, lat: event.properties.lat, lng: event.properties.lng, date: event.properties.createdOn, data: { type: 'citizen', description: event.properties.description, imageUrl: event.properties.imageUrl, state: event.properties.state, owner: event.properties.creator, createdOn: event.properties.createdOn, updatedOn: event.properties.updatedOn, issueTypeCode: event.properties.issueTypeCode }};",
					sample: {
						event: {
							issueId: 'asdgdgqwrasd',
							imageUrl: '',
							creator: 'Henri Dupont',
							description: 'Something went wrong',
							state: 'created',
							issueTypeCode: 'cdn',
							lat: 1.2345,
							lng: 6.7890,
							createdOn: '2015-05-12H12:34:56:000Z',
							updatedOn: '2015-05-12H12:34:56:000Z'
						},
						eventSourceTemplateId: eventSourceTemplates.citizen
					}
				}
			}, {
				description: 'Update the global metric that account the issue creations for Baulmes issues.',
				actionTargetId: actionTargets.ifluxMetrics,
				actionTypeId: actionTypes.metricsUpdate,
				fn: {
					expression: "return { metric: 'ch.heigvd.ptl.sc.ce.baulmes.issues.creation', timestamp: event.timestamp };",
					sample: {
						event: {}
					}
				}
			}]
		}
	},

  citizenBaulmesOperationsStatusChangeRule: {
 		data: {
 			name: 'Citizen operations for Baulmes for status change',
 			description: 'Broadcast Citizen Operations for Baulmes.',
 			active: true,
 			conditions: [{
 				description: 'Detects issue status changes.',
 				eventSourceId: eventSources.ifluxCitizenBaulmes,
 				eventTypeId: eventTypes.citizenIssueStatusChange
 			}],
 			transformations: [{
 				description: 'Update the visualization of the issue status change in Baulmes on MapBox.',
 				actionTargetId: actionTargets.ifluxViewBoxCitizenBaulmes,
 				actionTypeId: actionTypes.viewBoxMarker,
 				fn: {
 					expression: "return { markerId: event.properties.issueId, lat: event.properties.lat, lng: event.properties.lng, date: event.properties.createdOn, data: { type: 'citizen', description: event.properties.description, imageUrl: event.properties.imageUrl, state: event.properties.state, owner: event.properties.creator, createdOn: event.properties.createdOn, updatedOn: event.properties.updatedOn, issueTypeCode: event.properties.issueTypeCode }};",
 					sample: {
 						event: {
 							issueId: 'asdgdgqwrasd',
 							imageUrl: '',
 							creator: 'Henri Dupont',
 							description: 'Something went wrong',
 							state: 'created',
 							issueTypeCode: 'cdn',
 							lat: 1.2345,
 							lng: 6.7890,
 							createdOn: '2015-05-12H12:34:56:000Z',
 							updatedOn: '2015-05-12H12:34:56:000Z'
 						},
 						eventSourceTemplateId: eventSourceTemplates.citizen
 					}
 				}
 			}]
 		}
 	},

  citizenBaulmesOperationsActionRule: {
 		data: {
 			name: 'Citizen operations for Baulmes for action',
 			description: 'Broadcast Citizen Operations for Baulmes.',
 			active: true,
 			conditions: [{
 				description: 'Detects actions performed on issues.',
 				eventSourceId: eventSources.ifluxCitizenBaulmes,
 				eventTypeId: eventTypes.citizenAction
 			}],
 			transformations: [{
 				description: 'Update the global metric that account the actions for Baulmes issues.',
 				actionTargetId: actionTargets.ifluxMetrics,
 				actionTypeId: actionTypes.metricsUpdate,
 				fn: {
 					expression: "return { metric: 'ch.heigvd.ptl.sc.ce.baulmes.actions.' + event.properties.type, timestamp: event.timestamp };",
 					sample: {
 						event: {
 							type: 'created'
 						}
 					}
 				}
 			}]
 		}
 	},

  /////////////////////////////////////////////////////////
	// iFLUX Citizen operations for Payerne
	/////////////////////////////////////////////////////////
	citizenPayerneOperationsRule: {
		data: {
			name: 'Citizen operations for Payerne',
			description: 'Broadcast Citizen Operations for Payerne.',
			active: true,
			conditions: [{
				description: 'Detects issue creation.',
				eventSourceId: eventSources.ifluxCitizenPayerne,
				eventTypeId: eventTypes.citizenIssueCreation
			}],
			transformations: [{
				description: 'Update the visualization of the issue creation in Payerne on MapBox.',
				actionTargetId: actionTargets.ifluxViewBoxCitizenPayerne,
				actionTypeId: actionTypes.viewBoxMarker,
				fn: {
					expression: "return { markerId: event.properties.issueId, lat: event.properties.lat, lng: event.properties.lng, date: event.properties.createdOn, data: { type: 'citizen', description: event.properties.description, imageUrl: event.properties.imageUrl, state: event.properties.state, owner: event.properties.creator, createdOn: event.properties.createdOn, updatedOn: event.properties.updatedOn, issueTypeCode: event.properties.issueTypeCode }};",
					sample: {
						event: {
							issueId: 'asdgdgqwrasd',
							imageUrl: '',
							creator: 'Henri Dupont',
							description: 'Something went wrong',
							state: 'created',
							issueTypeCode: 'cdn',
							lat: 1.2345,
							lng: 6.7890,
							createdOn: '2015-05-12H12:34:56:000Z',
							updatedOn: '2015-05-12H12:34:56:000Z'
						},
						eventSourceTemplateId: eventSourceTemplates.citizen
					}
				}
			}, {
				description: 'Update the global metric that account the issue creations for Payerne issues.',
				actionTargetId: actionTargets.ifluxMetrics,
				actionTypeId: actionTypes.metricsUpdate,
				fn: {
					expression: "return { metric: 'ch.heigvd.ptl.sc.ce.payerne.issues.creation', timestamp: event.timestamp };",
					sample: {
						event: {}
					}
				}
			}]
		}
	},

  citizenPayerneOperationsStatusChangeRule: {
 		data: {
 			name: 'Citizen operations for Payerne for status change',
 			description: 'Broadcast Citizen Operations for Payerne.',
 			active: true,
 			conditions: [{
 				description: 'Detects issue status changes.',
 				eventSourceId: eventSources.ifluxCitizenPayerne,
 				eventTypeId: eventTypes.citizenIssueStatusChange
 			}],
 			transformations: [{
 				description: 'Update the visualization of the issue status change in Payerne on MapBox.',
 				actionTargetId: actionTargets.ifluxViewBoxCitizenPayerne,
 				actionTypeId: actionTypes.viewBoxMarker,
 				fn: {
 					expression: "return { markerId: event.properties.issueId, lat: event.properties.lat, lng: event.properties.lng, date: event.properties.createdOn, data: { type: 'citizen', description: event.properties.description, imageUrl: event.properties.imageUrl, state: event.properties.state, owner: event.properties.creator, createdOn: event.properties.createdOn, updatedOn: event.properties.updatedOn, issueTypeCode: event.properties.issueTypeCode }};",
 					sample: {
 						event: {
 							issueId: 'asdgdgqwrasd',
 							imageUrl: '',
 							creator: 'Henri Dupont',
 							description: 'Something went wrong',
 							state: 'created',
 							issueTypeCode: 'cdn',
 							lat: 1.2345,
 							lng: 6.7890,
 							createdOn: '2015-05-12H12:34:56:000Z',
 							updatedOn: '2015-05-12H12:34:56:000Z'
 						},
 						eventSourceTemplateId: eventSourceTemplates.citizen
 					}
 				}
 			}]
 		}
 	},

  citizenPayerneOperationsActionRule: {
 		data: {
 			name: 'Citizen operations for Payerne for action',
 			description: 'Broadcast Citizen Operations for Payerne.',
 			active: true,
 			conditions: [{
 				description: 'Detects actions performed on issues.',
 				eventSourceId: eventSources.ifluxCitizenPayerne,
 				eventTypeId: eventTypes.citizenAction
 			}],
 			transformations: [{
 				description: 'Update the global metric that account the actions for Payerne issues.',
 				actionTargetId: actionTargets.ifluxMetrics,
 				actionTypeId: actionTypes.metricsUpdate,
 				fn: {
 					expression: "return { metric: 'ch.heigvd.ptl.sc.ce.payerne.actions.' + event.properties.type, timestamp: event.timestamp };",
 					sample: {
 						event: {
 							type: 'created'
 						}
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