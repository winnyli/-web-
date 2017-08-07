(function ($, win, doc) {
    var CityPicker = function (el, options) {
        this.urlOrData = './citydata.json',
        this.el = $(el);
        this.options = options;
        this.pro = null;
        this.city = null;
        this.elType = this.el.is('input');

        this.init();
    };

    var p = CityPicker.prototype;

    p.init = function () {
        this.loadData();
        this.initEvent();
        this.preventPopKeyboard();

    };
    var provinces,citys,areas;
    p.loadData=function () {
        
        if (typeof this.urlOrData == 'string') {
            $.ajax({
                type: 'GET',
                url: this.urlOrData,
                dataType: 'json',
                success: function (data) {
                    provinces = data.provinces;
                    citys = data.citys;
                    areas = data.areas;
                },
                error: function (xhr, status, msg) {

                }
            });
        }
        else {
            var data = this.urlOrData;
                provinces = data.provinces;
                citys = data.citys;
                areas = data.areas;
        }
    },
    p.preventPopKeyboard = function () {
        if (this.elType) {
            this.el.prop("readonly", true);
        }
    };

    p.initEvent = function () {
        this.el.on("click", function (e) {
            var pickerBox = $("#wrapper");
            if (pickerBox[0]) {
                pickerBox.show();
            } else {
                this.create();
            }
        }.bind(this));        
    };

    p.create = function () {
        this.createCityPickerBox();
        this.createProList();
        this.proClick();
//        this.createNavBar();
//        this.navEvent();
    };

    p.createCityPickerBox = function () {
        var proBox = "<div id='wrapper'></div>";
        $("body").append(proBox);
    };

    p.createProList = function () {

        var lettersCollection = {};
        var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var arr = str.split("");
        arr.forEach(function(arrItem,j){
            lettersCollection[arrItem] = []
        })
        provinces.forEach(function(province,i){
            arr.forEach(function(arrItem,j){
                if (province.letter == arrItem) {
                    lettersCollection[arrItem].push(province)
                }
            })
        })

        var proBox;
        var dl = "";
        for(var letterKey in lettersCollection) {
            var val = lettersCollection[letterKey];
            if (lettersCollection.hasOwnProperty(letterKey) && lettersCollection[letterKey].length != 0) {
                var dt = "<dt id='" + letterKey + "'>" + letterKey + "</dt>";
                var dd = "";
                val.forEach(function(item,i){
                    if (item.hasOwnProperty("n")){
                        dd += "<dd data-letter=" + letterKey + " data-code=" + item["c"] + ">" + item["n"].trim() + "</dd>";                    
                    }                
                })
                dl += "<dl>" + dt + dd + "</dl>";
            }

        }

        proBox = "<section id='scroller'>" + dl + "</section>";
        $("#wrapper").append(proBox);

    };

    p.createCityList = function (code, pro) {
        var ul, li = "";
        var data = [];
        citys.forEach(function(city,i){
            if (city.pc == code) {
                data.push(city);
            }
        })
        data.forEach(function(item,i){
            li += "<li data-code=" + item["c"] + ">" + item["n"].trim() + "</li>";
        })
        ul = "<ul class='city-picker'>" + li + "</ul>";
        $("#wrapper").find(".city-picker").remove().end().append(ul);
        this.cityClick();
    };

    p.createAreaList = function (code, city) {
        var data = [];
        var ul,li=""
        areas.forEach(function(area,i){
            if (area.cc == code) {
                data.push(area)
            }
        })
        data.forEach(function(item,i){
            li += "<li>" + item["n"].trim() + "</li>";
        })
        ul = "<ul class='city-picker'>" + li + "</ul>";
        $("#wrapper").find(".city-picker").remove().end().append(ul);
        this.areaClick();
    };


    p.proClick = function () {
        var that = this;
        $("#scroller").on("click", function (e) {
            var target = e.target;
            if ($(target).is("dd")) {
                that.pro = $(target).html();
                var code = $(target).data("code");
                that.createCityList(code, that.pro);

                $(this).hide();
            }
        });
    };

    p.cityClick = function () {
        var that = this;
        $(".city-picker").on("click", function (e) {
            var target = e.target;
            if ($(target).is("li")) {
                that.city = $(target).html();
                var code = $(target).data("code");
                that.createAreaList(code, that.city);

                $(this).hide();
            }
        });
    };
    p.areaClick = function () {
        var that = this;
        $(".city-picker").on("click", function (e) {
            var target = e.target;
            if ($(target).is("li")) {
                that.area = $(target).html();
                address = that.pro.trim() + "-" + that.city.trim()+ "-" + that.area.trim()                
                if (that.elType) {
                    that.el.val(address);
                } else {
                    that.el.html(address);
                }

                $("#wrapper").hide();
                $("#scroller").show();
                $(this).hide();
            }
        });
    };

    $.fn.CityPicker = function (options) {
        return new CityPicker(this, options);
    }
}(window.jQuery, window, document));