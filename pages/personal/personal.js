// pages/personal/personal.js
import request from '../../utils/request'
let startY=0//手指起始的坐标
let moveY=0//手指移动的坐标
let moveDistance=0 //手指移动的距离
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverTraansform:'translateY(0rpx)',
        coverTransition:'',
        userInfo:{},//用户信息
        recentPlayList:[]//用户播放记录
    },
    handleTouchStart(e){
        this.setData({
            coverTransition:'transform 1s linear'
        })
        startY=e.touches[0].clientY
    },
    handleTouchMove(e){
        moveY=e.touches[0].clientY
        moveDistance=moveY-startY
        if(moveDistance<=0){
            return;
        }
        if(moveDistance>=80){
            moveDistance=80
        }
        // 动态更新coverTransform的状态值
        this.setData({
            coverTraansform:`translateY(${moveDistance}rpx)`
        })
    },
    handleTouchEnd(){
        this.setData({
            coverTraansform:`translateY(0rpx)`,
            coverTransition:'transform 1s linear'
        })
    },
    // 跳转至登录界面的回调
    toLogin(){
        wx.navigateTo({
          url: '/pages/login/login',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 用户的基本信息
        let userInfo=wx.getStorageSync('userInfo')
        if(userInfo){
            this.setData({
                userInfo:JSON.parse(userInfo)
            })
            // 获取用户播放记录
            this.getUserRecentPlayList()
        }
    },
    // 获取用户播放记录的功能函数
    async getUserRecentPlayList(){
        let recentPlayListData=await request('/user/record',{uid:8023474819,type:0})
        let index=0
        let recentPlayList=recentPlayListData.allData.splice(0,10).map(item=>{
            item.id=index++
            return item
        })
        this.setData({
            recentPlayList:recentPlayList
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