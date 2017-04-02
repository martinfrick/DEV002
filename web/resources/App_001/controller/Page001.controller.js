sap.ui.define([
	"sap/ui/core/mvc/Controller"
],	function (Controller) {
		"use strict";
		return Controller.extend("mfr.app001.controller.Page001", {
	      
		onInit: function(){
			this.getView().addStyleClass("sapUiSizeCompact"); 
			
			var urlStockData = "/node/yahoo_stocks_live";
			sap.ui.getCore().getModel().setProperty("/mPath", urlStockData);
			sap.ui.getCore().getModel().setProperty("/mEntity", "/modelData");
	    },
	      
	    onGetStockData: function () {
	    	
	    	var url = sap.ui.getCore().getModel().getProperty("/mPath");
	    	
	    	jQuery.ajax({
	    		type : "GET",
                contentType : "application/json",
                url : url,
                dataType : "json",
                success : this.getView().getController()._buildStockDataTable
	    	});   
	    	
	        
	    },
	    
	    _buildStockDataTable: function (data) {
	        
	        var mEntity = sap.ui.getCore().getModel().getProperty("/mEntity");
	        
	        var oTable = sap.ui.getCore().byId("__xmlview0--App001").byId("tblStockData");
			oTable.removeAllColumns();
			oTable.removeAllItems();
			
			var columnList = new sap.m.ColumnListItem();
			
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({modelData: data});
			
			var oMeta = Object.keys(JSON.parse(oModel.getJSON()).modelData[0]);
		
			if (!oMeta) {
				sap.m.MessageBox.show("Bad Service Definition ", {
					icon: sap.m.MessageBox.Icon.ERROR,
					title: "Service Call Error",
					actions: [sap.m.MessageBox.Action.OK],
					styleClass: "sapUiSizeCompact"
				});
			} else {
				//Table Column Definitions
				for (var i = 0; i < oMeta.length; i++) {
					var property = oMeta[i];
					
					oTable.addColumn(
						new sap.m.Column({
							header: new sap.m.Label({
								text: property
							}),
							width: "125px"
						})
					);
					
					columnList.addCell(
						new sap.m.Text({
							text: {
								path: property
							},
							name: property
						})
					);
				}
				oTable.setModel(oModel);
			}	
			
			oTable.bindItems({
				path: "/modelData",
				template: columnList
			});
		}
	    
   });
});