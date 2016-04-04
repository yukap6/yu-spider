/**
 * Created by jingweirong on 16/4/4.
 */
var LeftMenuContainer = React.createClass({
    displayName: "LeftMenuContainer",

    render: function () {
        return React.createElement(
            "section",
            null,
            React.createElement(
                "section",
                { className: "com_logo" },
                React.createElement(
                    "span",
                    { className: "big_words" },
                    "Q"
                ),
                "uilt Data"
            ),
            React.createElement(
                "section",
                { className: "com_menu" },
                React.createElement(
                    "ul",
                    { className: "com_leftmenu_ul" },
                    React.createElement(
                        "li",
                        { className: "menu_main menu_active" },
                        React.createElement(
                            "div",
                            { className: "menu_first" },
                            React.createElement("i", { className: "glyphicon glyphicon-cloud pull-left" }),
                            React.createElement(
                                "h4",
                                { className: "pull-left" },
                                "概况分析"
                            ),
                            React.createElement("i", { className: "pull-right glyphicon glyphicon-menu-down" })
                        ),
                        React.createElement(
                            "ul",
                            { className: "sub_menu" },
                            React.createElement(
                                "li",
                                { className: "sub_active" },
                                "销量分析"
                            ),
                            React.createElement(
                                "li",
                                null,
                                "用户分析"
                            ),
                            React.createElement(
                                "li",
                                null,
                                "环比分析"
                            ),
                            React.createElement(
                                "li",
                                null,
                                "主线分析"
                            )
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: "menu_main" },
                        React.createElement(
                            "div",
                            { className: "menu_first" },
                            React.createElement("i", { className: "glyphicon glyphicon-cog pull-left" }),
                            React.createElement(
                                "h4",
                                { className: "pull-left" },
                                "基础分析"
                            ),
                            React.createElement("i", { className: "pull-right glyphicon glyphicon-menu-right" })
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: "menu_main" },
                        React.createElement(
                            "div",
                            { className: "menu_first" },
                            React.createElement("i", { className: "glyphicon glyphicon-search pull-left" }),
                            React.createElement(
                                "h4",
                                { className: "pull-left" },
                                "业务分析"
                            ),
                            React.createElement("i", { className: "pull-right glyphicon glyphicon-menu-right" })
                        )
                    )
                )
            )
        );
    }
});

var TopBarBox = React.createClass({
    displayName: "TopBarBox",

    render: function () {
        return React.createElement(
            "div",
            { className: "row" },
            React.createElement(
                "div",
                { className: "col-sm-4 com_header_block_des" },
                "Quilt data collect |"
            ),
            React.createElement(
                "div",
                { className: "col-sm-8 com_rh_user" },
                React.createElement(
                    "div",
                    { className: "dropdown pull-right com_header_menu btn-group", role: "presentation" },
                    React.createElement(
                        "a",
                        { "aria-expanded": "false", "aria-haspopup": "true", role: "button", "data-toggle": "dropdown", className: "dropdown-toggle", href: "#", id: "drop2" },
                        "admin",
                        React.createElement("span", { className: "caret" })
                    ),
                    React.createElement(
                        "ul",
                        { "aria-labelledby": "drop2", className: "dropdown-menu" },
                        React.createElement(
                            "li",
                            null,
                            React.createElement(
                                "a",
                                { href: "#" },
                                "login out"
                            )
                        ),
                        React.createElement(
                            "li",
                            null,
                            React.createElement(
                                "a",
                                { href: "#" },
                                "switch roles"
                            )
                        ),
                        React.createElement("li", { className: "divider", role: "separator" }),
                        React.createElement(
                            "li",
                            null,
                            React.createElement(
                                "a",
                                { href: "#" },
                                "user center"
                            )
                        )
                    )
                )
            )
        );
    }
});

var urlObj = {
    "sortInit": "/home/index/sortinit",
    "getStoreData": "/home/index/getalldata"
};

var data = [];
data["charts"] = [];
data["sort"] = [];
data["table"] = [];

