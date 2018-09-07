$(document).ready(function () {

    //点击登录跳转登录页
    $(".toLogin").on("click", function () {
        $.ajax({
            url: "/switch/api/logout",
            type: "post",
            dataType: "json",
            success: function (data) {
                if ("0" == data.errno) {
                }
                else {
                    alert(data.errmsg);
                }
            }
        });
        location.href = "/switch"
    });

    //修改密码
    $(".changePswd").on("click", function () {
        $(".changeBox").show();
    });
    $(".ensurePswd").on("click", function () {
        var originalPswd = $(".originalPswd").val();
        var newPswd = $(".newPswd").val();
        var ensureNewPswd = $(".ensureNewPswd").val();
        if (originalPswd == "") {
            $(".originalPswdTip").show();
        } else if (newPswd !== ensureNewPswd || newPswd == "" || ensureNewPswd == "") {
            $(".originalPswdTip").hide();
            $(".newPswdTip").show();
        } else {
            $.ajax({
                url: "/switch/api/change_pwd",
                type: "post",
                data: {
                    "password": originalPswd,
                    "new_pwd": ensureNewPswd
                },
                dataType: "json",
                success: function (data) {
                    if ("0" == data.errno) {
                        alert("修改成功")
                        location.href = "/switch"
                    }
                    else {
                        alert(data.errmsg);
                    }
                }
            });
        }
    });
    $(".cancelPswd").on("click", function () {
        $(".changeBox").hide();
    });

    //新增
    $(".newAdd").on("click", function () {
        $(".newAddBox").show();
    });
    $(".addClose").on("click", function () {
        $(".newAddBox").hide();
    });

    //刪除ID
    $(".delete").on("click", function () {
        $(".deleteList").show();
        $(".cancelDelete").show();
    });
    $("body").on("click", ".deleteList", function () {
        $(this).parent().remove();
    });
    $(".cancelDelete").on("click", function () {
        $(".deleteList").hide();
        $(".cancelDelete").hide();
    });

    //点击编辑
    var idNumber;
    var remark;
    var toUrl;
    $("body").on("click", ".redact", function () {
        //去除input的 readonly
        $(".idNumber").removeAttr("readonly");
        $(".newId").removeAttr("readonly");
        $(".remark").removeAttr("readonly");
        $(".toUrl").removeAttr("readonly");
        $(".downUrl").removeAttr("readonly");
//		$(".onOffChange").removeAttr("readonly");
//		$(".changePlatform").removeAttr("readonly");
//         $(this).parent().parent().find(".idNumber").addClass("current");
        $(this).parent().parent().find(".toUrl").addClass("current");
        $(this).parent().parent().find(".remark").addClass("current");
        $(this).parent().parent().find(".newId").addClass("current");
        $(this).parent().parent().find(".onOffChange").addClass("current");
        $(this).parent().parent().find(".changePlatform").addClass("current");
        $(this).parent().parent().find(".downUrl").addClass("current");


        $(this).parent().parent().find(".redactConfirm").show();
        // $(".redactConfirm").unbind("click");


    });
});

