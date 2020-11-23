function(properties, context) {
   	var grid_id = 'kendogrid_'+properties.kendo_grid_id;
   	$("#"+grid_id).data("kendoGrid").saveAsPDF();
   	var grid = $("#grid").data("kendoGrid");
	var progress = $.Deferred();
    console.log(progress);
    kendo.drawing.drawDOM($("#test1"))
        .done(function(header) {
            grid._drawPDF(progress)
                .then(function(root) {
                root.children.unshift(header);
                return kendo.drawing.exportPDF(root, { multiPage: true });
            })
                .done(function(dataURI) {
                kendo.saveAs({
                    dataURI: dataURI,
                    fileName: properties.export_page_name
                });
                progress.resolve();
            })
    });
}