var DataContentContainer = React.createClass({
    displayName: "DataContentContainer",

    getInitialState: function () {
        return { data: data };
    },
    componentDidMount: function () {
        //init sort
        this.getStoreSets();
        //charts init
        this.setChartsData();
    },
    searchHandler: function () {
        var url = urlObj.getStoreData;
        var params = { "item_store": $("[name=item_store]").val() };
        if (!params.item_store) {
            quilt.alertTop("请您先选择店铺");
            return;
        }
        if ($("[name=date_begin]").val() && $("[name=date_end]").val()) {
            params.item_datebegin = $("[name=date_begin]").val();
            params.item_dateend = $("[name=date_end]").val();
        } else {
            var quickTime = $("[name=quick_month]").val();
            if (quickTime) {
                params.item_datebegin = quickTime.split("/")[0];
                params.item_dateend = quickTime.split("/")[1];
            }
        }
        if (!params.item_datebegin || !params.item_dateend) {
            quilt.alertTop("请您先选择起始日期");
            return;
        }
        quilt.post(url, params, function (res) {
            this.setChartsData(res.chartsData);
            data["table"] = res.tableData;
            this.setState({ data: data });
        }.bind(this), function () {
            res;
        }.bind(this));
    },
    setChartsData: function (chartsData) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echarts_container'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '销量前十的quilt名单'
            },
            tooltip: {},
            legend: {
                data: ['销量']
            },
            xAxis: {
                data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };
        if (chartsData) {
            option.xAxis.data = [];
            option.series[0].data = [];
            for (var key in chartsData) {
                var item = chartsData[key];
                option.xAxis.data.push(item.item_title.substr(0, 5));
                option.series[0].data.push(item.num);
            }
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },
    getStoreSets: function () {
        var url = urlObj.sortInit;
        var params = {};
        quilt.post(url, params, function (res) {
            data["sort"]["stores"] = res.data;
            this.setState({ data: data });
        }.bind(this), function () {
            res;
        }.bind(this));
    },
    render: function () {
        return React.createElement(
            "div",
            null,
            React.createElement(DataContentSort, { data: this.state.data.sort, onClick: this.searchHandler }),
            React.createElement(
                "div",
                { className: "data_container" },
                React.createElement(DataContentCharts, null),
                React.createElement(DataContentTable, { data: this.state.data.table })
            )
        );
    }
});

var DataContentSort = React.createClass({
    displayName: "DataContentSort",

    render: function () {
        var stores = this.props.data["stores"] || [];
        var storeOptions = stores.map(function (value, key) {
            return React.createElement(
                "option",
                { key: key, value: value.item_store },
                value.item_store
            );
        });
        return React.createElement(
            "div",
            { className: "sort" },
            React.createElement(
                "div",
                { className: "sort_line row" },
                React.createElement(
                    "div",
                    { className: "col-xs-3 col-sm-2 col-md-2 col-lg-1 sort_label" },
                    "店铺"
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-9 col-sm-10 col-md-10 col-lg-11 sort_by" },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "span",
                            { className: "col-sm-3" },
                            React.createElement(
                                "select",
                                { name: "item_store", className: "form-control" },
                                React.createElement(
                                    "option",
                                    { value: "" },
                                    "--请选择店铺--"
                                ),
                                storeOptions
                            )
                        )
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "sort_line row" },
                React.createElement(
                    "div",
                    { className: "col-xs-3 col-sm-2 col-md-2 col-lg-1 sort_label" },
                    "日期"
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-9 col-sm-10 col-md-10 col-lg-11 sort_by" },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "span",
                            { className: "col-sm-3" },
                            React.createElement(
                                "select",
                                { name: "quick_month", className: "form-control" },
                                React.createElement(
                                    "option",
                                    { value: "" },
                                    "--按月快速定位--"
                                ),
                                React.createElement(
                                    "option",
                                    { value: "2015-04-01/2015-04-30" },
                                    "2015/04"
                                ),
                                React.createElement(
                                    "option",
                                    { value: "2015-05-01/2015-05-31" },
                                    "2015/05"
                                ),
                                React.createElement(
                                    "option",
                                    { value: "2015-06-01/2015-06-30" },
                                    "2015/06"
                                ),
                                React.createElement(
                                    "option",
                                    { value: "2015-07-01/2015-07-31" },
                                    "2015/07"
                                ),
                                React.createElement(
                                    "option",
                                    { value: "2015-08-01/2015-08-31" },
                                    "2015/08"
                                ),
                                React.createElement(
                                    "option",
                                    { value: "2015-09-01/2015-09-30" },
                                    "2015/09"
                                ),
                                React.createElement(
                                    "option",
                                    { value: "2015-10-01/2015-10-31" },
                                    "2015/10"
                                ),
                                React.createElement(
                                    "option",
                                    { value: "2015-11-01/2015-11-30" },
                                    "2015/11"
                                ),
                                React.createElement(
                                    "option",
                                    { value: "2015-12-01/2015-12-31" },
                                    "2015/12"
                                ),
                                React.createElement(
                                    "option",
                                    { value: "2016-01-01/2016-01-31" },
                                    "2016/01"
                                ),
                                React.createElement(
                                    "option",
                                    { value: "2016-02-01/2016-02-29" },
                                    "2016/02"
                                ),
                                React.createElement(
                                    "option",
                                    { value: "2016-03-01/2016-03-31" },
                                    "2016/03"
                                )
                            )
                        ),
                        React.createElement(
                            "span",
                            { className: "col-sm-3" },
                            React.createElement("input", { className: "form-control", placeholder: "", type: "date", name: "date_begin" })
                        ),
                        React.createElement(
                            "span",
                            { className: "col-sm-3" },
                            React.createElement("input", { className: "form-control", defaultValue: "", type: "date", name: "date_end" })
                        )
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "sort_line row" },
                React.createElement(
                    "div",
                    { className: "col-xs-3 col-sm-2 col-md-2 col-lg-1 sort_label" },
                    "显示"
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-9 col-sm-10 col-md-10 col-lg-11 sort_by" },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "span",
                            { className: "col-sm-3" },
                            React.createElement(
                                "select",
                                { name: "show_type", className: "form-control" },
                                React.createElement(
                                    "option",
                                    null,
                                    "柱状图"
                                ),
                                React.createElement(
                                    "option",
                                    null,
                                    "饼状图"
                                )
                            )
                        )
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "sort_line row" },
                React.createElement(
                    "div",
                    { className: "col-xs-3 col-sm-2 col-md-2 col-lg-1 sort_label" },
                    "关键词"
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-9 col-sm-10 col-md-10 col-lg-11 sort_by" },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "span",
                            { className: "col-sm-5" },
                            React.createElement("input", { name: "keywords", type: "text", className: "form-control", placeholder: "请输入关键词" })
                        ),
                        React.createElement(
                            "span",
                            { className: "col-sm-2" },
                            React.createElement(
                                "button",
                                { onClick: this.props.onClick, className: "btn btn-primary" },
                                "搜索"
                            )
                        )
                    )
                )
            )
        );
    }
});

