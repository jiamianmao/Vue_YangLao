<template>
  <div class="map-container" v-loading.body="loading">
    <el-form :inline="true" :model="formInline" class="demo-form-inline search-wrap" v-if="this.userInfo.type === 0 || this.userInfo.type === 2">
      <el-form-item label="机构选择">
        <el-select v-model="formInline.organization" @change="selectChange">
          <el-option label="请选择" value="" disabled></el-option>
          <el-option
            v-for='item in instList'
            :key='item.id'
            :value='item.id'
            :label="item.name">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- echarts -->
    <!-- tip -->
    <div class="tip-text">
      红色代表：签到忙碌，绿色代表：签退空闲
      <div class="tab__btn">
        <button :class='{"active": active}' @click='toggleMap(1)'>统计地图</button>
        <button :class='{"active": !active}' @click='toggleMap(2)'>详情地图</button>
      </div>
    </div>
    
    <div class="service-map-wrapper">
      <div id="service-map-wrap" v-show='active'></div>
      <div id="box" v-show='!active' v-loading.body="loading"></div>
      <map-slide :title='mapNumTitle' :num='mapTotalNum' v-show="active && this.mapList.length"></map-slide>
      <!-- <map-title :title='mapTitle' v-show="this.geoCoordMap"></map-title> -->
    </div>
    
  </div>
</template>

<script>
import mapSlide from '@/views/MP/MapSlide'
// import mapTitle from '@/views/MP/MapTitle'
import { UMS, MP } from '@/common/config'

