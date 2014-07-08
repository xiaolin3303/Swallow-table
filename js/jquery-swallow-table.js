/*!
 * Swallow-table v1.1
 *
 * Contact: https://github.com/xiaolin3303
 * 2014-07-06
 *
 * Designed and built with all the love of Web
 */
(function($){
	$.fn.swallow_table = function(option, callback){
		if(option === 'refresh'){
			$(this).trigger('refresh');
			return;
		}
		if(option === 'setting'){
			$(this).trigger('setting', [callback]);
			return;
		}
		if(option === 'onload'){
			$(this).trigger('setting', [{'onload': callback}]);
			return;
		}
		var context = this;
		var pageInfo = {'now': null, 'total': null, 'pageSize': null};
		var opt = $.extend({
						'rows': 20,
						'page': 1,
						'method': 'post'
					}, option);
		if($('.swallow-page', opt.page_selector).size() == 0){
			var page_ele = $('<span>转到：<input class="change-page" type="text" style="width:30px;padding:2px 5px" value="1" /></span><span class="page-info" style="margin-left:8px">N/A</span><span class="clearfix rt" style="display:inline-block;top:5px;position:relative;margin-left:8px"><ul class="swallow-page"><li class="page-prev"><div class="Rob"></div></li><li class="page-next"><div class="hnb"></div></li></ul></span>');
			$(opt.page_selector).append(page_ele);
		}
		$('th[sort]', context).each(function(){
			$(this).append($('<i state="1" class="sort icon icon-chevron-up" style="display:none" title="升序">'));
		});
		$('th[sort-default]:first', context).each(function(){
			var sort_style = $(this).attr('sort-default'), order_type = $(this).attr('sort');
			sort_style = sort_style === 'desc' ? 'desc' : 'asc';
			$('i.sort', this).addClass('current').show();
			if(sort_style === 'desc'){
				$('.sort', this).attr({'title': '降序', 'state': 2}).removeClass('icon-chevron-up').addClass('icon-chevron-down current');
				order_type = '-' + order_type;
			}
			opt = $.extend(opt, {'order_type': order_type});
		});
		$('th', context).on('mouseenter', function(){
			$('.sort', this).show();
		}).on('mouseleave', function(){
			if(!$('.sort', this).hasClass('current')){
				$('.sort', this).hide();
			}
		});
		$(context).on('click', '.sort', function(){
			var state = $(this).attr('state');
			var order_type = $(this).parents('th').attr('sort');
			if(state == 1){
				//当前为升序
				$(this).attr({'state': 2, 'title': '降序'});
				$(this).removeClass('icon-chevron-up').addClass('icon-chevron-down');
				order_type = '-' + order_type;
			}else{
				//当前为降序
				$(this).attr({'state': 1, 'title': '升序'});
				$(this).removeClass('icon-chevron-down').addClass('icon-chevron-up');
			}
			$('i.current', context).removeClass('current').hide();
			$(this).addClass('current').show();
			opt = $.extend(opt, {'order_type': order_type, 'page': 1});
			getInfo(opt, function(data){
				callback(data);
				insertPageInfo(data);
			});
		});
		var getInfo = function(option, _callback){
			var _option = $.extend(true, {}, option);
			delete _option.url;
			delete _option.method;
			delete _option.page_selector;
			delete _option.onload;		

			$.ajax({
				'url': option.url,
				'type': option.method,
				'data': _option,
				'dataType': 'json',
				'success': function(data) {
					if(data.success){
						pageInfo.now = option.page;
						pageInfo.total = data.total;
						pageInfo.pageSize = option.rows;

						if(pageInfo.now == 1){
							$('.page-prev', page_ele).addClass('disabled');
						}else{
							$('.page-prev', page_ele).removeClass('disabled');
						}
						if(pageInfo.now == Math.ceil(pageInfo.total / pageInfo.pageSize)){
							$('.page-next', page_ele).addClass('disabled');
						}else{
							$('.page-next', page_ele).removeClass('disabled');
						}
						_callback(data);
						if(typeof option.onload === 'function') {
							option.onload(data, 'success');
						}
					}else{
						if(typeof option.onload === 'function') {
							if(option.onload(data, 'data_error') !== false) {
								alert('获取数据出错，请稍后重试');
							}
						}
					}
				},
				'error': function(jqXHR, textStatus, errorThrown) {
					if(typeof option.onload === 'function') {
						if(option.onload({}, 'network_server_error') !== false) {
							alert('获取数据出错，请稍后重试');
						}
					}
				}
			});
		};
		var insertPageInfo = function(data){
			if(data.total){
				$('.page-info', $(opt.page_selector)).text('第'+((pageInfo.now-1)*pageInfo.pageSize+1)+'-'+(Math.min(pageInfo.total, pageInfo.now*pageInfo.pageSize))+'项，共'+pageInfo.total+'项');
				$('.change-page', $(opt.page_selector)).val(pageInfo.now);
			}else{
				$('.page-info', $(opt.page_selector)).text('N/A');
				$('.change-page', $(opt.page_selector)).val(1);
			}
		};
		getInfo(opt, function(data){
			callback(data);
			insertPageInfo(data);
		});
		$(context).unbind('refresh').on('refresh', function(){
			getInfo(opt, function(data){
				callback(data);
				insertPageInfo(data);
			});
		});
		$(context).unbind('setting').on('setting', function(e, _opt){
			opt = $.extend(opt, _opt);
		});
		//上一页逻辑
		$('.swallow-page .page-prev', $(opt.page_selector)).click(function(){
			var now_page = pageInfo.now;
			if(now_page > 1){
				var _opt = {'page': now_page-1};
				getInfo($.extend(opt, _opt), function(data){
					callback(data);
					insertPageInfo(data);
				});
			}
		});
		//下一页逻辑
		$('.swallow-page .page-next', $(opt.page_selector)).click(function(){
			var now_page = pageInfo.now;
			if(now_page < Math.ceil(pageInfo.total/pageInfo.pageSize)){
				var _opt = {'page': now_page+1};
				getInfo($.extend(opt, _opt), function(data){
					callback(data);
					insertPageInfo(data);
				});
			}
		});
		//跳页逻辑
		$('.change-page', $(opt.page_selector)).unbind().on('keyup', function(e){
			if(e.which == 13){
				page = parseInt($(this).val());
				if(isNaN(page) || page < 1){
					page = 1;
				}else if(page > Math.ceil(pageInfo.total/pageInfo.pageSize)){
					page = Math.ceil(pageInfo.total/pageInfo.pageSize);
				}
				var _opt = {'page': page};
				getInfo($.extend(opt, _opt), function(data){
					callback(data);
					insertPageInfo(data);
				});
			}
		});
	};
})(jQuery);
