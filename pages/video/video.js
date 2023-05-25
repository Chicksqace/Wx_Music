// pages/video/video.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoGroupList:[],//导航的标签数据
        navId:"",//导航的标识
        videoList:[],//视频的列表数据
        videoId:'',    //视频ID标识
        videoUpdateTime:[],//记录video播放时长
        isTriggered:false,//标识下拉刷新
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 获取导航标签数据
        this.getVideoGroupListData();
      
    },
    // 获取导航数据
    async getVideoGroupListData(){
        let videoGroupListData=await request('/video/group/list')
        this.setData({
            videoGroupList:videoGroupListData.data.slice(0,14),
            navId:videoGroupListData.data[0].id
        })
        this.getVideoList()
    },
    // 获取视频列表数据
    async getVideoList(navId){
        let videoListData=await request('/video/url?id=89ADDE33C0AAE8EC14B99F6750DB954D')
        let videoList=videoListData.urls
        // 关闭消息提示框
        wx.hideLoading()
        // 关闭下载刷新
        this.setData({
            videoList,
            isTriggered:false
        })
    },
    // 点击切换导航的回调
    changeNav(event){
        let navId=event.currentTarget.id;
        this.setData({
            navId:navId>>>0,
            videoList:[]
        })
        // 显示正在加载
        wx.showLoading({
            title:'正在加载'
        })
        // 动态获取当前导航对应数据
        this.getVideoList(this.data.navId)
    },
    // 点击播放的回调
    handlePlay(event){
        let vid=event.currentTarget.id;
        console.log(vid);
        // 关闭上一个视频
        // this.vid!==vid && this.videoContext && this.videoContext.stop();
        // this.vid=vid;
        this.setData({
            videoId:vid
        })
        this.videoContext=wx.createVideoContext(vid)
        // 判断当前的视频之前是否播放过，是否有播放记录，如果有，跳转指定的位置
        let {videoUpdateTime}=this.data
        let videoItem=videoUpdateTime.find(item=>item.vid===vid)
        if(videoItem){
            this.videoContext.seek(videoItem.currentTime)
        }
        this.videoContext.play()
    },
    // 监听视频播放进度的回调
    handleTimeUpdate(e){
        let videoTimeObj={vid:e.currentTarget.id,currentTime:e.detail.currentTarget}
        let {videoUpdateTime}=this.data;
        let videoItem=videoUpdateTime.find(item=>item.id===videoUpdateTime.vid);
        if(videoItem){//之前有
            videoItem.currentTime=e.detail.currentTime
        }else{
            // 之前没有
            videoUpdateTime.push(videoTimeObj)
        }
        this.setData({
            videoUpdateTime
        })
    },
    // 视频播放结束调用
    handleEnded(e){
        // 移除记录播放时长数组中当前视频的对象
        let {videoUpdateTiem}=this.data
        console.log(this.data);
        videoUpdateTiem.splice(videoUpdateTiem.findIndex(item=>item.vid===e.currentTarget.id),1)
        this.setData({
            videoUpdateTime
        })
    },
    // 自定义下拉刷新回调
    handleRefresher(){
        this.getVideoList(this.data.navId)
    },
    // 上拉触底
    handleToLower(){
        console.log('网易云音乐暂时没有提供该接口');
    },
    // 跳转搜索界面
    toSearch(){
        wx.navigateTo({
          url: '/pages/search/search',
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
    onShareAppMessage({from}) {
        if(from ==='button'){
            return{
                title:'来自button的转发',
                page:'/pages/video/video',
                imageUrl:'/static/images/nvsheng.jpg'
            }
        }else{
            return{
                title:'来自menu的转发',
                page:'/pages/video/video',
                imageUrl:'/static/images/nvsheng.jpg'
            }
        }
    }
})