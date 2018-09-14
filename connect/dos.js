var http = require('http')
var req = http.request({
    method: 'POST',
    port: 3000,
    headers: {
      'Content-Type': 'application/json'
    } 
})
req.write('[')  //开始发送一个超大的数组对象
var n = 300
while (n--) {
  req.write('"foo",')  //数组中包含300,000个字符串“foo”
}
req.write('"bar"]')
req.end()

// 会触发PayloadTooLargeError: