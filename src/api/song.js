// import {commonParams} from './config'
import axios from 'axios'

// 由于地址返回404,获取不到歌词内容，所以选择请求本地mock文件夹中的数据
// export function getLyric (mid) {
//   const url = '/api/lyric'

//   const data = Object.assign({}, commonParams, {
//     songmid: mid,
//     platform: 'yqq',
//     hostUin: 0,
//     needNewCode: 0,
//     categoryId: 10000000,
//     pcachetime: +new Date(),
//     format: 'json'
//   })

//   return axios.get(url, {
//     params: data
//   }).then((res) => {
//     return Promise.resolve(res.data)
//   })
// }

// 改为获取本地mock数据
export function getLyric (mid) {
  const url = '/static/mock/lyric.json'

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}
