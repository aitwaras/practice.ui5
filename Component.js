(function() {
	"use strict";

	var componentRootPath = "practise.ui5";

	jQuery.sap.declare([componentRootPath,"Component"].join("."));
	jQuery.sap.require([componentRootPath,"MyRouter"].join("."));
	jQuery.sap.require("sap.ui.core.util.MockServer");

	sap.ui.core.UIComponent.extend([componentRootPath,"Component"].join("."), {
		metadata: {
			name: "Practise UI5 Fiory Apps",
			version: "0.1",
			includes: [],
			dependencies: {
				libs: ["sap.m", "sap.ui.layout"],
				components: []
			},
		
			rootView: [componentRootPath,"view.App"].join("."),
			config: {
				resourceBundle: "i18n/messageBundle.properties",
				serviceConfig: {
					name: "mockData",
					serviceUrl: "http://Mockserver/"
				},
				/*serviceConfig : {
                name : "Northwind",
                serviceUrl : "http://services.odata.org/V2/(S(sapuidemotdg))/OData/OData.svc/"
            	},*/
				fullWidth: true
			},
			routing: {				
				/*config: {
					routerClass: [componentRootPath,"MyRouter"].join("."),
					viewType: "XML",
					viewPath: [componentRootPath,"view"].join("."),
					targetControl: "idAppControl",
					targetAggegaton: "fullScreenPage"
				},
				routes: [{
					pattern: "",
					name: "main",
					view: "Master",
					targetControl: "idAppControl"
				}]*/
				/*fullScreenPageRoutes: [{
					pattern: "",
					name: "main",
					view: "Master",
					targetControl: "idAppControl"
				}]*/
				//other approach
				config : {
				routerClass : practise.ui5.MyRouter,
				viewType : "XML",
				viewPath : "practise.ui5.view",
				targetAggregation : "pages",
				//targetControl: "idAppControl",
				clearTarget : false
			},
			routes : [
				{
					pattern : "",
					name : "main",
					view : "Master",
					targetAggregation : "pages",
					targetControl : "idAppControl"
					/*subroutes : [
						{
							pattern : "{product}/:tab:",
							name : "product",
							view : "Detail"
						}
					]*/
				},
				{
					name : "catchallMaster",
					view : "Master",
					targetAggregation : "pages",
					targetControl : "idAppControl"
					/*subroutes : [
						{
							pattern : ":all*:",
							name : "catchallDetail",
							view : "NotFound"
						}
					]*/
				}
			]
			},
		},

		init: function() {
			sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

			var mConfig = this.getMetadata().getConfig();

			var rootPath = jQuery.sap.getModulePath(componentRootPath);

			//set i18n model
			var i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: [rootPath, mConfig.resourceBundle].join("/")
			});
			this.setModel(i18nModel, "i18n");

			

			//set device model
			var deviceModel = new sap.ui.model.json.JSONModel({
				isTouch: sap.ui.Device.support.touch,
				isNoTouch: !sap.ui.Device.support.touch,
				isPhone: sap.ui.Device.system.Phone,
				isNoPhone: !sap.ui.Device.system.Phone,
				listMode: sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
				listItemType: sap.ui.Device.system.phone ? "Active" : "Inactive"
			});
			deviceModel.setDefaultBindingMode("OneWay");
			this.setModel(deviceModel, "device");

			//config and start mock server
			var oMockServer = new sap.ui.core.util.MockServer({
				rootUri: mConfig.serviceConfig.serviceUrl
			});

			oMockServer.simulate([rootPath, "model/metadata.xml"].join("/"),{
				"sMockdataBaseUrl": "model/",
				"bGenerateMissingMockData": true
			});

			//oMockServer.simulate("model/metadata.xml", "model/");  

			oMockServer.start();

			//set data  model
			var sServiceUrl = mConfig.serviceConfig.serviceUrl;
        	var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
        	this.setModel(oModel);

			//use with "routes" array in routing metadata configuration
			this.getRouter().initialize();
		},
	})
})();