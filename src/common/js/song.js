import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

export default class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric () {
    // 避免由于currentSong的变化导致getLyric的重复执行
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          // 获取歌词
          resolve(this.lyric)
        } else {
          //
          reject(new Error('no lyric'))
        }
      })
    })
  }
}

// 工厂方法
export function createSong (musicData, vkey) { // 加了一个传参和更新了url
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer), // filterSinger 中处理一遍
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: 'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400003mBrF72dILfK.m4a?guid=9607983221&vkey=A751911D4E781AF78EEB43542A2F8A0A6E7B52BCF7CD666F787B6ECB9A1B08D3C6B85416D459CC1B5DE156227137C16C1C9F1F690671C951&uin=0&fromtag=38'
    // url: `http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400${musicData.strMediaMid}.m4a?fromtag=38&guid=4765403460&vkey=${vkey}&uin=0`
  })
}

// 处理多个歌手
export function filterSinger (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
