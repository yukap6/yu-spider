/**
 * Created by jingweirong on 16/4/14.
 */
var appDebug = 3; //1 mockData; 2 remote dev; 3 product
var quilt = quilt || {
        lsGet: function (name) {
            return JSON.parse(localStorage.getItem(name));
        },
        lsSet: function (name, obj) {
            localStorage.setItem(name, JSON.stringify(obj));
        },
        initConfigFun: function () {
            var conUrl;
            if (appDebug == 1) {
                conUrl = './qtFrame/config/configMock.json';
            } else if (appDebug == 2){
                conUrl = './qtFrame/config/configLocal.json';
            }else if (appDebug == 3){
                conUrl = './qtFrame/config/configServer.json';
            }
            $.ajax({
                url: conUrl,
                type: 'get',
                cache: false,
                dataType: "json",
                success: function (res) {
                    this.lsSet("url", res);
                }.bind(this),
                error: function (res) {
                    console.log("res", res);
                }
            });
        },
        post: function (url, data, successFun, errorFun) {
            $.ajax({
                url: url,
                type: "post",
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                data: data || {},
                success: function (res) {
                    if ("10000" != res.code) {
                        if (errorFun) {
                            errorFun(res)
                        }
                    } else {
                        successFun(res)
                    }
                },
                error: function (res) {
                    if (errorFun) {
                        errorFun(res)
                    } else {
                        //alert("接口查询返回失败");
                    }
                }
            })
        },
        get: function (url, data, successFun, errorFun) {
            $.ajax({
                url: url,
                type: "get",
                dataType: "json",
                xhrFields: {
                    withCredentials: false
                },
                data: data || {},
                success: function (res) {
                    if ("10000" != res.code) {
                        if (errorFun) {
                            errorFun(res)
                        } else {
                            alert(res.msg);
                        }
                    } else {
                        if (successFun) {
                            successFun(res)
                        }
                    }
                },
                error: function (res) {
                    if (errorFun) {
                        errorFun(res)
                    } else {
                        //alert("接口返回失败");
                    }
                }
            })
        },
        alertTop: function(msg, type, time){
            if(!msg)return;
            time = time || 2000;
            var defaultAlertClass = "alert-warning";
            switch(type){
                case "warning":
                    break;
                case "error":
                    defaultAlertClass = "alert-danger";
                    break;
                case "success":
                    defaultAlertClass = "alert-success";
                    break;
                default:
                    //nothing
                    ;
            }
            var alertId = "commonJsAlertId_"+ Date.parse(new Date());
            var alertDom = '<div role="alert" id="'+alertId+'" class="alert '+defaultAlertClass+' alert-dismissible fade in com_no_interrupt_tips_com">' +
                '<button aria-label="Close" data-dismiss="alert" class="close" type="button"><span aria-hidden="true">×</span></button>' +
                '<strong class="noInterruptTipsContent" >'+msg+'</strong>' +
                '</div>';
            $("body").append(alertDom);
            setTimeout(function(){
                $("#"+alertId+"").remove();
            }, time);
        },
        setCookie: function(name, value){
            //arguments[2]: expires, default 3600000;
            //arguments[3]: path, default /;
            var exp = new Date();
            exp.setTime(exp.getTime() + (arguments[2]?arguments[2]:3600000) );
            var path = arguments[3]?arguments[3]:"/";
            document.cookie = name + "=" + value + ";expires=" + exp.toGMTString() + ";path=" + path;
        },
        getCookie: function(name){
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg))
                return decodeURI(arr[2]);
            else
                return null;
        },
        delCookie: function(name){
            //arguments[1]: path, default /;
            var path = arguments[1]?arguments[1]:"/";
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval=this.getCookie(name);
            if(cval!=null){
                document.cookie= name + "="+cval+";expires="+exp.toGMTString() + ";path="+ path +";";
            }
        }

    };
/*init config*/
//if (!localStorage.getItem("url")) {
//commonJs.initConfigFun();
//}

//communication between two components
var  eventsEmitter = {
    _events: {},
    dispatch: function(event, data){
        if(!this._events[event]){
            return;
        }
        for(var i=0; i<this._events[event].length; i++){
            this._events[event][i](data);
        }
    },
    subscribe: function(event, callback){
        if(!this._events[event]){
            this._events[event] = [];
        }
        this._events[event].push(callback);
    },
    remove: function(event, callback){
        if(!this._events[event]){
            return;
        }
        var index = this._events[event].indexOf(callback);
        if( index != "-1"){
            this._events[event].splice(index, 1);
        }
    }
};
