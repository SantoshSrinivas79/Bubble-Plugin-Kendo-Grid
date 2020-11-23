function(properties, context) {
   var grid_id = 'kendogrid_'+properties.kendo_grid_id;
   $("#"+grid_id).data("kendoGrid").saveAsExcel();
}