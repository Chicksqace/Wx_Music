// 发送ajax请求
// 1.封装功能函数
import config from './config'
    export default (url,data={},method='GET')=>{
        return new Promise((resolve,reject)=>{
            wx.request({
                url:config.host+url,
                data,
                method,
                success:(res)=>{
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