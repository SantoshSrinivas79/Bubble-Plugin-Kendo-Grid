function(instance, properties, context) { 
    
    if(properties.full_page){
         $('div.main-page').css("height", "auto");
         $("#kendogrid_"+properties.element_id).css("height", 'auto');
    }
    var i,j =0;
    //Enable Export option.
    var export_val = [];
    if(properties.enable_pdf)
        export_val.push('pdf');
    if(properties.enable_csv)
        export_val.push('excel');
    
    
    var field_labels = {};
    var field_remove = {};
    var applycolor = {};
    var custom_color_code = {};
    var fetched_column = '';
    var key_headers = [];
	var col_headers_title =[];

    
    for (i = 0; i < 16; i++) { 
      var field_type = 'field_'+i;
      var field_label = 'field_'+i+'_label';
      var field_show = 'field_'+i+'_show';
      if(properties[field_show] && properties[field_label] && properties[field_type]){
        var newlabel = properties[field_label];
        field_labels[newlabel] = properties[field_type];
        if(properties.show_list_as_columns !== null && properties.show_list_as_columns == properties[field_type])
        	fetched_column = newlabel;
      }
	  
    }
    
    // key headers;
    
    field_remove[fetched_column] = properties.show_list_as_columns;
    
    if(properties.show_list_as_columns_value_separator === null)
        properties.show_list_as_columns_value_separator = '###';
        
    var apply_color_flag = (properties.add_color_to_the_above_value !== null && properties.show_list_as_columns !== null);
    
    //add_color_to_the_above_value show_list_as_columns_value_separator  show_list_as_columns
    
    
    //get color array
    var get_color_list = properties.add_color_to_the_above_value.split(',');
    if(get_color_list.length){
        $.each(get_color_list, function( index, value ) {
			var get_color = value.split('###');
            if(get_color.length)
            	custom_color_code[get_color[0]] = get_color[1];
        });
	}
    
    function fetchData(item){
        var ret_array = {};
        Object.keys(field_labels).forEach(function(key) {
            var data_val = item.get(field_labels[key]);
            if(typeof data_val === 'object' && data_val){
                var listofData = data_val.get(0, data_val.length());
                if(data_val.length()){
                    ret_array[key] = '';
                    if(apply_color_flag){
                        Object.keys(listofData).forEach(function(key_in) {
                            var res_data = listofData[key_in].split(properties.show_list_as_columns_value_separator);
                            $.each(res_data, function( index, value ) {
                                if(index == 0)
                                    field_labels['xyz_'+value] = 'text';
                                else if(index == 1)
                                    ret_array[res_data[0]] = value;
                                else 
                                    ret_array[res_data[0]] = ret_array[res_data[0]]+(properties.add_color_to_the_above_value ? '###'+value : '');
                            });
                        }); 
                	}
                    else{
                        ret_array[key] = listofData.join(", ");
                    }
                }else{
                    ret_array[key] = data_val.get('_id');  
                }
            }else
                ret_array[key] = data_val;
        });
        return ret_array;
    }    
    
    function getShortColumnName(){
        var ret_array = [];
        var c =0;
        if(properties.apply_as_short_code_column_name){
        	Object.keys(field_labels).forEach(function(key) {
                if(typeof field_remove[key] == 'undefined'){
                    if(key.includes('xyz_')){
                       ret_array[c++] = key.replace('xyz_','')+'###'+(properties.prefix_short_code_column_name ? properties.prefix_short_code_column_name : 'Test')+' '+c;
                    }
                }
            });
        }
    	return ret_array;
    }
    function assignColumnName(){
        var ret_array = [];
        var x =0;
        var c =0;
         Object.keys(field_labels).forEach(function(key) {
            if(typeof field_remove[key] == 'undefined'){
                if(key.includes('xyz_')){
                   applycolor[key.replace('xyz_','')] = key;
                   c++;
                }
                   
                key = (key.includes('xyz_') && properties.apply_as_short_code_column_name ? (properties.prefix_short_code_column_name ? properties.prefix_short_code_column_name : 'Test')+' '+c : key.replace('xyz_',''));
                
                if(properties.full_width)
                    ret_array[x] = {field: '["'+key+'"]', title: key};
                else
                    ret_array[x] = {field: '["'+key+'"]', title: key, headerAttributes: { style: "oveflow:visible; white-space: normal; word-wrap: break-word"}};
                x++;
            }
        });
        return ret_array;
    }
    
    function getColumnNames(){
        var ret_array = [];
        var x =0;
         Object.keys(field_labels).forEach(function(key) {
            if(typeof field_remove[key] == 'undefined'){
                if(key.includes('xyz_'))
                   applycolor[key.replace('xyz_','')] = key;
                   
                key = key.replace('xyz_','');
                ret_array[x] = key;
                x++;
            }
        });
        return ret_array;
    }
    
    //add id to the div grid
    var divID = "kendogrid_"+properties.element_id;
	var div = $('<div id="'+divID+'"></div>');
    if(!$('#'+divID).length)
    	instance.canvas.parent('div').parent('div').after(div);
    else
        kendo.ui.progress($("#"+divID), true);
    
	$("#"+divID).css("width", "100%");
    $("#"+divID).css("height", "100%");
    
    var listOfThings = properties.data_source.get(0, properties.data_source.length()).map(fetchData);
    
    $('<script type="x/kendo-template" id="page-template"><div class="page-template"><div class="header">'+properties.page_title+'</div><div class="footer">Page #: pageNum # of #: totalPages #</div></div></script>').appendTo(instance.canvas.parent('div'));
    
    if(properties.custom_style)
    	$(properties.custom_style).appendTo(instance.canvas.parent('div'));
    
    var pageable = (properties.apply_paging ? {alwaysVisible: false, pageSizes: [5, 10, 20, 100]} : false);   
    
	$("#"+divID).kendoGrid({
        scrollable: properties.full_page ? false : true,
        height: properties.full_page ? null : properties.set_height ,
    	width: properties.full_page ? null : properties.set_width,
        toolbar: export_val,
        excel: {
            allPages: true,
            fileName: properties.export_title+'.xlsx',
        },
        excelExport: function(e) {
          if(properties.add_color_to_the_above_value){
                var sheet = e.workbook.sheets[0];
                // get the index of the cell to apply color
              	var col_headers = sheet.rows[0];
                for (var j = 1; j < sheet.rows.length; j++) {
                    var row = sheet.rows[j];
                    Object.keys(applycolor).forEach(function(key) {
                        var columnIndex = col_headers.cells.findIndex(x => x.value ===key);
                        if(row.cells[columnIndex].value){
                            var colorsplit = row.cells[columnIndex].value.split('###');
                            if(colorsplit[1] && typeof custom_color_code[colorsplit[1]] != 'undefined' ){
                                row.cells[columnIndex].background = custom_color_code[colorsplit[1]];
                            }
                            row.cells[columnIndex].value = colorsplit[0];
                        }
                    });
                }
              if(properties.export_excel_append_title !==null && properties.export_excel_append_title !=''){
                  var col_headers_title =[];
                    for (var z = 0; z < col_headers.cells.length; z++) {
                        if(z==0){
                            var title_col = {};
                            title_col['value'] = properties.export_excel_append_title;
                             if(properties.change_title_and_keypoints_fontsize && properties.title_and_keypoints_fontsize !==null && properties.title_and_keypoints_fontsize !='')
								title_col['fontSize'] = properties.title_and_keypoints_fontsize;
                             title_col['textAlign'] =  "center";
                             title_col['background'] = "#fff";
                             title_col['color'] = "#000";
                            col_headers_title[z] = title_col;
                         }else if(z== col_headers.cells.length-1){
                             var title_col = {};
                            title_col['value'] = properties.export_excel_generated_date;
                             if(properties.change_title_and_keypoints_fontsize && properties.title_and_keypoints_fontsize !==null && properties.title_and_keypoints_fontsize !='')
								title_col['fontSize'] = properties.title_and_keypoints_fontsize;
                             title_col['textAlign'] =  "center";
                             title_col['background'] = "#fff";
                             title_col['color'] = "#000";
                            col_headers_title[z] = title_col;
                             
                         }else{
                             var title_col = {};
                            title_col['value'] = '';
                             if(properties.change_title_and_keypoints_fontsize && properties.title_and_keypoints_fontsize !==null && properties.title_and_keypoints_fontsize !='')
								title_col['fontSize'] = properties.title_and_keypoints_fontsize;
                             title_col['textAlign'] =  "center";
                             title_col['background'] = "#fff";
                             title_col['color'] = "#000";
                            col_headers_title[z] = title_col;
                         }
                    }
                  sheet.rows.splice(0, 0, { cells: col_headers_title, type: "header", height: 40})
              }
              
              var last_cnt = sheet.rows.length + 5;
              var last_index = col_headers.length - 2;
              
              var key_header_real = [];
                if(properties.show_key_points_about_above_color && properties.key_points !==null && properties.key_points !=''){
                    var key_headers_split = properties.key_points.split(',');
                    if(key_headers_split.length){
                        $.each(key_headers_split, function( index, value ) {
                            var col_headers_bottom_title =[];

                            var key_header = value.split('###');
                            for (var z = 0; z < col_headers.cells.length; z++) {
                                if(z == col_headers.cells.length-2){
                                    var title_col = {};
                                    title_col['value'] = (key_header[0] ? key_header[0] : '');
									 if(properties.change_title_and_keypoints_fontsize && properties.title_and_keypoints_fontsize !==null && properties.title_and_keypoints_fontsize !='')
										title_col['fontSize'] = properties.title_and_keypoints_fontsize;
                                     title_col['textAlign'] =  "center";
                                     title_col['background'] = (key_header[1] ? key_header[1] : '');
                                     title_col['color'] = "#000";
                                    col_headers_bottom_title[z] = title_col;
                                 } else if(z == col_headers.cells.length-1){
                                    var title_col = {};
                                    title_col['value'] = (key_header[2] ? key_header[2] : '');
                                     if(properties.change_title_and_keypoints_fontsize && properties.title_and_keypoints_fontsize !==null && properties.title_and_keypoints_fontsize !='')
										title_col['fontSize'] = properties.title_and_keypoints_fontsize;
                                     title_col['textAlign'] =  "center";
                                     title_col['background'] = '#ffffff';
                                     title_col['color'] = "#000";
                                    col_headers_bottom_title[z] = title_col;
                                 }else{
                                     var title_col = {};
                                    title_col['value'] = '';
                                     if(properties.change_title_and_keypoints_fontsize && properties.title_and_keypoints_fontsize !==null && properties.title_and_keypoints_fontsize !='')
										title_col['fontSize'] = properties.title_and_keypoints_fontsize;
                                     title_col['textAlign'] =  "center";
                                     title_col['background'] = "#fff";
                                     title_col['color'] = "#000";
                                    col_headers_bottom_title[z] = title_col;
                                 }
                            }
                            sheet.rows.splice(last_cnt, 0, { cells: col_headers_bottom_title, type: "header", height: 40});
                        });
                    }
                }
                 
          }
        },
        pdf: {
            fileName : properties.export_title+'.pdf',
            allPages: true,
            avoidLinks: true,
            paperSize: properties.pdf_page_size,
            margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
            landscape: properties.is_landscape,
            repeatHeaders: false,
            template: $("#page-template").html(),
            scale: 0.8
        },
        groupable: false,
        dataSource: {
			batch: true,
            data: listOfThings,
            pageSize: (properties.full_page ? false : properties.apply_paging) ? properties.items_per_page : null,
			requestStart: function(){
              	kendo.ui.progress($("#"+divID), true);  
            },
            requestEnd: function () {
            	kendo.ui.progress($("#"+divID), false);
            }
        },
        dataBound: function(e) {
            fetch_col_data_cnt = assignColumnName();
            short_column_name = getShortColumnName();
			instance.publishState('total_columns', fetch_col_data_cnt.length);
            instance.publishState('short_column_name', short_column_name);
            if(properties.add_color_to_the_above_value){
                // get the index of the cell to apply color
                var allcolumn = getColumnNames();
                // iterate the table rows and apply custom row and cell styling
                var rows = e.sender.tbody.children();
                for (var j = 0; j < rows.length; j++) {
                    var row = $(rows[j]);
                    var dataItem = e.sender.dataItem(row);
                    Object.keys(applycolor).forEach(function(key) {
                        var columnIndex = allcolumn.indexOf(key);
                        if(dataItem[key]){
                            var colorsplit = dataItem[key].split('###');
                            if(colorsplit[1] && typeof custom_color_code[colorsplit[1]] != 'undefined' ){
                                var cell = row.children().eq(columnIndex);
                                cell.text(colorsplit[0]);
                                cell.css('background-color',custom_color_code[colorsplit[1]]);
                                cell.css("border","3px solid #fff");
                            }
                        }
                    });
                }
            }
            changeheightofKendogrid(divID);
            if(properties.full_width){
                for (var i = 0; i < this.columns.length; i++) {
                    this.autoFitColumn(i);
                }
            }
        },
        filterable: false,
        sortable: true,
        pageable: (properties.full_page ? false : pageable),
        columns: assignColumnName()
    });
    

    function changeheightofKendogrid(divID){
        if(properties.full_page){
            setTimeout(function(){ 
                var setheight = $("#"+divID+" div.k-grid-content table").height();
                $("#"+divID+" div.k-grid-content").css({
                    "overflow-y": "hidden"
                });
                $("#"+divID).css("height", "auto");
                $("#"+divID+" div.k-grid-content table").css("height", "auto");
                $("#"+divID+" div.k-grid-content").css("height", "auto");
                $("#"+divID).parent('div').parent('div').css("height", "auto");
            } , 3000);
		}
    }
}