function load(url, data_new) {
    $.ajax({
        url: url,
        type: "post",
        data: data_new,
        dataType: "json",
        success: function (data_data) {

            if ("0" == data_data.errno) {
                $(".listContent").html("");
                // 登录成功，跳转到主页
                var new_data = data_data.data;
                for (var item in new_data) {
                    item = new_data[item];
                    var appId = item.order_id;
                    var newId = item.new_id;
                    var skipUrl = item.url;
                    var down_url = item.down_url;
                    var toComment = item.desc;
                    var radioSkip = item.jump;
                    var radioPlatform = item.platform;
                    if (radioPlatform == "1") {
                        radioPlatform = "IOS"
                    } else {
                        radioPlatform = "Android"
                    }


                    if (radioSkip) {
                        radioSkip = "开"
                    } else {
                        radioSkip = "关"
                    }
                    if (!down_url) down_url = "";
                    if (!newId) newId = "";

                    if (data_data.prv) {
                        $(".prv").attr("disabled", false)
                    } else {
                        $(".prv").attr("disabled", true)
                    }
                    if (data_data.next) {
                        $(".next").attr("disabled", false)
                    } else {
                        $(".next").attr("disabled", true)
                    }
                    $(".total_page").text(data_data.pages);
                    $(".page").text(data_data.page);
                    var count = item.request_count;
                    $(".listContent").append('<tr>' +
                        '<td><input class="idNumber" type="text" name="" value="' + appId + '" readonly="readonly"/></td>' +
                        '<td><input class="newId" type="text" name="" value="' + newId + '" readonly="readonly"/></td>' +
                        '<td><input class="toUrl" type="text" value="' + skipUrl + '" readonly="readonly"/></td>' +
                        '<td><input class="downUrl" type="text" value="' + down_url + '" readonly="readonly"/></td>' +
                        '<td><input class="onOffChange" type="text" value="' + radioSkip + '" readonly="readonly"/></td>' +
                        '<td><input class="changePlatform" type="text" value="' + radioPlatform + '" readonly="readonly" /></td>' +
                        '<td colspan="2"><input class="remark" type="text" value="' + toComment + '" readonly="readonly"/></td>' +
                        '<td><span  class="request">' + count + '</span></td><td id="delete">删除</td>' +
                        '<td class="tatd"><span class="redact">编辑</span></td><td class="deleteList"><img src="img/false.png"/></td>' +
                        '<td class="redactConfirm"><img src="img/no@2x.png"/></td></tr>');
                }
            }
            else {
                // 其他错误信息，在页面中展示
                alert(data_data.errmsg);
                if (data_data.errmsg == "用户未登陆") {
                    location.href = "/switch"
                }
            }
        }
    });
}

load("/switch/api2/orderlist");

