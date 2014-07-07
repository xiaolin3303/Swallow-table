# Swallow-table

基于jQuery的表格插件，适用场景为通过AJAX方式获取数据，快速的生成表格，Swallow-table实现了自动页码，翻页，排序功能等，提供一些常用方法和事件的监听。

### 参数option

*   <code>url</code> 后台服务地址，swallow-table会向这个地址发起请求,获取数据
*   <code>page_selector</code> 一个有效的jquery选择器，例如#page，swallow-table会在该容器中自动填充页码信息及翻页组件
*   <code>rows</code> 每页显示条目数（可选，默认20）
*   <code>page</code> 当前页码（可选，默认1）
*   <code>用户自定义参数</code> swallow-table请求后台数据时会发送用户自定义的参数

> rows, page以及用户自定义参数会向后台请求数据时(POST方式)作为参数发送

### 方法method

*   <code>setting</code> 设置参数
*   <code>refresh</code> 刷新表格内容，这个方法会重新向后台发起一次请求（携带用户最新设置的参数）

### 事件event

*   <code>onload</code> 数据请求完成时触发

### 其他

*   皮肤
> 插件默认提供了三套皮肤，分别为swallow-table1, swallow-table2, swallow-table3, 用户也可以自己定义皮肤css

*   排序
> 为table的th标签设置sort属性可开启该列的排序，sort属性值会作为向后台请求数据时的参数，可以为多列开启排序，例如<code>&lt;th sort="A"&gt;</code>,当该列升序排列时，向后台传入的参数为order_type:A，降序时为order_type:-A，设置sort属性只是开启排序，并不会在表格加载时主动发起排序，如果想让表格加载时完成排序，需要在对应的th上设置sort-default属性(属性值desc,asc，默asc)，例如：<code>&lt;th sort="A" sort-default&gt;</code>

*   数据格式
> 返回数据应该为JSON格式，必须带有success标志位（true or false）, total（总条目数），例如<code>{"success": true, "total": 2, "content": [{"a": 1, "b": 2, "c": 3, "d": 4}, {"a": 1, "b": 2, "c": 3, "d": 4}]}</code>

---------------------------------------

### 详细见代码中demo.html
