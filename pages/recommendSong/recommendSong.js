// pages/recommendSong/recommendSong.js
import PubSub from 'pubsub-js'
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day:'',
        month:'',
        recommendList:[],//推荐列表数据
        index:0,//点击音乐的下标
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 判断用户登录
        let userInfo=wx.getStorageSync('userInfo')
        if(!userInfo){
            wx.showToast({
              title: '请先登录',
              icon:'none',
              success:()=>{
                  wx.reLaunch({
                    url: '/pages/login/login',
                  })
              }
            })
        }
        // 更新日期的状态数据
        this.setData({
            day:new Date().getDate(),
            month:new Date().getMonth()+1
        })
        // 获取每日推荐的数据
        this.getRecommendList()
        // 订阅来自songDetail页面发布的信息 
        PubSub.subscribe('switchType',(msg,type)=>{
            let {recommendList,index} =this.data
            if(type==='pre'){//上一首
                (index===0)&&(index=recommendList.length)  
                index-=1
            }else{//下一首
                (index===recommendList.length-1)&&(index=-1)
                index+=1
            }
            // 更新下标
            this.setData({
                index
            })
            let musicId=recommendList[index].id
            // 将musicId回传给songDetail页面
            PubSub.publish('musicId',musicId)
        })
    },
    // 获取每日推荐的数据
    async getRecommendList(){
        let recommendListData=await request('/recommend/songs')
        console.log('获取每日推荐的数据',recommendListData);
        this.setData({
            recommendList:recommendListData.data.dailySongs
        })
    },
    // 跳转到SongDetail页面
    toSongDetail(e){
        let {song,index}=e.currentTarget.dataset
        this.setData({
            index
        })
        wx.navigateTo({
          url: '/pages/songDetail/songDetail?musicId='+song.id
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})