var DataContentCharts = React.createClass({
    displayName: "DataContentCharts",

    render: function () {
        return React.createElement(
            "div",
            { className: "echarts_container", style: { width: "100%", height: "400px" }, id: "echarts_container" },
            "charts data loading......"
        );
    }
});

var DataContentTable = React.createClass({
    displayName: "DataContentTable",

    render: function () {
        var tableData = this.props.data || [];
        var trNodes = tableData.map(function (value, key) {
            return React.createElement(
                "tr",
                { key: key },
                React.createElement(
                    "th",
                    { scope: "row" },
                    key + 1
                ),
                React.createElement(
                    "td",
                    null,
                    React.createElement("img", { src: value.item_img })
                ),
                React.createElement(
                    "td",
                    null,
                    value.item_title
                ),
                React.createElement(
                    "td",
                    null,
                    value.total
                ),
                React.createElement(
                    "td",
                    null,
                    value.num
                )
            );
        });

        return React.createElement(
            "div",
            { className: "data_table" },
            React.createElement(
                "div",
                { className: "panel panel-default" },
                React.createElement(
                    "div",
                    { className: "panel-heading table_sort_header" },
                    "销量前50名"
                ),
                React.createElement(
                    "div",
                    { className: "panel-body" },
                    React.createElement(
                        "table",
                        { className: "table table-hover" },
                        React.createElement(
                            "thead",
                            null,
                            React.createElement(
                                "tr",
                                null,
                                React.createElement(
                                    "th",
                                    null,
                                    "排序"
                                ),
                                React.createElement(
                                    "th",
                                    null,
                                    "图片"
                                ),
                                React.createElement(
                                    "th",
                                    null,
                                    "物品标题"
                                ),
                                React.createElement(
                                    "th",
                                    null,
                                    "销售总额"
                                ),
                                React.createElement(
                                    "th",
                                    null,
                                    "销量"
                                )
                            )
                        ),
                        React.createElement(
                            "tbody",
                            null,
                            trNodes
                        )
                    )
                )
            )
        );
    }
});