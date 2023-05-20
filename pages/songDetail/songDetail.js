// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js'
import request from '../../utils/request'
const appInstance=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay:false,//音乐是否播放
        song:{},//歌曲详情对象
        musicId:'',//音乐id
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let musicId=options.musicId
        this.setData({
            musicId
        })
        this.getMusicInfo(musicId)
        if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId===musicId){
            // 修改当前页面音乐播放状态为true
            this.setData({
                isPlay:true
            })
        }
        this.backgroundAudioManager=wx.getBackgroundAudioManager();
        this.backgroundAudioManager.onPlay(()=>{
            // 修改音乐的状态
          this.changePlayState(true)
        //   修改全局音乐播放的状态
            appInstance.globalData.musicId=musicId;
        })
        this.backgroundAudioManager.onPause(()=>{
            this.changePlayState(false)
        })
        this.backgroundAudioManager.onStop(()=>{
            this.changePlayState(false)
        })
    },
    // 修改播放状态的功能函数
    changePlayState(isPlay){
        this.setData({
            isPlay
        })
        appInstance.globalData.isMusicPlay=isPlay;
    },
    // 获取音乐详情的功能函数
    async getMusicInfo(musicId){
        let songData=await request('/song/detail',{ids:musicId})
        this.setData({
            song:songData.songs[0]
        })
        // 动态修改窗口标题
        wx.setNavigationBarTitle({
          title: this.data.song.name,
        })
    },
        // 点击播放或暂停的回调
        handleMusicPlay(){
            let isPlay=!this.data.isPlay
            console.log(isPlay);
            this.setData({
                isPlay
            })
            let {musicId}=this.data
            this.musicControl(isPlay,musicId)
        },
    // 控制音乐播放/暂停的功能函数 
    async musicControl(isPlay,musicId){
        if(isPlay){//音乐播放
            // 获取音乐播放链接
            let musicLinkData=await request('/song/url',{id:musicId})
            let musicLink=musicLinkData.data[0].url
            this.backgroundAudioManager.src=musicLink
            this.backgroundAudioManager.title=this.data.song.name
        }else{//暂停音乐
            this.backgroundAudioManager.pause()
        }
    },
    // 点击切歌的回调
    handleSwitch(event){
        // 获取切歌的类型
        let type=event.currentTarget.id
        // 关闭当前音乐的   
        this.backgroundAudioManager.stop()
        // 订阅来自recommendSong页面发布的musicId信息
        PubSub.subscribe('musicId',(msg,musicId)=>{
            // 获取音乐详情信息
            this.getMusicInfo(musicId)
            // 自动播放当前的音乐
            this.musicControl(true,musicId)
            // 取消订阅
            PubSub.unsubscribe('musicId')
        })
        // 发布数据给recommendSong
        PubSub.publish('switchType',type)
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