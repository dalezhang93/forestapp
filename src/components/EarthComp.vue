<!--
 * @Descripttion: 
 * @Author: sandro0618
 * @Date: 2021-07-20 09:28:02
 * @LastEditors: sandro0618
 * @LastEditTime: 2021-08-08 11:35:38
-->
<template>
  <div>
    <div ref="earthContainer" class="earth-container"></div>
    <div class="box">
      <el-form ref="fire" :model="fire" label-position="right" size="mini" label-width="100px">
        <el-form-item label="经度：">
          <el-input v-model="fire.longitude"></el-input>
        </el-form-item>
        <el-form-item label="纬度：">
          <el-input v-model="fire.latitude"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button round type="primary" size="mini" @click="handleClickFire">起火</el-button>
          <el-button v-if="showContinue" round size="mini" @click="handleContinue">继续</el-button>
          <el-button v-if="showSuspend" round size="mini" @click="handleSuspend">暂停</el-button>
          <el-button round size="mini" @click="handleClickReset">重置</el-button>
        </el-form-item>
        <el-form-item label="温度：">
          <el-input-number v-model="fire.temperature" :min="1" :max="500" label="温度"></el-input-number>
        </el-form-item>
        <el-form-item label="风力等级：">
          <el-input-number v-model="fire.windGrade" :min="1" :max="12" label="风力等级"></el-input-number>
        </el-form-item>
        <el-form-item label="风向角度：">
          <el-select v-model="fire.windAngle" placeholder="请选择风向角度">
            <el-option v-for="(item, index) in windAngleList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间：">
          <span>{{ formatTime(fire.startTime) }}</span>
        </el-form-item>
        <el-form-item label="当前时间：">
          <span>{{ formatTime(fire.currentTime) }}</span>
        </el-form-item>
        <div>
          <div v-if="showMore" @click="showMore = false">
            <span style="cursor: default;">展开</span>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <div v-if="!showMore">
            <el-form-item label="a：">
              <el-input v-model="fire.a"></el-input>
            </el-form-item>
            <el-form-item label="b：">
              <el-input v-model="fire.b"></el-input>
            </el-form-item>
            <el-form-item label="c：">
              <el-input v-model="fire.c"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button round type="primary" size="mini" @click="firesInit">初始化</el-button>
            </el-form-item>
          </div>
          <div v-if="!showMore" @click="showMore = true">
            <span style="cursor: default;">收起</span>
            <i class="el-icon-caret-top"></i>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-debugger */
import dayjs from 'dayjs'
import { getAllFires, getAllFiresLocal, firesInit, nextFire, nextFireLocal, startFire, resetFire } from '@/api/forest'
const statusColor = new Map([
  [0, '#67c23a'],
  [1, '#c92525'],
  [2, '#494646']
])
const windAngleList = [
  ['东', 0],
  ['南', -90],
  ['西', 180],
  ['北', 90],
  ['东南', -45],
  ['东北', 45],
  ['西南', -135],
  ['西北', 135]
]
export default {
  name: 'EarthComp',
  data() {
    return {
      fire: {
        longitude: null,
        latitude: null,
        // R0 = aT + bW - c
        a: 0.053,
        b: 0.048,
        c: 0.275,
        // 温度：摄氏度
        temperature: 28,
        // 风力等级：1-12级
        windGrade: 3,
        // 风向角度：东、南、西、北、东南、东北、西南、西北
        windAngle: 0,
        // 时间：格式为20210801 23:36
        startTime: null,
        currentTime: null
      },
      showContinue: false,
      showSuspend: false,
      showStartBtn: true,
      showMore: true,
      // 注意：Earth和Cesium的相关变量放在vue中，必须使用下划线作为前缀！
      theEarth: undefined,
      treeData: [],
      timer: null,
      windAngleList: []
    };
  },
  created() {
    this.getWindAngleList()
  },
  mounted() {
    // this.firesInit()
    if (typeof XE !== 'undefined') {
      XE.ready().then(() => XE.HTML.loadMapV())
        .then(() => {
          try {
            this.createEarth()
          } catch (error) {
            console.log(error)
          }
          this.getAllFires()
        })
        .catch(err => {
          console.log(err)
        })
    } else if (typeof Cesium !== 'undefined') {
      this.createCesium()
    }
  },
  beforeDestroy() {
    this.theEarth = this.theEarth && this.theEarth.destroy()
  },
  methods: {
    handleSuspend() {
      this.showContinue = true
      this.showSuspend = false
      clearInterval(this.timer)
      this.timer = null
    },
    handleContinue() {
      this.showContinue = false
      this.showSuspend = true
      clearInterval(this.timer)
      this.treeFireTimer()
    },
    handleClickReset() {
      this.showStartBtn = true
      this.showContinue = false
      this.showSuspend = false
      this.resetFire()
    },
    getWindAngleList() {
      this.windAngleList = windAngleList.map(item => {
        return {
          label: item[0],
          value: item[1]
        }
      })
    },
    treeFireTimer() {
      const that = this
      this.timer = setInterval(() => {
        that.nextFire()
      }, 2000)
    },
    getAllFires() {
      getAllFires()
        .then(res => {
          if(res.data.code === 200) {
            this.treeData = res.data.data
            const idx = Number.parseInt(this.treeData.length / 2)
            this.flyToGoal(this.treeData[idx].treeLocationY, this.treeData[idx].treeLocationX)
          }
        })
        .then(() => {
          this.createTree(this.treeData)
        })
        // .then(() => {
        //   this.createModel(this.treeData)
        // })
        .catch(err => {
          console.log(err)
        })
    },
    firesInit() {
      let params = {
        fireRadiusMultiple: 1.5
      }
      firesInit(params)
        .then(res => {
          if(res.data.code === 200) {
            console.log(res.data.data)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    resetFire() {
      clearInterval(this.timer)
      this.timer = null
      // this.createTree(this.treeData)
      resetFire()
        .then(res => {
          if(res.data.code === 200) {
            console.log(res.data.data)
            this.createTree(res.data.data)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    formatTime(time) {
      return time ? dayjs(time).format('YYYY-MM-DD HH:mm') : ''
    },
    startFire(treeid) {
      this.fire.startTime = new Date()
      this.fire.currentTime = this.fire.startTime
      let params = {
        treeid: treeid
      }
      startFire(params)
        .then(res => {
          if(res.data.code === 200) {
            console.log(res.data.data)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    nextFire() {
      this.fire.currentTime = dayjs(this.fire.currentTime).add(30, 'm')
      let params = {
        a: this.fire.a,
        b: this.fire.b,
        c: this.fire.c,
        T: this.fire.temperature,
        W: this.fire.windGrade,
        windAngle: this.fire.windAngle,
        simulatedtime: this.fire.currentTime.format('YYYY-MM-DD HH:mm')
      }
      nextFire(params)
        .then(res => {
          if(res.data.code === 200) {
            const data = res.data.data
            this.createTree(data)
            // this.createModel(data)
            // this.flyToGoal(data[0].treeLocationY, data[0].treeLocationX)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleClickFire() {
      const firstFireTree = this.computeShortDistance()
      if(!firstFireTree) {
        return
      }
      this.showStartBtn = false
      this.showSuspend = true
      firstFireTree.status = 1
      this.createTree([firstFireTree])
      this.startFire(firstFireTree.treeid)
      this.treeFireTimer()
    },
    computeShortDistance() {
      var start = Cesium.Cartographic.fromDegrees(this.fire.longitude, this.fire.latitude)
      var minVal = 10000
      var minDisTree
      const that = this
      this.treeData.forEach(item => {
        var end = Cesium.Cartographic.fromDegrees(item.treeLocationY, item.treeLocationX)
        var dis = that.getDistance(start, end)
        if(dis < minVal) {
          minVal = dis
          minDisTree = item
        }
      })
      return minDisTree
    },
    getDistance(start, end) {
      var geodesic = new Cesium.EllipsoidGeodesic()
      geodesic.setEndPoints(start, end)
      var distance = geodesic.surfaceDistance
      return distance
    },
    flyToGoal(longitude, latitude) {
      this.theEarth.camera.flyTo([longitude*Math.PI/180, latitude*Math.PI/180, 10], 2000, [0*Math.PI/180, -40*Math.PI/180, 0])
      // this.theEarth.czm.viewer.setView({
      //   destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 1000)
      // })
    },
    createTree(treeDatas) {
      var viewer = this.theEarth.czm.viewer
      const tree0X = treeDatas[0].treeLocationX
      const tree0Y = treeDatas[0].treeLocationY
      treeDatas = treeDatas.map(elem => {
        return {
          geometry: {
            type: 'Point',
            coordinates: [elem.treeLocationY, elem.treeLocationX],
          },
          count: elem.status
        }
      })
      var dataSet = new mapv.DataSet(treeDatas)
      var options = {
        splitList: {
          0: 'rgba(0, 77, 0, 0.8)',
          1: 'rgba(204, 0, 0, 0.8)',
          2: 'rgba(26, 26, 26, 0.8)'
        },
        draw: 'category'
      }
      // this.flyToGoal(tree0Y, tree0X)
      var mapvLayer = XE.mixins.mapVLayer(viewer, dataSet, options)
    },
    createEarth() {
      var earth = new XE.Earth(this.$refs.earthContainer)
      earth.sceneTree.root = {
        children: [
          // {
          //   czmObject: {
          //     "name": 'OpenStreetMap',
          //     "imgUrl": './images/openstreetmap.jpg',
          //     "xbsjType": "Imagery",
          //     "xbsjImageryProvider": {
          //       "XbsjImageryProvider": {
          //         "url": '//c.tile.openstreetmap.org/{z}/{x}/{y}.png',
          //         "srcCoordType": 'WGS84',
          //         "dstCoordType": "WGS84",
          //       },
          //     }
          //   }
          // },
          {
            "czmObject": {
              "name": "天地图-影像",
              "xbsjType": "Imagery",
              "xbsjImageryProvider": {
                "XbsjImageryProvider": {
                  "url": "//t6.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=1c0b8ce9cfe7d851f0cfb8d399e5217a"
                },
              }
            }
          },
          {
            "czmObject": {
              "name": "天地图-标记",
              "xbsjType": "Imagery",
              "xbsjImageryProvider": {
                "XbsjImageryProvider": {
                  "url": "//t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=1c0b8ce9cfe7d851f0cfb8d399e5217a"
                },
              },
              xbsjZIndex:99
            }
          }
        ]
      };

      var viewer = earth.czm.viewer
      var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
      const that = this
      handler.setInputAction(function (event) {
        var position = earth.pickPosition(event.position)
        var longitude = Cesium.Math.toDegrees(position[0])
        var latitude = Cesium.Math.toDegrees(position[1])
        that.fire.longitude = longitude
        that.fire.latitude = latitude
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

      this.theEarth = earth
    },
    createTreeModel(tree) {
      var viewer = this.theEarth.czm.viewer
      // viewer.entities.removeAll()

      var url = './tree.glb'
      var position = Cesium.Cartesian3.fromDegrees(tree.treeLocationY, tree.treeLocationX, 500)
      var color = tree.status === 0 ? Cesium.Color.CHARTREUSE : tree.status === 1 ? Cesium.Color.RED : Cesium.Color.GREY
      var heightScale = 1.0 + Number.parseInt(tree.treeheight / 2) / 2

      var entity = viewer.entities.add({
        // id: tree.treeid,
        name: tree.treeid,
        position: position,
        model: {
          uri: url,
          scale: heightScale,
          minimumPixelSize: 128,
          maximumScale: 20000,
          id: tree.treeid,
          color: color
        },
      })
      
      // viewer.trackedEntity = entity
    },
    createModel(treeDatas) {
      treeDatas = treeDatas.map(elem => {
        this.createTreeModel(elem)
      })
    }
  }
}
</script>
<style scoped>
.earth-container {
  width: 100%;
  height: 100%;
}
.box {
  position: absolute;
  right: 18px;
  top: 18px;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  border-radius: 25px;
  min-width: 300px;
  font-size: 16px;
}
.tree-color {
  color: #6ec941;
  color: #c92525;
  color: #494646;
}
</style>