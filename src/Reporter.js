 function Reporter (config) {

    this.config=config;

    this.submit_log=[];



    this.push=function(){

    }
    // item={
    //     type:'performance/error/api/resource'
    //     data
    // }

    this.submit=function(data){
        var xhr = new XMLHttpRequest();
        //设置请求的类型及url
        //post请求一定要添加请求头才行不然会报错
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.open('post', config.url);
        //发送请求
        xhr.send(data);
        xhr.onreadystatechange = function () {
            // 这步为判断服务器是否正确响应
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.responseText);
            }
        };
    }
}


export default Reporter;