var download = new function(){
    this.download_start = function(){
        var package_list = [];
        $('.custom-control-input-item').filter(function(){
            return $(this).prop('checked');}).each(function(){
                package_list.push($(this).attr('id'));});
        download.socket.emit("download", {"list":package_list});
        download.socket.on("download_step", function(data){
            console.log(data);
            download.log_start(data);
        });
    };
    this.log_start = function(data){
        var tr = $("#apk_table tbody tr");
        
        var i = 0;
        for(i = 0;i<tr.length;i++){
            var input = $("#apk_table tbody tr input");
            var package_name = input.attr('id');
            if(package_name == data.package){
                break;
            }
        }
        if(data.step == "start"){
            tr[i].children[5].innerText = "DOWN_START";
        }else if(data.step == "finish"){
            tr[i].children[5].innerText = "DOWN_FINISH";
        }else if(data.step == "check"){
            tr[i].children[5].innerText = "SDK_CHECK";
        }else if(data.step == "result"){
            if(data.sdk){
                tr[i].children[5].innerText = "SDK_EXIST";
            }else{
                tr[i].children[5].innerText = "SDK_NOT_EXIST";
            }
        }
    }
    this.open_google_login = function(){
        $("#loginModal").attr("aria-hidden", false);
        $("#loginModal").modal();
    }
    this.google_login = function(id, pw){
        $.ajax({
            url:'/google_login',
            type:'POST',
            data: {'id':id,'pw':pw},
            success:function(res){
                if(res.result == "success"){
                    $("#login_alert").html("<p class=\"text-success\">Login success!</p>");
                    $("#loginModal").attr("aria-hidden", true);
                    $("#loginModal").modal("hide");
                    $("#login_alert").attr("aria-hidden", true);
                    download.download_start();
                }else{
                    $("#inputPassword").val("");
                    $("#login_alert").html("<p class=\"text-danger\">Login fail!</p><p class=\"text-info\"><a href=\"https://accounts.google.com/b/0/DisplayUnlockCaptcha\">Unlock Google Account</p>");
                    $("#login_alert").attr("aria-hidden", false);
                }
            }
        });
    }
}