export default {
  async created () {
    try{
      this.loading = true
      this.userInfo = window._dataInfo
      // 获取机构列表
      let loadInstList = await this._loadInstList()
      // 获取服务人员
      // this._loadServicerData(this._drawEcharts)
      this._loadServicerData(this._drawMap)
    } catch (e) {
      console.log(e)
    }
  },
  data() {
    return {
      mapTitle: '服务人员地图分布',
      mapNumTitle: '服务人员',
      mapTotalNum: 0,
      loading: false,
      myChart: null,
      formInline: {
        organization: ""
      },
      userInfo: null,   // 用户信息
      instList: [],  // 机构列表   
      serviceData: [],   // 散点地图数据 
      geoCoordMap: null,  // 散点地图坐标数据
      mapList: [],
      active: true
    };
  },
  methods: {
    // 选择对应的机构
    selectChange (id) {
      const userType = window._dataInfo.type  // userType  用户身份 0 超级管理员 1 机构 2 政府
      let params
      if (userType === 0 || userType === 1) {
        params = {
          ids: [id]
        }
      }
      if (userType === 2) {
        let ids = []
        this.instList.forEach((item) => {
          ids.push(item.id)
        })
        params = {
          ids
        }
      }
      this.$http.post(`${MP}/worker/position`,params)
      .then(res => {
        this.mapList = res.data.data
        this.mapTotalNum = res.data.count
        this.active ? this._drawMap() : this.drowOriginMap()
      }).catch(err => {
        console.log(err)
      })
    },
    // 下拉列表数据
    async _loadInstList () {
      const userType = window._dataInfo.type  // userType  用户身份 0 超级管理员 1 机构 2 政府
      let params
      if (userType === 0) {
        console.log('超级管理员')
        params = {
          cityId: '',
          provinceId: '',
          streetId: '',
          pageNum: 1
        }
        let res = await this.$http.post(`${UMS}/orgStreet/getOrgByParam.do`, params)
        .then(res => {
          this.instList = res.data.data.list
        }).catch(err => {
          console.log(err)
        })
      } else if (userType === 1) {
        console.log('机构')
        this.instList.push({
          id: this.userInfo.orgId,
          name: this.userInfo.orgName
        })
      } else if (userType === 2) {
        console.log('政府')
        params = {
          cityId: this.userInfo.cityId,
          areaId: this.userInfo.countryId,
          provinceId: this.userInfo.provinceId,
          streetId: this.userInfo.streetId,
          pageNum: 1
        }
        let res = await this.$http.post(`${UMS}/orgStreet/getOrgByParam.do`, params)
        .then(res => {
          this.instList = res.data.data.list
        }).catch(err => {
          console.log(err)
        })
      }
      
    },
    // 地图散点数据  服务人员数据
    async _loadServicerData (cb) {
      const userType = window._dataInfo.type  // userType  用户身份 0 超级管理员 1 机构 2 政府
      let params
      if (userType === 0) {
        console.log('超级管理员')
        params = {
          ids: []
        }
      } else if (userType === 1) {
        console.log('机构')
        const orgId = this.userInfo.orgId
        params = {
          ids: [orgId]
        }
      } else if (userType === 2) {
        console.log('政府')
        let ids = []
        this.instList.forEach((item) => {
          ids.push(item.id)
        })
        params = { ids }
      }
      let res = await this.$http.post(`${MP}/worker/position`,params)
      .then(res => {
        this.mapList = res.data.data
        this.mapTotalNum = res.data.count
        // this.serviceData = res.data.data
        // this.geoCoordMap = res.data.geoCoordMap
      }).catch(err => {
        console.log(err)
      })
      cb && cb()
    },
    toggleMap (n) {
      this.active = n === 1 ? true : false
      this.active ? this._drawMap() : this.drowOriginMap()
    },
    // 绘制地图 echarts方案
    _drawEcharts () {
      this.$nextTick(() => {
        // 初始化
        this.myChart = echarts.init(document.getElementById("service-map-wrap"))
        this.loading = false
        // 人员坐标
        let serviceData = this.serviceData
        let geoCoordMap = this.geoCoordMap
        let convertData = function(data) {
          var res = [];
          for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name];
            if (geoCoord) {
              res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
              });
            }
          }
          return res;
        }
        // 配置
        let option = {
            backgroundColor: "#404a59",
            title: {
              text: "服务人员分布",
              left: "center",
              textStyle: {
                color: "#fff"
              }
            },
            tooltip: {
              trigger: "item",
              formatter: function (obj) {
                return `${obj.name}`
              }
            },
            bmap: {
              center: [104.080384, 30.656567],
              zoom: 6,
              roam: true,
              mapStyle: {
                styleJson: [
                  {
                    featureType: "water",
                    elementType: "all",
                    stylers: {
                      color: "#044161"
                    }
                  },
                  {
                    featureType: "land",
                    elementType: "all",
                    stylers: {
                      color: "#004981"
                    }
                  },
                  {
                    featureType: "boundary",
                    elementType: "geometry",
                    stylers: {
                      color: "#064f85"
                    }
                  },
                  {
                    featureType: "railway",
                    elementType: "all",
                    stylers: {
                      visibility: "off"
                    }
                  },
                  {
                    featureType: "highway",
                    elementType: "geometry",
                    stylers: {
                      color: "#004981"
                    }
                  },
                  {
                    featureType: "highway",
                    elementType: "geometry.fill",
                    stylers: {
                      color: "#005b96",
                      lightness: 1
                    }
                  },
                  {
                    featureType: "highway",
                    elementType: "labels",
                    stylers: {
                      visibility: "off"
                    }
                  },
                  {
                    featureType: "arterial",
                    elementType: "geometry",
                    stylers: {
                      color: "#004981"
                    }
                  },
                  {
                    featureType: "arterial",
                    elementType: "geometry.fill",
                    stylers: {
                      color: "#00508b"
                    }
                  },
                  {
                    featureType: "poi",
                    elementType: "all",
                    stylers: {
                      visibility: "off"
                    }
                  },
                  {
                    featureType: "green",
                    elementType: "all",
                    stylers: {
                      color: "#056197",
                      visibility: "off"
                    }
                  },
                  {
                    featureType: "subway",
                    elementType: "all",
                    stylers: {
                      visibility: "off"
                    }
                  },
                  {
                    featureType: "manmade",
                    elementType: "all",
                    stylers: {
                      visibility: "off"
                    }
                  },
                  {
                    featureType: "local",
                    elementType: "all",
                    stylers: {
                      visibility: "off"
                    }
                  },
                  {
                    featureType: "arterial",
                    elementType: "labels",
                    stylers: {
                      visibility: "off"
                    }
                  },
                  {
                    featureType: "boundary",
                    elementType: "geometry.fill",
                    stylers: {
                      color: "#029fd4"
                    }
                  },
                  {
                    featureType: "building",
                    elementType: "all",
                    stylers: {
                      color: "#1a5787"
                    }
                  },
                  {
                    featureType: "label",
                    elementType: "all",
                    stylers: {
                      visibility: "off"
                    }
                  }
                ]
              }
            },
            series: [
              {
                name: "服务人员",
                type: "scatter",
                coordinateSystem: "bmap",
                data: convertData(serviceData),
                symbolSize: function(val) {
                  // console.log(val)
                  return 10
                },
                label: {
                  normal: {
                    formatter: "{b}",
                    position: "right",
                    show: true
                  },
                  emphasis: {
                    show: true
                  }
                },
                itemStyle: {
                  normal: {
                    color: function (obj) {
                      // 1 忙碌  2空闲
                      return obj.value[2] === '2' ? '#ddb926' : '#ec361be6'
                    }
                  }
                }
              },
            ]
        };
        this.myChart.setOption(option);
      })
    },
    // 绘制地图 高德方案
    /* _drawMap() {
      const mapData = this._formatMapData(this.geoCoordMap)  // 格式化数据
      this.mapTotalNum = mapData.length
      const that = this
      let map = new AMap.Map('service-map-wrap', {
        mapStyle: 'amap://styles/1ab052905a9986ae39311b0425893e99', //样式URL
        resizeEnable: true,
        zoom: 6,
        center: this.center
      });
      //just some colors 
      // 闪烁点
      var colors = [
          '#252466'
      ]

      AMapUI.load(['ui/geo/DistrictExplorer', 'lib/$', 'ui/misc/PointSimplifier'], function(DistrictExplorer, $, PointSimplifier) {

          // ***********闪烁点**********
          if (!PointSimplifier.supportCanvas) {
              alert('当前环境不支持 Canvas！');
              return;
          }
          var pointSimplifierIns = new PointSimplifier({
              zIndex: 115,
              autoSetFitView: false,
              map: map, //所属的地图实例

              getPosition: function(item) {
                  if (!item) {
                      return null;
                  }

                  var parts = item.split(',');

                  return [parseFloat(parts[0]), parseFloat(parts[1])];
              },
              getHoverTitle: function(dataItem, idx) {
                  return '序号: ' + idx;
              },
              //使用GroupStyleRender
              renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
              renderOptions: {
                  eventSupport: false, //禁止事件,对性能更友好
                  //点的样式
                  pointStyle: {
                      fillStyle: null,
                      width: 2,
                      height: 2
                  },
                  topNAreaStyle: null,
                  getGroupId: function(item, idx) {

                      //随机返回一个组ID
                      return Math.ceil(colors.length * Math.random());
                  },
                  groupStyleOptions: function(gid) {
                      //随机设置大小
                      var radius = 2 + 2 * Math.random();
                      return {
                          pointStyle: radius > 0 ? {
                              content: function(ctx, x, y, width, height) {

                                  var p = {
                                      x: x + width / 2,
                                      y: y + height / 2,
                                      radius: radius
                                  };

                                  ctx.beginPath();
                                  var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
                                  gradient.addColorStop(0, "rgba(255,255,255,0.8)");
                                  gradient.addColorStop(1, "rgba(255,255,255,0.1)");
                                  ctx.fillStyle = gradient;
                                  ctx.arc(p.x, p.y, p.radius, Math.PI * 2, false);
                                  ctx.fill();

                              },

                              //fillStyle: colors[gid % colors.length],
                              width: radius * 2,
                              height: radius * 2
                          } : null,
                          pointHardcoreStyle: {
                              width: radius * 2 + 3,
                              height: radius * 2 + 3
                          }
                      };
                  }

              }
          });

          //重复render
          setInterval(function() {
              pointSimplifierIns.render();
          }, 300)

          $('<div id="loadingTip">加载数据，请稍候...</div>').appendTo(document.body);
          pointSimplifierIns.setData(mapData)
          $('#loadingTip').remove()

          // *******行政区域**********

          //创建一个实例
          var districtExplorer = window.districtExplorer = new DistrictExplorer({
              map: map,
              eventSupport: true, //打开事件支持
              preload: [100000] //预加载全国
          });

          //要聚合的点列表
          var lngLatList;

          //当前聚焦的区域
          var currentAreaNode = null;

          //鼠标hover提示内容
          var $tipMarkerContent = $('<div class="tipMarker top"></div>');

          var tipMarker = new AMap.Marker({
              content: $tipMarkerContent.get(0),
              offset: new AMap.Pixel(0, 0),
              bubble: true
          });

          //根据Hover状态设置相关样式
          function toggleHoverFeature(feature, isHover, position) {
              tipMarker.setMap(isHover ? map : null);
              if (!feature) {
                  return;
              }
              var props = feature.properties;
              if (isHover) {
                  var points = groupedPointsCache[props.adcode] || [];
                  //更新提示内容
                  // $tipMarkerContent.html(props.adcode + ': ' + props.name + '(' + points.length + ')');
                  //更新位置
                  tipMarker.setPosition(position || props.center);
              }
              // $('#area-tree').find('h2[data-adcode="' + props.adcode + '"]').toggleClass('hover', isHover);

              //更新相关多边形的样式
              var polys = districtExplorer.findFeaturePolygonsByAdcode(props.adcode);
              for (var i = 0, len = polys.length; i < len; i++) {

                  polys[i].setOptions({
                      fillOpacity: isHover ? 0.5 : 0.2
                  });
              }
          }

          //监听feature的hover事件
          districtExplorer.on('featureMouseout featureMouseover', function(e, feature) {
              toggleHoverFeature(feature, e.type === 'featureMouseover',
                  e.originalEvent ? e.originalEvent.lnglat : null);
          });

          //监听鼠标在feature上滑动
          districtExplorer.on('featureMousemove', function(e, feature) {
              //更新提示位置
              tipMarker.setPosition(e.originalEvent.lnglat);
          });

          //feature被点击
          districtExplorer.on('featureClick', function(e, feature) {
              var props = feature.properties;
              //如果存在子节点
              if (props.childrenNum > 0) {
                  //切换聚焦区域
                  switch2AreaNode(props.adcode);
              }
          });

          //外部区域被点击
          districtExplorer.on('outsideClick', function(e) {
              districtExplorer.locatePosition(e.originalEvent.lnglat, function(error, routeFeatures) {
                  if (routeFeatures && routeFeatures.length > 1) {
                      //切换到省级区域
                      switch2AreaNode(routeFeatures[1].properties.adcode);
                  } else {
                      //切换到全国
                      switch2AreaNode(100000);
                  }
              }, {
                  levelLimit: 2
              });
          });

          //绘制区域面板的节点
          function renderAreaPanelNode(ele, props, color) {
              var $box = $('<li/>').addClass('lv_' + props.level)
              var points = groupedPointsCache[props.adcode] || []
              var $h2 = $('<h2/>').addClass('lv_' + props.level).attr({
                  'data-adcode': props.adcode,
                  'data-level': props.level,
                  'data-children-num': props.childrenNum || void(0),
                  'data-center': props.center.join(',')
              }).html(props.name + '(' + points.length + ')').appendTo($box)
              if (color) {
                  $h2.css('borderColor', color);
              }
              //如果存在子节点
              if (props.childrenNum > 0) {
                  //显示隐藏
                  $('<div class="showHideBtn"></div>').appendTo($box)
                  //子区域列表
                  $('<ul/>').addClass('sublist lv_' + props.level).appendTo($box)
                  $('<div class="clear"></div>').appendTo($box)
                  if (props.level !== 'country') {
                      $box.addClass('hide-sub');
                  }
              }
              $box.appendTo(ele);
          }
          //填充某个节点的子区域列表
          function renderAreaPanel(areaNode) {
              var props = areaNode.getProps()
              var $subBox = $('#area-tree').find('h2[data-adcode="' + props.adcode + '"]').siblings('ul.sublist')
              if (!$subBox.length) {
                  //父节点不存在，先创建
                  renderAreaPanelNode($('#area-tree'), props)
                  $subBox = $('#area-tree').find('ul.sublist')
              }

              if ($subBox.attr('data-loaded') === 'rendered') {
                  return
              }
              $subBox.attr('data-loaded', 'rendered')
              var subFeatures = areaNode.getSubFeatures()
              subFeatures.sort(function(f1, f2) {
                  var props1 = areaNode.getPropsOfFeature(f1),
                      props2 = areaNode.getPropsOfFeature(f2);
                  var points1 = groupedPointsCache[props1.adcode] || [],
                      points2 = groupedPointsCache[props2.adcode] || [];
                  return points2.length - points1.length
              });

              //填充子区域
              for (var i = 0, len = subFeatures.length; i < len; i++) {
                  renderAreaPanelNode($subBox, areaNode.getPropsOfFeature(subFeatures[i]), colors[i % colors.length]);
              }
              return $subBox;
          }

          //绘制某个区域的边界
          function renderAreaPolygons(areaNode) {
              //更新地图视野
              map.setBounds(areaNode.getBounds(), null, null, true)
              //清除已有的绘制内容
              districtExplorer.clearFeaturePolygons()
              //绘制子区域
              districtExplorer.renderSubFeatures(areaNode, function(feature, i) {
                  var fillColor = colors[i % colors.length];
                  var strokeColor = colors[colors.length - 1 - i % colors.length]
                  return {
                      cursor: 'default',
                      bubble: true,
                      strokeColor: strokeColor, //线颜色
                      strokeOpacity: 1, //线透明度
                      strokeWeight: 1, //线宽
                      fillColor: fillColor, //填充色
                      fillOpacity: 0.35, //填充透明度
                  };
              });

              //绘制父区域
              districtExplorer.renderParentFeature(areaNode, {
                  cursor: 'default',
                  bubble: true,
                  strokeColor: 'black', //线颜色
                  strokeOpacity: 1, //线透明度
                  strokeWeight: 1, //线宽
                  fillColor: null, //填充色
                  fillOpacity: 0.35, //填充透明度
              })
          }

          //切换区域后刷新显示内容
          function refreshAreaNode(areaNode) {
              districtExplorer.setHoverFeature(null)
              renderAreaPolygons(areaNode)
              //更新选中节点的class
              var $nodeEles = $('#area-tree').find('h2')
              $nodeEles.removeClass('selected')
              var $selectedNode = $nodeEles.filter('h2[data-adcode=' + areaNode.getAdcode() + ']').addClass('selected');
              //展开下层节点
              $selectedNode.closest('li').removeClass('hide-sub')
              //折叠下层的子节点
              $selectedNode.siblings('ul.sublist').children().addClass('hide-sub');
          }

          //切换区域
          function switch2AreaNode(adcode, callback) {
              if (currentAreaNode && ('' + currentAreaNode.getAdcode() === '' + adcode)) {
                  return;
              }
              loadAreaNode(adcode, function(error, areaNode) {
                  if (error) {
                      if (callback) {
                          callback(error);
                      }
                      return;
                  }
                  currentAreaNode = window.currentAreaNode = areaNode
                  //设置当前使用的定位用节点
                  districtExplorer.setAreaNodesForLocating([currentAreaNode]);
                  refreshAreaNode(areaNode);
                  if (callback) {
                      callback(null, areaNode);
                  }
              });
          }
          var groupedPointsCache = {};
          function getGroupedPoints(adcode) {
              return groupedPointsCache[adcode] || lngLatList;
          }
          //保留中间聚合结果
          function saveGroupedPoints(areaNode, groups) {
              for (var i = 0, len = groups.length; i < len; i++) {
                  var subFeature = groups[i].subFeature; //所属子区域
                  if (!subFeature) {
                      groupedPointsCache['-out-' + areaNode.getAdcode()] = groups[i].points;
                      continue;
                  }
                  groupedPointsCache[subFeature.properties.adcode] = groups[i].points;
              }
          }
          //加载区域
          function loadAreaNode(adcode, callback) {
              districtExplorer.loadAreaNode(adcode, function(error, areaNode) {
                  if (error) {
                      if (callback) {
                          callback(error)
                      }
                      console.error(error)
                      return
                  }
                  var points = getGroupedPoints(adcode)
                  //当前子区域聚合
                  var groups = areaNode.groupByPosition(points, function(item) {
                      return item;
                  })
                  saveGroupedPoints(areaNode, groups)
                  var $subBox = renderAreaPanel(areaNode)
                  if (groups.length &&
                      !groups[groups.length - 1].subFeature) {
                      renderAreaPanelNode($subBox, {
                          adcode: '-out-' + areaNode.getAdcode(),
                          name: '区域外',
                          center: groups[groups.length - 1].points[0]
                      }, 'gray');
                  }
                  // renderGroupedPoints(groups);
                  if (callback) {
                      callback(null, areaNode);
                  }
              });
          }
          $('<div id="loadingTip">加载数据，请稍候...</div>').appendTo(document.body)
          $.get('http://a.amap.com/amap-ui/static/data/10w.txt',
              function(csv) {
                $('#loadingTip').remove();
                var lines = csv.split('\n');
                var lngLats = [];
                for (var i = 0, len = lines.length; i < len; i++) {
                    if (!lines[i]) {
                        continue;
                    }
                    var parts = lines[i].split(',');
                    lngLats.push([parseFloat(parts[0]), parseFloat(parts[1])]);
                }
                lngLatList = lngLats;
                groupedPointsCache['100000'] = lngLats;

                //加载全国
                switch2AreaNode(100000);
            })
        })
      this.loading = false
    }, */
    // 和服务人员详情保持一致
    _drawMap () {
      // let color = Object.is(type, 2) ? require('./green.png') : require('./red.png')
      // let mapData = this._formatMapData(this.geoCoordMap)
      // mapData.push(position)
      // this.mapTotalNum = mapData.length  // 总数量
      let markers = this.mapList // marker点集合
      const color1 = require('./green.png')
      const color2 = require('./red.png')
      
      let map = new AMap.Map('service-map-wrap', {
          mapStyle: 'amap://styles/1ab052905a9986ae39311b0425893e99', //样式URL
          resizeEnable: true,
          zoom: 5,
          center: [104.087392,30.557836]
      })
      markers.forEach(item => {
        var marker = new AMap.Marker({
          position: item.position.split(','),
          icon: new AMap.Icon({
              size: new AMap.Size(35, 50),
              image: item.userNum === 1 ? color1 : color2
          }),
          imageOffset: new AMap.Pixel(0, -60)
        })
        marker.setTitle(item.title)
        marker.setMap(map)
      })
      
      this.loading = false
    },
    drowOriginMap () {
      let markers = this.mapList
      let map = new AMap.Map('box', {
          resizeEnable: true,
          zoom: 5,
          center: [104.087392,30.557836]
      })
      let dict = {
        '1': '空闲',
        '2': '忙碌'
      }
      markers.forEach(item => {
        let marker = new AMap.Marker({
          position: item.position.split(','),
          title: item.title + ": " + dict[item.userNum],
          map
        })
        marker.setMap(map)
      })

      map.plugin(["AMap.ToolBar"], function() {
          map.addControl(new AMap.ToolBar());
      })

      let _this = this
      map.on('complete', function() {
          _this.loading = false
      });
    },
    _formatMapData (list) {
      let ret = []
      let positionList = Object.values(list)
      positionList.forEach(item => {
        ret.push(item.join(','))
      })
      return ret
    }
  },
  components: {
    mapSlide,
    // mapTitle
  }
}
</script>

<style lang="scss" scoped>
.map-container {
  padding: 20px;
}
.service-map-wrapper{
  width: 100%;
  height: 800px;
  position: relative;
}
#service-map-wrap, #box {
  width: 100%;
  height: 100%;
  position: relative;
}
.anchorBL{
  display: none;
}
.tip-text{
  height: 50px;
  line-height: 50px;
  display: flex;
  flex-flow: row nowrap;
}
.tab__btn{
  margin-left: 20px;
  button {
      width: 100px;
      height: 36px;
      border-radius: 5px;
      border: 1px solid #333;
      background: #fff;
      color: #333;
      cursor: pointer;
      &~button {
          margin-left: 10px;
      }
      &.active {
          color: red;
      }
  }
}
</style>
