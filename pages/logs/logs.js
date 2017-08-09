Page({
  data: {
    showsearch:false,   //显示搜索按钮
    searchtext:'',  //搜索文字
    filterdata:{},  //筛选条件数据
    showfilter:false, //是否显示下拉筛选
    showfilterindex:null, //显示哪个筛选类目
    sortindex:0,  //一级分类索引
    sortid:null,  //一级分类id
    subsortindex:0, //二级分类索引
    subsortid:null, //二级分类id
    cityindex:0,  //一级城市索引
    cityid:null,  //一级城市id
    subcityindex:0,  //二级城市索引
    subcityid:null, //二级城市id
    servicelist:[], //服务集市列表
    scrolltop:null, //滚动位置
    page: 0,  //分页
    lastPage:false //是否是最后一页
  },
  onLoad: function () { //加载数据渲染页面
    console.log(getApp().globalData.openid)
    if (getApp().globalData.openid) {
      this.fetchServiceData();
      this.fetchFilterData();
    } else {
      wx.showToast({
        title: '未通过认证，无法操作，请先申请',
        icon: 'faild',
        duration: 3000
      });
      setTimeout(function(){
        wx.switchTab({
          url: '../index/index',
        })
      },2800)
    }
  },
  fetchFilterData: function () { //获取筛选条件
    this.setData({
      filterdata: {
        "sort": [
          {
            "id": 0,
            "title": "全部"
          },
        ],
        "city": [
          {
            "id": 0,
            "title": "全部"
          },
        ],
      }
    })
  },
  fetchServiceData:function(){  //获取记录数据
    let _this = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    //准备显示数据
    // const perpage = 2;
    // this.setData({
    //   page: this.data.page + 1
    // })
    // const page = this.data.page;
    const newlist = [];
    const page = this.data.page;
    var that = this;
    wx.request({
      url: 'https://liuyaqing0309.com/findlogs',
      data:{
        "pageId":page
      },
      method: "GET",
      success: function (res) {
        console.log(res)
        console.log(res.data.data.numberOfElements)
        if (res.data.data.last == false){
          console.log("不是最后一页，可以滚动加载" + res.data.data.last)
          that.setData({
            page: that.data.page + 1,
            lastPage: false
          })
        }else{
          console.log("设置为最后一页" + res.data.data.last)
          that.setData({
            lastPage: true
          })
        }
        for (var i = 0; i < res.data.data.numberOfElements ;i++){
          newlist.push({
            "id": i + 1,
            "name": res.data.data.content[i].name,
            "state": res.data.data.content[i].state,
            "classs": res.data.data.content[i].classs,
            "text": res.data.data.content[i].text
          })
        }
      },
    })
    setTimeout(() => {
      _this.setData({
        servicelist: _this.data.servicelist.concat(newlist)
      })
    }, 1500)
  },
  inputSearch:function(e){  //输入搜索文字
    this.setData({
      showsearch:e.detail.cursor>0,
      searchtext:e.detail.value
    })
  },
  submitSearch:function(){  //提交搜索
    console.log(this.data.searchtext);
    this.fetchServiceData();
  },
  setFilterPanel: function(e){ //展开筛选面板
    const d = this.data;
    const i = e.currentTarget.dataset.findex;
    if(d.showfilterindex == i){
      this.setData({
        showfilter: false,
        showfilterindex: null
      })
    }else{    
      this.setData({
        showfilter: true,
        showfilterindex:i,
      })
    }
    console.log(d.showfilterindex);
  },
  setSortIndex:function(e){ //服务类别一级索引
    const d= this.data;
    const dataset = e.currentTarget.dataset;
    this.setData({
      sortindex:dataset.sortindex,
      sortid:dataset.sortid,
      subsortindex: d.sortindex==dataset.sortindex ? d.subsortindex:0
    })
    console.log('服务类别id：一级--'+this.data.sortid+',二级--'+this.data.subsortid);
  },
  setSubsortIndex:function(e){ //服务类别二级索引
    const dataset = e.currentTarget.dataset;
    this.setData({
      subsortindex:dataset.subsortindex,
      subsortid:dataset.subsortid,
    })
    console.log('服务类别id：一级--'+this.data.sortid+',二级--'+this.data.subsortid);
  },
  setCityIndex:function(e){ //服务城市一级索引
    const d= this.data;
    const dataset = e.currentTarget.dataset;
    this.setData({
      cityindex:dataset.cityindex,
      cityid:dataset.cityid,
      subcityindex: d.cityindex==dataset.cityindex ? d.subcityindex:0
    })
    console.log('服务城市id：一级--'+this.data.cityid+',二级--'+this.data.subcityid);
  },
  setSubcityIndex:function(e){ //服务城市二级索引
    const dataset = e.currentTarget.dataset;
    this.setData({
      subcityindex:dataset.subcityindex,
      subcityid:dataset.subcityid,
    })
    console.log('服务城市id：一级--'+this.data.cityid+',二级--'+this.data.subcityid);
  },
  hideFilter: function(){ //关闭筛选面板
    this.setData({
      showfilter: false,
      showfilterindex: null
    })
  },
  scrollHandle:function(e){ //滚动事件
    this.setData({
      scrolltop:e.detail.scrollTop
    })
  },
  goToTop:function(){ //回到顶部
    this.setData({
      scrolltop:0
    })
  },
  scrollLoading:function(){ //滚动加载
    if(this.data.lastPage == true){
      console.log("已经是最后一页，不能再次请求")
    }else{
      this.setData({
        lastPage:true
      })
      this.fetchServiceData();
    }
  },
  // onPullDownRefresh:function(){ //下拉刷新
  //   this.setData({
  //     page:0,
  //     servicelist:[]
  //   })
  //   this.fetchServiceData();
  //   this.fetchFilterData();
  //   setTimeout(()=>{
  //     wx.stopPullDownRefresh()
  //   },1000)
  // }
})