<template>
    <div class="map-wrapper">
      <div id="map-container" v-show='active' v-loading.body="loading"></div>
      <div id="box" v-show='!active' v-loading.body="loading"></div>
      <div class='btn_wrapper'>
        <button :class='{"active": active}' @click='toggleMap(1)'>统计地图</button>
        <button :class='{"active": !active}' @click='toggleMap(2)'>详情地图</button>
      </div>
      <map-slide :title='mapNumTitle' :num='mapTotalNum' v-show="active && this.list.length"></map-slide>
      <!-- <map-title :title='mapTitle' v-show="this.list.length"></map-title> -->
    </div>
</template>
<script>
import mapSlide from '@/views/MP/MapSlide'
import { MP } from '@/common/config'
// import mapTitle from '@/views/MP/MapTitle'

export default {
  data() {
    return {
      mapTitle: '机构分布',
      mapNumTitle: '机构',
      mapTotalNum: 0,
      center: "",
      list: [],
      loading: false,
      active: true
    };
  },
  async created() {
    try {
      this.loading = true;
      let res = await this.$http.get(`${MP}/org/position`);
      let { list, center } = res.data.data;
      this.center = center.split(",");
      list.forEach(v => (v.position = v.position.split(",")));
      this.list = list
      this.active ? this.drowMap() : this.drowOriginMap()
    } catch (e) {
      console.log(e);
    }
  },
  methods: {
    drowMap() {
      const mapData = this._formatMapData(this.list)  // 格式化数据
      this.mapTotalNum = mapData.length  // 总数量
      const that = this
      let map = new AMap.Map('map-container', {
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
      /* map.on('zoomchange',(e) => {
        console.log(map)
      }) */
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

          $('<div id="loadingTip">加载数据，请稍候...</div>').appendTo(document.body)
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
                  switch2AreaNode(510000);
              });
      })
      this.loading = false
    },
    drowOriginMap () {
      let map = new AMap.Map('box', {
          resizeEnable: true,
          zoom: 11
      })
      
      // 设置中心点
      let city = '成都市'
      map.setCity(city)

      for(let i = 0; i < this.list.length; i++){
          let marker = new AMap.Marker({
              position: this.list[i].position,
              title: this.list[i].title,
              map
          })
          marker.setMap(map)
      }

      map.plugin(["AMap.ToolBar"], function() {
          map.addControl(new AMap.ToolBar());
      })

      let _this = this
      map.on('complete', function() {
          _this.loading = false
      })
    },
    toggleMap (n) {
      this.active = n === 1 ? true : false
      this.active ? this.drowMap() : this.drowOriginMap()
    },
    _formatMapData (list) {
      let ret = []
      list.forEach(item => {
        ret.push(item.position.join(','))
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
  .map-wrapper{
    height: calc(100vh - 54px);
    width: 100%;
    margin: 0 auto;
    position: relative;
  }
  #map-container, #box {
    width: 100%;
    height: 100%;
  }
  .btn_wrapper {
    position: absolute;
    top: 10px;
    left: 20px;
    z-index: 10000;
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
