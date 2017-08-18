// 引入所需模块
var fs = require('fs');
var url = require('url');
var path = require('path');
var http = require('http');
var xlsx = require('node-xlsx');

// 解析当前目录
var root = path.resolve('.');
console.log('Static root dir: ' + root);

// 创建服务器
var server = http.createServer(function(request, response) {

    // 获得URL的path
    var pathname = url.parse(request.url).pathname;

    // 获得对应的本地文件路径
    var filepath = path.join(root, pathname + '.xlsx');

    // 获取文件状态
    fs.stat(filepath, function(err, stats) {

        // 如果没有出错且文件存在
        if(!err && stats.isFile()) {
            console.log('200 ' + request.url);

            // 解析xlsx文件
            var xlsx_arr = xlsx.parse(filepath);
            var xlsx_data = JSON.stringify(xlsx_arr[0]);

            // 设置Access-Control-Allow-Origin
            response.setHeader('Access-Control-Allow-Origin', '*');

            // 将HTTP响应200写入response, 同时设置Content-Type: application/json
            response.writeHead(200, { 'Content-type': 'application/json' });

            // 将解析的xlsx数据写入response
            response.end(xlsx_data);

        } else {
            console.log('400 ' + request.url);
            response.writeHead(404);
            response.end('404 Not Found');
        }
    })
})

// 服务器监听
server.listen(8080, '192.168.1.60');

console.log('Server is running at http://192.168.1.60:8080');