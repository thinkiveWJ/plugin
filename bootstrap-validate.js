(function(global, factory, plugin){
    factory.call(global, global.jQuery, plugin);
})(typeof window === "undefined" ? this : window, function($, plugin){
    // 默认配置
    var __DEFAULTS__ = {
        raise: "keyup",
        prefix: "bv-",
        errorMsg: "* 您输入的内容不合法"
    };

    // 默认规则
    var __RULES__ = {
        require: function(){
            return !!this.val();
        },
        number: function(){
            return !isNaN($this.val());
        },
        interger: function(){
            return /^[0-9]+$/.test(this.val());
        },
        email: function(){
            return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(this.val());
        },
        length: function(){
            return this.val() === Number(this.data(__DEFAULTS__['prefix']+"length"));
        },
        regex: function(){
            return new RegExp(this.data(__DEFAULTS__['prefix']+"regex")).test(this.val());
        }
    };

    // 调用去校验表单
    $.fn[plugin] = function(options){
        // 判断是否为表单
        if(this.is("form")){
            // 扩展默认值
            $.extend(this, __DEFAULTS__, options);
            var that = this;
            var $fields  = $(this).find("input, textarea, select").not("[type=submit], [type=button], [type=reset]")
            // 当触发定义的事件时候开始校验
            $fields.on(this.raise, function(){
                // 被校验的元素
                $field = $(this);

                var $group = $(this).parents(".form-group:first");
                // 去除样式
                $group.removeClass("has-error has-success");
                // 去除错误信息提示
                $group.find(".help-block").remove();

                // 默认校验不通过
                var result = false;
                // 定义错误信息
                var msg = '';
                $.each(__RULES__, function(rule, active){
                    // console.log(rule+"=>"+active);
                    if($field.data(that.prefix+rule)){
                        result = active.call($field);
                        if(!result){
                            msg = $field.data(that.prefix+rule+"msg") || that.errorMsg;
                            // 校验失败
                            $group.addClass("has-error");
                            $field.after("<span class='help-block'>"+that.errorMsg+"</psan>");
                            return false;
                        }else{
                            // 校验通过
                            $group.addClass("has-success");
                        }
                    }
                });
            });
            // 扩展自定义校验规则
            this.extendRule = $.fn[plugin].extendRule;
            return this;
        }else{
            throw new Error("目标非表单元素");
        }
    };
    // 自定义校验规则
    $.fn[plugin].extendRule = function(rules){
        $.extend(__RULES__, rules);
    };
}, "bootstrapValidate");