// 发送ajax请求
// 1.封装功能函数
import config from './config'
    export default (url,data={},method='GET')=>{
        return new Promise((resolve,reject)=>{
            wx.request({
                url:config.host+url,
                data,
                method,
                header:{
                    cookie:wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item=>item.indexOf('MUSIC_U')!==-1):''
                },
                success:(res)=>{
                    if(data.isLogin){
                        // 将用户的cookie存入至本地
                        wx.setStorage({
                            key:'cookies',
                            data:res.cookies
                        })
                    }
                  console.log('请求成功',res);
                  resolve(res.data)
                },
                fail:(err)=>{
                  console.log('请求失败',err);
                  reject(err)
                }
              })
        })
    }
// 2.封装功能组件