$(document).ready(function () {
    $("body").on("click", ".redactConfirm", function () {
        $(this).hide();
        $(".idNumber").attr("readonly", "readonly");
        $(".remark").attr("readonly", "readonly");
        $(".newId").attr("readonly", "readonly");
        $(".toUrl").attr("readonly", "readonly");
        $(".downUrl").attr("readonly", "readonly");
        $(this).parent().parent().find(".toUrl").removeClass("current");
        $(this).parent().parent().find(".downUrl").removeClass("current");
        $(this).parent().parent().find(".remark").removeClass("current");
        $(this).parent().parent().find(".onOffChange").removeClass("current");
        $(this).parent().parent().find(".changePlatform").removeClass("current");
        $(this).parent().parent().find(".newId").removeClass("current");

        var appId = $(this).siblings().find(".idNumber").val();
        var new_id = $(this).siblings().find(".newId").val();
        var skipUrl = $(this).siblings().find(".toUrl").val();
        var downUrl = $(this).siblings().find(".downUrl").val();
        var toComment = $(this).siblings().find(".remark").val();
        var radioSkip = $(this).siblings().find(".onOffChange").val();
        var radioPlatform = $(this).siblings().find(".changePlatform").val();
        remark = $(".remark").val();
        toUrl = $(".toUrl").val();
        if (radioSkip == "开") {
            radioSkip = 1;
        } else {
            radioSkip = 0;
        }

        if (radioPlatform == "Android") {
            radioPlatform = 0;
        } else {
            radioPlatform = 1;
        }
        $.ajax({
            url: "/switch/api/change_order",
            type: "post",
            data: {
                "order_id": appId,
                "url": skipUrl,
                "downUrl": downUrl,
                "new_id": new_id,
                "desc": toComment,
                "jump": radioSkip,
                "platform": radioPlatform
            },
            dataType: "json",
            success: function (data) {
                if ("0" == data.errno) {
                    alert(data.errmsg);
                }
                else {
                    alert(data.errmsg);
                    if (data.errmsg == "用户未登陆") {
                        location.href = "/switch"
                    }
                }
            }
        });

    });

    //切换开关
    $("body").on("click", ".current", function () {
        var onOffChange = $(this).val();
        if (onOffChange == "开") {
            $(this).val("关");
            // onOffChange = $(".onOffChange").val();
            //				console.log(onOffChange);
        } else if (onOffChange == "关") {
            $(this).val("开");
            // onOffChange = $(".onOffChange").val();
        }


        if (onOffChange == "Android") {
            $(this).val("IOS");
            // changePlatform = $(".changePlatform").val();
            // console.log(84);
        } else if (onOffChange == "IOS") {
            $(this).val("Android");
            // changePlatform = $(".changePlatform").val();
        }
    });

    $(".prv").on("click", function () {
        var text = $(".seachTxt").val();
        if (text) {
            load("/switch/api2/query_all", {
                "page_index": parseInt($(".page").text()) - 1,
                "order_id": text
            });
        } else {
            // load("/switch/api2/orderlist", {
            //     "page_index": 1
            // });
            load("/switch/api2/orderlist", {
                "page_index": parseInt($(".page").text()) - 1
            });
        }


        // load("/switch/api2/orderlist", {
        //     "page_index": parseInt($(".page").text()) - 1
        // });
    });
    $(".next").on("click", function () {
        var text = $(".seachTxt").val();
        if (text) {
            load("/switch/api2/query_all", {
                "page_index": parseInt($(".page").text()) + 1,
                "order_id": text
            });
        } else {
            load("/switch/api2/orderlist", {
                "page_index": parseInt($(".page").text()) + 1
            });
        }

        // load("/switch/api2/orderlist", {
        //     "page_index": parseInt($(".page").text()) + 1
        // });
        console.log($(".page").text())
    });
//新增ID
    $(".addBtn").on("click", function () {
        var appId = $(".appId").val();
        var skipUrl = $(".skipUrl").val();
        var downUrl = $(".addDownUrl").val();
        var toComment = $(".toComment").val();
        var radioSkip = $('.radioSkip[name="skip"]:checked ').val();
        var radioPlatform = $('.radioPlatform[name="platform"]:checked ').val();
        if (appId == "" || skipUrl == "" || toComment == "" || radioSkip == "" || radioPlatform == "") {
            alert("参数不完整")
        }
        if (radioSkip == "开") {
            radioSkip = 1;
        } else {
            radioSkip = 0;
        }


        if (radioPlatform == "Android") {
            radioPlatform = 0;
        } else {
            radioPlatform = 1;
        }


        $.ajax({
            url: "/switch/api/add_order",
            type: "post",
            data: {
                "order_id": appId,
                "url": skipUrl,
                "downurl": downUrl,
                "desc": toComment,
                "jump": radioSkip,
                "platform": radioPlatform
            },
            dataType: "json",
            success: function (data) {
                if ("0" == data.errno) {
                    load("/switch/api2/orderlist");
                    $(".newAddBox").hide();
                    alert(data.errmsg);
                }
                else {
                    // 其他错误信息，在页面中展示
                    alert(data.errmsg);
                    if (data.errmsg == "用户未登陆") {
                        location.href = "/switch"
                    }
                }
            }
        });

    });

    // 搜索查询
    $('.seachBtn').click(function () {
        var text = $(".seachTxt").val();
        if (text) {
            load("/switch/api2/query_all", {
                "page_index": 1,
                "order_id": text
            });
        } else {
            load("/switch/api2/orderlist", {
                "page_index": 1
            });
        }
    });

    // 删除全部
    $("#dele_all").click(function () {

        $(".listContent .idNumber").each(function () {
            $.ajax({
                url: "/switch/api/delete_order",
                type: "post",
                data: {
                    "order_id": $(this).val()
                },
                dataType: "json",
                success: function (data) {
                    if ("0" == data.errno) {
                        // $_ul.parent().parent().remove();
                    }
                    else {
                        alert(data.errmsg);
                    }
                }
            });
        }).parent().parent().hide()
    });
    $("body").on("click", "#delete", function () {
        if (window.confirm("确定删除吗?")) {
            var $delete = $(this);
            var orderid = $delete.siblings().find(".idNumber").val();
            $.ajax({
                url: "/switch/api/delete_order",
                type: "post",
                data: {
                    "order_id": orderid
                },
                dataType: "json",
                success: function (data) {
                    if ("0" == data.errno) {
                        // $_ul.parent().parent().remove();
                        $delete.parent().remove()
                    }
                    else {
                        alert(data.errmsg);
                        if (data.errmsg == "用户未登陆") {
                            location.href = "/switch"
                        }
                    }
                }
            });
        }
    });

    // 批量跳转
    $("#btn_skip").click(function () {
        var str_skip_list = $("#ipt_skip_list").val();
        var str_skip_url = $("#ipt_skip_url").val();
        if (str_skip_list == "" || str_skip_url == "") {
            alert("参数不完整");
            return
        }
        $.ajax({
            url: "/switch/api/change_skip_list",
            type: "post",
            data: {
                "order_id_list": str_skip_list,
                "skip_url": str_skip_url
            },
            dataType: "json",
            success: function (data) {
                if ("0" == data.errno) {
                    // $_ul.parent().parent().remove();
                    location.reload()
                }
                else {
                    alert(data.errmsg);
                    if (data.errmsg == "用户未登陆") {
                        location.href = "/switch"
                    }
                }
            }
        });
    });

    $("#btn_stop_skip").click(function () {
        var str_stop_list = $("#ipt_stop_list").val();
        $.ajax({
            url: "/switch/api/stop_skip_list",
            type: "post",
            data: {
                "order_id_list": str_stop_list
            },
            dataType: "json",
            success: function (data) {
                if ("0" == data.errno) {
                    // $_ul.parent().parent().remove();
                    location.reload()
                }
                else {
                    alert(data.errmsg);
                    if (data.errmsg == "用户未登陆") {
                        location.href = "/switch"
                    }
                }
            }
        });
    });

    $("#btn_open_skip").click(function () {
        var str_stop_list = $("#ipt_stop_list").val();
        $.ajax({
            url: "/switch/api/open_skip_list",
            type: "post",
            data: {
                "order_id_list": str_stop_list
            },
            dataType: "json",
            success: function (data) {
                if ("0" == data.errno) {
                    // $_ul.parent().parent().remove();
                    location.reload()

                }
                else {
                    alert(data.errmsg);
                    if (data.errmsg == "用户未登陆") {
                        location.href = "/switch"
                    }
                }
            }
        });
    });


    $("#btn_splash_url").click(function () {
        var splash_url = $("#ipt_splash_url").val();
        $.ajax({
            url: "/switch/api/change_splash_url",
            type: "post",
            data: {
                "splash_url": splash_url
            },
            dataType: "json",
            success: function (data) {
                if ("0" == data.errno) {
                    // $_ul.parent().parent().remove();
                    // location.reload();
                    alert(data.errmsg)
                } else {
                    alert(data.errmsg);
                    if (data.errmsg == "用户未登陆") {
                        location.href = "/switch"
                    }
                }
            }
        });
    });
    $("#btn_auto_start").click(function () {
        var auto_ids = $("#ipt_auto_ids").val();
        var auto_url = $("#ipt_auto_url").val();
        var auto_time = $("#ipt_auto_time").val();


        $.ajax({
            url: "/switch/api/timer_change_url",
            type: "post",
            data: {
                "auto_ids": auto_ids,
                "auto_time": auto_time,
                "auto_url": auto_url
            },
            dataType: "json",
            success: function (data) {
                if ("0" == data.errno) {
                    // $_ul.parent().parent().remove();
                    alert(data.errmsg);
                    // location.reload();
                } else {
                    alert(data.errmsg);
                    if (data.errmsg == "用户未登陆") {
                        location.href = "/switch"
                    }
                }
            }
        });
    });

    $("#btn_auto_stop").click(function () {
        $.ajax({
            url: "/switch/api/cancel_change_url",
            type: "post",
            data: {},
            dataType: "json",
            success: function (data) {
                if ("0" == data.errno) {
                    // $_ul.parent().parent().remove();
                    // location.reload();
                    alert(data.errmsg)
                } else {
                    alert(data.errmsg);
                    if (data.errmsg == "用户未登陆") {
                        location.href = "/switch"
                    }
                }
            }
        });
    });


    $("#test_auto").click(function () {
        $.ajax({
            url: "/switch/api/test_auto",
            type: "post",
            data: {},
            dataType: "json",
            success: function (data) {
                if ("0" == data.errno) {
                    alert(data.errmsg)
                } else {
                    alert(data.errmsg);
                    if (data.errmsg == "用户未登陆") {
                        location.href = "/switch"
                    }
                }
            }
        });
    });


    $("#open_auto").click(function () {
        $.ajax({
            url: "/switch/api/open_auto",
            type: "post",
            data: {},
            dataType: "json",
            success: function (data) {
                if ("0" == data.errno) {
                    alert(data.errmsg)
                } else {
                    alert(data.errmsg);
                    if (data.errmsg == "用户未登陆") {
                        location.href = "/switch"
                    }
                }
            }
        });
    });

    $("#close_auto").click(function () {
        $.ajax({
            url: "/switch/api/close_auto",
            type: "post",
            data: {},
            dataType: "json",
            success: function (data) {
                if ("0" == data.errno) {
                    alert(data.errmsg)
                } else {
                    alert(data.errmsg);
                    if (data.errmsg == "用户未登陆") {
                        location.href = "/switch"
                    }
                }
            }
        });
    });

    $("#open_all_auto").click(function () {
        $.ajax({
            url: "/switch/api/open_all_auto",
            type: "post",
            data: {},
            dataType: "json",
            success: function (data) {
                if ("0" == data.errno) {
                    alert(data.errmsg);
                    load("/switch/api2/orderlist");
                } else {
                    alert(data.errmsg);
                    if (data.errmsg == "用户未登陆") {
                        location.href = "/switch"
                    }
                }
            }
        });
    });

    $("#close_all_auto").click(function () {
        $.ajax({
            url: "/switch/api/close_all_auto",
            type: "post",
            data: {},
            dataType: "json",
            success: function (data) {
                if ("0" == data.errno) {
                    alert(data.errmsg);
                    load("/switch/api2/orderlist");
                } else {
                    alert(data.errmsg);
                    if (data.errmsg == "用户未登陆") {
                        location.href = "/switch"
                    }
                }
            }
        });
    });



    $("#btn_manager_close").click(function () {
        var ids = $("#ipt_manager").val();
        $.ajax({
           url: "/switch/api/manager",
            type: "post",
            data: {
               "manager_ids":ids,
                "manager_model":0
            },
            dataType: "json",
            success: function (data) {
                if ("0" == data.errno) {
                    alert(data.errmsg)
                } else {
                    alert(data.errmsg);
                    if (data.errmsg == "用户未登陆") {
                        location.href = "/switch"
                    }
                }
            }
        });
    });

     $("#btn_manager_open").click(function () {
        var ids = $("#ipt_manager").val();
        $.ajax({
           url: "/switch/api/manager",
            type: "post",
            data: {
               "manager_ids":ids,
                "manager_model":1
            },
            dataType: "json",
            success: function (data) {
                if ("0" == data.errno) {
                    alert(data.errmsg)
                } else {
                    alert(data.errmsg);
                    if (data.errmsg == "用户未登陆") {
                        location.href = "/switch"
                    }
                }
            }
        });
    });

      $("#btn_manager_ignore").click(function () {
        var ids = $("#ipt_manager").val();
        $.ajax({
           url: "/switch/api/manager",
            type: "post",
            data: {
               "manager_ids":ids,
                "manager_model":2
            },
            dataType: "json",
            success: function (data) {
                if ("0" == data.errno) {
                    alert(data.errmsg)
                } else {
                    alert(data.errmsg);
                    if (data.errmsg == "用户未登陆") {
                        location.href = "/switch"
                    }
                }
            }
        });
    });


});