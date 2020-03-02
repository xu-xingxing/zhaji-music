import originJSONP from 'jsonp'

// 封装jsonp
export default function jsonp (url, data, option) {
  // 判断url有没有？,如果没有？，添加？,否则添加&
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  // 返回一个promise
  return new Promise((resolve, reject) => {
    // 调用originJSONP
    originJSONP(url, option, (err, data) => {
      // 第一个err为null是成功
      if (!err) {
        // 将后端的数据resolve出去
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

// 将datajson对象打到url中
function param (data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}
