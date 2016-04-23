/**
 * Created by jingweirong on 16/4/4.
 */
var LeftMenuContainer = React.createClass({
    render: function(){
        return (
            <section>
                <section className="com_logo">
                    <span className="big_words">Q</span>uilt Data
                </section>
                <section className="com_menu">
                    <ul className="com_leftmenu_ul">
                        <li className="menu_main menu_active">
                            <div className="menu_first">
                                <i className="glyphicon glyphicon-cloud pull-left"></i>
                                <h4 className="pull-left">概况分析</h4>
                                <i className="pull-right glyphicon glyphicon-menu-down"></i>
                            </div>
                            <ul className="sub_menu">
                                <li className="sub_active">销量分析</li>
                                <li>用户分析</li>
                                <li>环比分析</li>
                                <li>主线分析</li>
                            </ul>
                        </li>
                        <li className="menu_main">
                            <div className="menu_first">
                                <i className="glyphicon glyphicon-cog pull-left"></i>
                                <h4 className="pull-left">基础分析</h4>
                                <i className="pull-right glyphicon glyphicon-menu-right"></i>
                            </div>
                        </li>
                        <li className="menu_main">
                            <div className="menu_first">
                                <i className="glyphicon glyphicon-search pull-left"></i>
                                <h4 className="pull-left">业务分析</h4>
                                <i className="pull-right glyphicon glyphicon-menu-right"></i>
                            </div>
                        </li>
                    </ul>
                </section>
            </section>
        );
    }
});

var TopBarBox = React.createClass({
    render: function(){
        return (
            <div className="row">
                <div className="col-sm-4 com_header_block_des">
                    Quilt data collect |
                </div>
                <div className="col-sm-8 com_rh_user">
                    <div className="dropdown pull-right com_header_menu btn-group" role="presentation">
                        <a aria-expanded="false" aria-haspopup="true" role="button" data-toggle="dropdown" className="dropdown-toggle" href="#" id="drop2">
                            admin
                            <span className="caret"></span>
                        </a>
                        <ul aria-labelledby="drop2" className="dropdown-menu">
                            <li><a href="#">login out</a></li>
                            <li><a href="#">switch roles</a></li>
                            <li className="divider" role="separator"></li>
                            <li><a href="#">user center</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
});

var urlObj = {
    "sortInit":"/home/index/sortinit",
    "getStoreData": "/home/index/getalldata"
};

var data = [];
data["charts"] = [];
data["sort"] = [];
data["table"] = [];

var DataContentContainer = React.createClass({
    getInitialState: function(){
        return {data: data};
    },
    componentDidMount: function(){
        //init sort
        this.getStoreSets();
        //charts init
        this.setChartsData();
    },
    searchHandler: function(){
        var url = urlObj.getStoreData;
        var params = {"item_store":$("[name=item_store]").val()};
        if(!params.item_store){
            quilt.alertTop("请您先选择店铺");
            return;
        }
        if($("[name=date_begin]").val() && $("[name=date_end]").val()){
            params.item_datebegin = $("[name=date_begin]").val();
            params.item_dateend = $("[name=date_end]").val();
        }else{
            var quickTime = $("[name=quick_month]").val();
            if(quickTime){
                params.item_datebegin = quickTime.split("/")[0];
                params.item_dateend = quickTime.split("/")[1];
            }
        }
        if(!params.item_datebegin || !params.item_dateend){
            quilt.alertTop("请您先选择起始日期");
            return;
        }
        quilt.post(url, params, function(res){
            this.setChartsData(res.chartsData);
            data["table"] = res.tableData;
            this.setState({data: data});
        }.bind(this), function(){res}.bind(this));
    },
    setChartsData: function(chartsData){
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echarts_container'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '销量前十的quilt名单'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };
        if(chartsData){
            option.xAxis.data = [];
            option.series[0].data = [];
            for(var key in chartsData){
                var item = chartsData[key];
                option.xAxis.data.push(item.item_title.substr(0, 5));
                option.series[0].data.push(item.num);
            }
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },
    getStoreSets: function(){
        var url = urlObj.sortInit;
        var params = {};
        quilt.post(url, params, function(res){
            data["sort"]["stores"] = res.data;
            this.setState({data: data});
        }.bind(this), function(){res}.bind(this));
    },
    render: function(){
        return (
            <div>
                <DataContentSort data={this.state.data.sort} onClick={this.searchHandler} />
                <div className="data_container">
                    <DataContentCharts />
                    <DataContentTable data={this.state.data.table} />
                </div>
            </div>
        );
    }
});

var DataContentSort = React.createClass({
    render: function(){
        var stores = this.props.data["stores"] || [];
        var storeOptions = stores.map(function(value, key){
            return (
                <option key={key}  value={value.item_store}>{value.item_store}</option>
            );
        });
        return (
            <div className="sort">
                <div className="sort_line row">
                    <div className="col-xs-3 col-sm-2 col-md-2 col-lg-1 sort_label">店铺</div>
                    <div className="col-xs-9 col-sm-10 col-md-10 col-lg-11 sort_by">
                        <div className="row">
                            <span className="col-sm-3">
                                <select name="item_store"  className="form-control">
                                    <option value="">--请选择店铺--</option>
                                    {storeOptions}
                                </select>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="sort_line row">
                    <div className="col-xs-3 col-sm-2 col-md-2 col-lg-1 sort_label">日期</div>
                    <div className="col-xs-9 col-sm-10 col-md-10 col-lg-11 sort_by">
                        <div className="row">
                            <span className="col-sm-3">
                                <select  name="quick_month" className="form-control">
                                    <option value="">--按月快速定位--</option>
                                    <option value="2015-05-01/2015-05-31">2015/05</option>
                                    <option value="2015-06-01/2015-06-30">2015/06</option>
                                    <option value="2015-07-01/2015-07-31">2015/07</option>
                                    <option value="2015-08-01/2015-08-31">2015/08</option>
                                    <option value="2015-09-01/2015-09-30">2015/09</option>
                                    <option value="2015-10-01/2015-10-31">2015/10</option>
                                    <option value="2015-11-01/2015-11-30">2015/11</option>
                                    <option value="2015-12-01/2015-12-31">2015/12</option>
                                    <option value="2016-01-01/2016-01-31">2016/01</option>
                                    <option value="2016-02-01/2016-02-29">2016/02</option>
                                    <option value="2016-03-01/2016-03-31">2016/03</option>
                                    <option value="2016-04-01/2016-04-30">2016/04</option>
                                </select>
                            </span>
                            <span className="col-sm-3">
                                <input className="form-control" placeholder="" type="date" name="date_begin" />
                            </span>
                            <span className="col-sm-3">
                                <input className="form-control" defaultValue="" type="date" name="date_end" />
                            </span>
                        </div>
                    </div>
                </div>
                <div className="sort_line row">
                    <div className="col-xs-3 col-sm-2 col-md-2 col-lg-1 sort_label">显示</div>
                    <div className="col-xs-9 col-sm-10 col-md-10 col-lg-11 sort_by">
                        <div className="row">
                            <span className="col-sm-3">
                                <select name="show_type" className="form-control">
                                    <option>柱状图</option>
                                    <option>饼状图</option>
                                </select>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="sort_line row">
                    <div className="col-xs-3 col-sm-2 col-md-2 col-lg-1 sort_label">关键词</div>
                    <div className="col-xs-9 col-sm-10 col-md-10 col-lg-11 sort_by">
                        <div className="row">
                            <span className="col-sm-5">
                                <input name="keywords" type="text" className="form-control" placeholder="请输入关键词" />
                            </span>
                            <span className="col-sm-2">
                                <button onClick={this.props.onClick} className="btn btn-primary">搜索</button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var DataContentCharts = React.createClass({
    render: function(){
        return (
            <div className="echarts_container" style={{width:"100%",height:"400px"}} id="echarts_container">
                charts data loading......
            </div>
        );
    }
});

var DataContentTable = React.createClass({
    render: function(){
        var tableData = this.props.data || [];
        var trNodes = tableData.map(function(value, key){
            return (
                <tr key={key}>
                    <th scope="row">{key + 1}</th>
                    <td><img src={value.item_img} /></td>
                    <td>{value.item_title}</td>
                    <td>{value.total}</td>
                    <td>{value.num}</td>
                </tr>
            );
        });

        return (
            <div className="data_table">
                <div className="panel panel-default">
                    <div className="panel-heading table_sort_header">销量前50名</div>
                    <div className="panel-body">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th>排序</th>
                                <th>图片</th>
                                <th>物品标题</th>
                                <th>销售总额</th>
                                <th>销量</th>
                            </tr>
                            </thead>
                            <tbody>
                            {trNodes}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
});
