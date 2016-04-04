/**
 * Created by jingweirong on 16/2/17.
 */

/*common js location reset fun*/
var redirect = function (url) {
    window.location.href = url;
}

/*get localStorage json object*/
var lsGet = function (name) {
    return JSON.parse(localStorage.getItem(name));
}

/*set json object to localStorage*/
var lsSet = function (name, obj) {
    localStorage.setItem(name, JSON.stringify(obj));
}

/*month number 1-12 to CN 1-12*/
var monthNumToChina = function (num) {
    var r = "一";
    switch (parseInt(num)) {
        case 1:
            r = "一";
            break;
        case 2:
            r = "二";
            break;
        case 3:
            r = "三";
            break;
        case 4:
            r = "四";
            break;
        case 5:
            r = "五";
            break;
        case 6:
            r = "六";
            break;
        case 7:
            r = "七";
            break;
        case 8:
            r = "八";
            break;
        case 9:
            r = "九";
            break;
        case 10:
            r = "十";
            break;
        case 11:
            r = "十一";
            break;
        case 12:
            r = "十二";
            break;
    }
    return r;
}

/*
 * act: check a number is mobile pattern for CN mobile number
 * params: number[string or number]
 * return: true/false
 * */
var isMobileNumCN = function (num) {
    num = num.replace(/\s+/g, "");
    var r = false;
    var rep = /^1\d{10}$/;
    if (rep.test(num)) {
        r = true;
    }
    return r;
}

/*act: check phone for this system
 * params: number[string]
 * return: {isOk:true/false, tips:""}
 * */
var sysPhoneNumCheck = function (phone) {
    var r = {
        isOk: true,
        tips: ""
    };
    if (phone == "") {
        r.isOk = false;
        r.tips = "手机号码不能为空";
    } else if (!isMobileNumCN(phone)) {
        r.isOk = false;
        r.tips = "手机号码格式错误";
    }
    return r;
}

var quilt = quilt || {
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
                withCredentials: true
            },
            data: data || {},
            success: function (res) {
                if ("10000" != res.rtnCode) {
                    if (errorFun) {
                        errorFun(res)
                    } else {
                        alert(res.msg);
                    }
                } else {
                    if (successFun) {
                        successFun(res.bizData)
                    }
                }
            },
            error: function (res) {
                if (errorFun) {
                    errorFun(res)
                } else {

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
    }
};




