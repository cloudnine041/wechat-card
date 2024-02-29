Page({

  /**
   * 页面的初始数据
   */
  data: {
    isMe:true,
    flagA:false,
    flagN:false,
    musicOn:true,
    toName:'',
    mainText:'',
    greeting:'',
    fromName:'',
    userId:'',
    avatarUrl:'',
    nickname:'',
    maintxtHeight:0
  },
  onLoad: function (options) {
    // 云函数获取用户openid
    wx.cloud.callFunction({
      name:'helloCloud',
      data:{
        message:'helloCloud',
      }
    }).then(res=>{
      this.setData({userId:res.result.openid})
    })
    this.setData({
      isMe:options.isme==='1'?false:true,
      toName:options.toname?options.toname:'亲爱的妈妈：',
      mainText:options.maintext?options.maintext:'母亲节快乐！祝您永远年轻，永远幸福。',
      greeting:options.greeting?options.greeting:'永远爱你的',
      fromName:options.fromname?options.fromname:'lsy',
      avatarUrl:options.avatarurl?options.avatarurl:'',
      nickname:options.nickname?options.nickname:'',
      flagA:options.flaga==='1'?true:false,
      flagN:options.flagn==='1'?true:false,
    })
    // 初始化背景音乐组件
    this.audioInit('https://636c-cloud1-0gnar5o72100350e-1324519827.tcb.qcloud.la/bgMusic.wav?sign=97affd840fcfd566962add6dc9341534&t=1708911594')
  },
  onShareAppMessage: function () {
    const { 
      toName,
      mainText,
      greeting,
      fromName,
      avatarUrl,
      nickname}=this.data
      const flaga = this.data.flagA===true?'1':'0'
      const flagn = this.data.flagN===true?'1':'0'

    return{
      title: '您的贺卡已到账~',
      path:`pages/index/index?isme=1&toname=${toName}&maintext=${mainText}&greeting=${greeting}&fromname=${fromName}&avatarurl=${avatarUrl}&nickname=${nickname}&flaga=${flaga}&flagn=${flagn}`
    }
  },
  bindchooseavatar(e) {
    const tempUrl = e.detail.avatarUrl
    wx.cloud.uploadFile({
      // 将openid作为图片唯一标识上传至云端的路径
      cloudPath: `${this.data.userId}.png`, 
      filePath: tempUrl, // 小程序临时文件路径
      success: res => {
        // 返回文件 ID
        // console.log(res.fileID)
        this.setData({avatarUrl:res.fileID,flagA:true})
      },
      fail: console.error
    })
  },
  changeToName(e){
    const {value} = e.detail
    this.setData({toName:value})
  },
  changeText(e){
    const {value} = e.detail
    this.setData({mainText:value})
  },
  changeGreet(e){
    const {value} = e.detail
    this.setData({greeting:value})
  },
  changeFromName(e){
    const {value} = e.detail
    this.setData({fromName:value})
  },
  changeNickname(e){
    const {value} = e.detail
    if(value.length===0)return
    this.setData({nickname:value,flagN:true})
  },
  audioInit(audioUrl) {
    this.audioCtx = wx.createInnerAudioContext()
    this.audioCtx.src = audioUrl
    this.audioCtx.autoplay = true
    this.audioCtx.loop = true
  },
  toggleMusic(){
    this.setData({musicOn:!this.data.musicOn})
    if(this.data.musicOn===true){
      this.audioCtx.play()
    }else{
      this.audioCtx.pause()
    }
  }
})