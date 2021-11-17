<template>
  <div>
    <div ref="earthContainer" class="earth-container"></div>
    <div class="earth-box">
      <el-button type="primary" v-if="showParamBox" @click="paramBoxVisible = !paramBoxVisible" size="mini">参数调整框</el-button>
    </div>
    <div class="dragg-wrapper" v-dialogDrag v-if="paramBoxVisible">
      <div class="dragg-container">
        <div class="dragg-header">
          <span>蔓延参数调整</span>
          <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="paramBoxVisible = false">
            <i class="el-icon-close"></i>
          </el-button>-->
        </div>
        <el-form ref="fire" :model="fire" :rules="rules" label-position="right" size="mini" label-width="140px">
          <el-row class="row-content-center">
            <el-col :span="18">
              <el-form-item label="林火蔓延模型库：" prop="fireModel">
                <el-select v-model="fire.fireModel" placeholder="请选择林火蔓延模型">
                  <el-option v-for="(item, index) in fireSpreadModelList" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              <el-form-item label="起火点设置："></el-form-item>
            </el-col>
            <el-col :span="22">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="经度：" prop="longitude">
                    <el-input v-model="fire.longitude"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="纬度：" prop="latitude">
                    <el-input v-model="fire.latitude"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="单木ID：" prop="treeid">
                    <el-input v-model="fire.treeid" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="单木高程(m)：" prop="treeHeight">
                    <el-input v-model="fire.treeHeight" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row class="oper-btn-row">
            <el-button round type="primary" size="mini" @click="handleClickFire">起火</el-button>
            <el-button v-if="showContinue" round size="mini" @click="handleContinue">继续</el-button>
            <el-button v-if="showSuspend" round size="mini" @click="handleSuspend">暂停</el-button>
            <el-button round size="mini" @click="handleClickReset">重置</el-button>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="起火时间：">
                <span>{{ formatTime(fire.startTime) }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="燃烧时间(s)：">
                <span>{{ fire.fireTime }}</span>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="当前时间：">
                <span>{{ formatTime(fire.currentTime) }}</span>
              </el-form-item>
            </el-col>-->
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="时间函数(s)：" prop="stepSeconds">
                <el-input v-model="stepSeconds" label="时间函数"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="火线时间间隔(s)：" prop="fireLineTimerSeconds">
                <el-input v-model="fireLineTimerSeconds" label="火线时间间隔："></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="环境温度(℃)：" prop="temperature">
                <el-input-number v-model="fire.temperature" :min="1" :max="100" label="温度"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="风力等级：" prop="windGrade">
                <el-input-number v-model="fire.windGrade" :min="0" :max="12" label="风力等级"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="湿度(%)：" prop="humidity">
                <el-input v-model="fire.humidity" label="湿度："></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="风向角度：" prop="windAngle">
                <el-select v-model="fire.windAngle" placeholder="请选择风向角度">
                  <el-option v-for="(item, index) in windAngleList" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div>
            <div v-if="showMore" @click="showMore = false">
              <span style="cursor: default;">展开</span>
              <i class="el-icon-caret-bottom"></i>
            </div>
            <div v-if="!showMore">
              <el-row class="oper-btn-row">
                <el-button round type="primary" size="mini" @click="firesInit">初始化</el-button>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="可燃物类型：" prop="vegetationType">
                    <el-select v-model="fire.vegetationType" placeholder="请选择 可自定义输入" filterable allow-create default-first-option>
                      <el-option v-for="(item, index) in vegetationTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="可燃物含水率(%)：" prop="waterRate">
                    <el-input v-model.number="fire.waterRate" label="可燃物含水率："></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- <el-form-item label="系数 a：" prop="a">
                <el-col :span="12">
                  <el-input v-model="fire.a"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="系数 b：" prop="b">
                <el-col :span="12">
                  <el-input v-model="fire.b"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="系数 c：" prop="c">
                <el-col :span="12">
                  <el-input v-model="fire.c"></el-input>
                </el-col>
              </el-form-item>-->
              <el-row class="row-content-center">
                <el-col :span="12">
                  <el-form-item prop="initSpeed">
                    <span slot="label">
                      <span>初始火焰蔓延速度 R</span>
                      <sub>0</sub>：
                    </span>
                    <el-input v-model="fire.initSpeed"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-content-center">
                <el-col :span="12">
                  <el-form-item prop="treeRatio">
                    <span slot="label">
                      <span>可燃物修正系数 K</span>
                      <sub>s</sub>：
                    </span>
                    <!-- <el-input v-model="fire.treeRatio"></el-input> -->
                    <el-select v-model="fire.treeRatio" placeholder="请选择 可自定义输入" filterable allow-create default-first-option>
                      <el-option v-for="(item, index) in treeRatioList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-content-center">
                <el-col :span="12">
                  <el-form-item prop="windRatio">
                    <span slot="label">
                      <span>风力修正系数 K</span>
                      <sub>w</sub>：
                    </span>
                    <el-input v-model="fire.windRatio"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-content-center">
                <el-col :span="12">
                  <el-form-item prop="slopeRatio">
                    <span slot="label">
                      <span>坡度修正系数 cos&#966;</span>：
                    </span>
                    <el-input v-model="fire.slopeRatio"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div v-if="!showMore" @click="showMore = true">
              <span style="cursor: default;">收起</span>
              <i class="el-icon-caret-top"></i>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-debugger */
import dayjs from 'dayjs'
// import draggable from 'vuedraggable'
// import VueDraggableResizable from 'vue-draggable-resizable'
// import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import { getAllFires, getAllFiresLocal, firesInit, nextFire, nextFireLocal, startFire, resetFire, fireLine } from '@/api/forest'
import { animatedParabola, parabola } from '@/utils/drawLine'
import BezierMaker from '@/utils/bezierMaker'
const statusColor = new Map([
  [0, '#67c23a'],
  [1, '#c92525'],
  [2, '#494646']
])
const windAngleList = [
  [180, '东'],
  [90, '南'],
  [0, '西'],
  [-90, '北'],
  [135, '东南'],
  [-135, '东北'],
  [45, '西南'],
  [-45, '西北']
]
const vegetationTypeList = [
  ['1', '水系'],
  ['2', '房屋'],
  ['3', '裸地'],
  ['4', '耕地'],
  ['5', '阔叶林'],
  ['6', '混交林'],
  ['7', '灌木丛'],
  ['8', '草地'],
  ['9', '针叶林']
]
const treeRatioList = [
  ['1', '耕地(1)'],
  ['1.3', '阔叶林(1.3)'],
  ['0.5', '混交林(0.5)'],
  ['1', '灌木丛(1)'],
  ['1.5', '草地(1.5)'],
  ['1.8', '针叶林(1.8)']
]
const fireSpreadModelList = [
  ['a', '三维元胞自动机林火蔓延模型'],
  ['b', 'Rothemel林火蔓延模型'],
  ['c', 'CFFDRS林火蔓延模型'],
  ['d', '王正非林火蔓延模型'],
  ['e', 'McArthur林火蔓延模型'],
  ['f', '自定义非确定性林火蔓延模型']
]
function convertArray(list) {
  return list.map(item => {
    return {
      label: item[1],
      value: item[0]
    }
  })
}
export default {
  name: 'EarthComp',
  components: {
    // draggable,
    // VueDraggableResizable
  },
  data() {
    // 非负浮点数
    const pattern = /^\d+(\.\d+)?$/
    return {
      // 定时器获取nextFire接口(下一组燃烧点)的时间间隔，以秒为单位
      treeFireTimerSeconds: 2,
      // 定时器获取fireline接口(火线)的时间间隔，以秒为单位
      fireLineTimerSeconds: 600,
      // 调用nextFire接口时，传递的时间参数增加的步长，以秒为单位。通过修改此变量的值更改燃烧的速度
      stepSeconds: 30,
      // 点击选中的点的经度
      longitude: null,
      // 点击选中的点的纬度
      latitude: null,
      fire: {
        longitude: null,
        latitude: null,
        treeid: '',
        treeHeight: '',
        // R0 = aT + bW - c
        a: 0.053,
        b: 0.048,
        c: 0.275,
        // 蔓延模型
        fireModel: 'a',
        // 湿度
        humidity: '',
        // 植被类型
        vegetationType: '',
        // 可燃物修正系数
        treeRatio: '',
        // 风力修正系数
        windRatio: '',
        // 坡度修正系数
        slopeRatio: '',
        // 温度：摄氏度
        temperature: 28,
        // 风力等级：1-12级
        windGrade: 3,
        // 风向角度：东、南、西、北、东南、东北、西南、西北
        windAngle: 180,
        // 时间：格式为20210801 23:36:00
        startTime: null,
        currentTime: null,
        fireTime: null
      },
      rules: {
        longitude: [
          { trigger: 'blur', pattern, message: '请输入正确的经度' }
        ],
        latitude: [
          { trigger: 'blur', pattern, message: '请输入正确的纬度' }
        ],
        a: [
          { trigger: 'blur', pattern, message: '请输入系数a 且需为数值' }
        ],
        b: [
          { trigger: 'blur', pattern, message: '请输入系数b 且需为数值' }
        ],
        c: [
          { trigger: 'blur', pattern, message: '请输入系数c 且需为数值' }
        ],
      },
      showContinue: false,
      showSuspend: false,
      beReset: false,
      showMore: true,
      // 注意：Earth和Cesium的相关变量放在vue中，必须使用下划线作为前缀！
      theEarth: undefined,
      treeData: [],
      timer: null,
      fireLineTimer: null,
      windAngleList: [],
      vegetationTypeList: [],
      treeRatioList: [],
      fireSpreadModelList: [],
      lastFiredTreeList: null,
      lastFiredTime: null,
      treeColor: new Map([
        // green
        [0, Cesium.Color.CHARTREUSE],
        // orange
        [1, Cesium.Color.RED],
        // blank
        [2, Cesium.Color.BLACK],
        // white
        [8, Cesium.Color.WHITE],
        // flame red
        [10, Cesium.Color.DARKRED],
      ]),
      paramBoxVisible: false,
      showParamBox: window.forestFire.showAdminSetting,
      startFireTree: null
    }
  },
  watch: {
    fireLineTimerSeconds(newVal, oldVal) {
      if(newVal !== oldVal) {
        clearInterval(this.fireLineTimer)
        this.fireLineTimer = null
        this.getFireLineTimer()
      }
    }
  },
  created() {
    this.windAngleList = convertArray(windAngleList)
    this.vegetationTypeList = convertArray(vegetationTypeList)
    this.fireSpreadModelList = convertArray(fireSpreadModelList)
    this.treeRatioList = convertArray(treeRatioList)
  },
  mounted() {
    // this.firesInit()
    if (typeof XE !== 'undefined') {
      XE.ready()
        .then(() => {
          const p1 = XE.HTML.loadMapV()
          const p2 = XE.HTML.loadJS('../../XbsjEarth-Plugins/plottingSymbol2/plottingSymbol2.js')
          return Promise.all([p1, p2])
        })
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
    clearInterval(this.timer)
    this.timer = null
    clearInterval(this.fireLineTimer)
    this.fireLineTimer = null
    this.theEarth = this.theEarth && this.theEarth.destroy()
  },
  methods: {
    createFlame(lng, lat, height) {
      var p = new XE.Obj.CustomGroundRectangle(this.theEarth)
      p.position = [lng, lat, height]
      p.width = 100
      p.height= 100
      p.canvasWidth = 100
      p.canvasHeight = 100
      p.imageUrl = './fire.png'
    },
    isFireLineInterval(end) {
      const interval = dayjs(end).valueOf() - this.fire.startTime.valueOf()
      return interval % (this.fireLineTimerSeconds * 1000) === 0
    },
    handleSuspend() {
      this.showContinue = true
      this.showSuspend = false
      clearInterval(this.timer)
      this.timer = null
      clearInterval(this.fireLineTimer)
      this.fireLineTimer = null
    },
    handleContinue() {
      this.beReset = false
      this.showContinue = false
      this.showSuspend = true
      clearInterval(this.timer)
      this.timer = null
      this.treeFireTimer()
      clearInterval(this.fireLineTimer)
      this.fireLineTimer = null
      this.getFireLineTimer()
    },
    handleClickReset() {
      this.beReset = true
      this.showContinue = false
      this.showSuspend = false
      clearInterval(this.timer)
      this.timer = null
      clearInterval(this.fireLineTimer)
      this.fireLineTimer = null
      var viewer = this.theEarth.czm.viewer
      viewer.scene.primitives.removeAll()
      this.resetFire()
    },
    treeFireTimer() {
      const that = this
      this.timer = setInterval(() => {
        that.nextFire()
      }, this.treeFireTimerSeconds*1000)
    },
    getFireLineTimer() {
      const that = this
      this.fireLineTimer = setInterval(() => {
        that.fireLine()
      }, this.fireLineTimerSeconds*1000)
    },
    fireLine() {
      fireLine()
        .then(res => {
          if(res.data.code === 200) {
            const data = res.data.data
            if(!data || !data.length) {
              return
            }
            data.forEach(item => {
              item.status = 8
            })
            // 暂停或重置时，接口返回数据延迟不再渲染
            if(this.beReset || this.showContinue) {
              return
            }
            this.createStickTrees(data)
            this.drawFireLine(this.fireLineSort(data))
          }
        })
        .catch(err => {
          console.log(err)
        })
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
          this.createStickTrees(this.treeData)
          // 划线test
          // this.drawFireLine(this.treeData)
          // this.drawParabolaLine(this.treeData)
          // this.drawSmoothPolygon(this.treeData)
        })
        // .then(() => {
        //   this.createModelTrees(this.treeData)
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
      resetFire()
        .then(res => {
          if(res.data.code === 200) {
            // getAllFires()
            //   .then(res => {
            //     if(res.data.code === 200) {
            //       this.treeData = res.data.data
            //     }
            //   })
            //   .then(() => {
            //     this.createStickTrees(this.treeData)
            //   })
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.treeData.forEach(item => {
        item.status = 0
      })
      this.createStickTrees(this.treeData)
    },
    formatTime(time) {
      return time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    startFire(treeid) {
      this.fire.startTime = new Date()
      this.fire.currentTime = this.fire.startTime
      this.fire.fireTime = dayjs(this.fire.currentTime).diff(dayjs(this.fire.startTime), 'second')
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
      this.fire.currentTime = dayjs(this.fire.currentTime).add(this.stepSeconds, 's')
      this.fire.fireTime = dayjs(this.fire.currentTime).diff(dayjs(this.fire.startTime), 'second')
      let params = {
        a: this.fire.a,
        b: this.fire.b,
        c: this.fire.c,
        T: this.fire.temperature,
        W: this.fire.windGrade,
        windAngle: this.fire.windAngle,
        simulatedtime: this.formatTime(this.fire.currentTime)
      }
      nextFire(params)
        .then(res => {
          if(res.data.code === 200) {
            const data = res.data.data
            if(!data || !data.length) {
              return
            }
            if(this.lastFiredTreeList) {
              // const flag = this.isFireLineInterval(this.lastFiredTime)
              const flag = false
              if(flag) {
                this.lastFiredTreeList.forEach(item => {
                  item.status = 8
                })
              }
              // 暂停或重置时，接口返回数据延迟不再渲染
              if(this.beReset || this.showContinue) {
                return
              }
              this.createStickTrees(this.lastFiredTreeList)
            }
            // 暂停或重置时，接口返回数据延迟不再渲染
            if(this.beReset || this.showContinue) {
              return
            }
            this.createStickTrees(data)
            this.lastFiredTreeList = data
            this.lastFiredTime = this.fire.currentTime
            // this.createModelTrees(data)
            // this.flyToGoal(data[0].treeLocationY, data[0].treeLocationX)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleClickFire() {
      this.$refs.fire.validate(valid => {
        if(!valid) {
          return
        }
      })
      const firstFireTree = this.computeShortDistance()
      if(!firstFireTree) {
        return
      }
      this.beReset = false
      this.showSuspend = true
      this.startFireTree = firstFireTree
      const newFirstFireTree = JSON.parse(JSON.stringify(firstFireTree))
      newFirstFireTree.status = 10
      this.createStickTrees([newFirstFireTree], { pixelSize: 18 })
      // this.createFlame(newFirstFireTree.treeLocationY, newFirstFireTree.treeLocationX, newFirstFireTree.treeLocationNz)
      this.startFire(newFirstFireTree.treeid)
      this.treeFireTimer()
      this.getFireLineTimer()
    },
    computeShortDistance() {
      var start = Cesium.Cartographic.fromDegrees(this.longitude, this.latitude)
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
    flyToGoal(longitude, latitude, height = 2000) {
      this.theEarth.camera.flyTo([longitude*Math.PI/180, latitude*Math.PI/180, 10], height, [0*Math.PI/180, -40*Math.PI/180, 0])
      // this.theEarth.czm.viewer.setView({
      //   destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 1000)
      // })
    },
    createMapvTree(treeDatas) {
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
          // green
          0: 'rgba(0, 77, 0, 1)',
          // red
          1: 'rgba(204, 0, 0, 1)',
          // blank
          2: 'rgba(26, 26, 26, 1)',
          // white
          8: 'rgba(255, 255, 255, 1)',
          // red
          10: 'rgba(204, 0, 0, 1)'
        },
        draw: 'category'
      }
      // this.flyToGoal(tree0Y, tree0X)
      var mapvLayer = XE.mixins.mapVLayer(viewer, dataSet, options)
    },
    drawMapvFireLine(treeDatas) {
      var viewer = this.theEarth.czm.viewer
      var mapvData = []
      for (let index = 0; index < treeDatas.length; index++) {
        const tree1X = treeDatas[index].treeLocationX
        const tree1Y = treeDatas[index].treeLocationY
        var tree2X = treeDatas[index].treeLocationX
        var tree2Y = treeDatas[index].treeLocationY
        if(index === treeDatas.length - 1) {
          tree2X = treeDatas[0].treeLocationX
          tree2Y = treeDatas[0].treeLocationY
        }else {
          tree2X = treeDatas[index+1].treeLocationX
          tree2Y = treeDatas[index+1].treeLocationY
        }
        mapvData.push({
          geometry: {
            type: 'LineString',
            coordinates: [[tree1Y, tree1X],[tree2Y, tree2X]]
          }
        })
      }
      var dataSet = new mapv.DataSet(mapvData)
      var options = {
        strokeStyle: 'rgba(255, 255, 255, 1)',
        lineWidth: 2,
        draw: 'simple'
      }
      var mapvLayer = XE.mixins.mapVLayer(viewer, dataSet, options)
    },
    drawParabolaLine(treeDatas) {
      var viewer = this.theEarth.czm.viewer
      for (let index = 0; index < treeDatas.length; index++) {
        const tree1X = treeDatas[index].treeLocationX
        const tree1Y = treeDatas[index].treeLocationY
        var tree2X = treeDatas[index].treeLocationX
        var tree2Y = treeDatas[index].treeLocationY
        if(index === treeDatas.length - 1) {
          tree2X = treeDatas[0].treeLocationX
          tree2Y = treeDatas[0].treeLocationY
        }else {
          tree2X = treeDatas[index+1].treeLocationX
          tree2Y = treeDatas[index+1].treeLocationY
        }
        parabola([tree1Y, tree1X, tree2Y, tree2X], viewer)
      }
    },
    drawSmoothPolygon(treeDatas) {
      // var viewer = this.theEarth.czm.viewer
      // var geoData = treeDatas.map(item => {
      //   return Cesium.Cartesian3.fromDegrees(item.treeLocationY, item.treeLocationX, item.treeLocationNz)
      // })
      // const entity = {
      //   polygon: {
      //     hierarchy: geoData,
      //     extrudedHeight: 50000,
      //     material: Cesium.Color.MAGENTA,
      //     outline: true,
      //     outlineColor: Cesium.Color.WHITE,
      //     arcType: Cesium.ArcType.ROAD_ON_DEMAND,
      //   },
      // }
      // viewer.entities.add(entity)


      var geoData = treeDatas.map(item => {
        // return Cesium.Cartesian3.fromDegrees(item.treeLocationY, item.treeLocationX, item.treeLocationNz)
        return [item.treeLocationY, item.treeLocationX, item.treeLocationNz]
      })
      var polygon = {
        "ref": "polygon",
        "czmObject": {
          "xbsjType": "GeoSmoothPolygon",
          "positions": geoData
        },
        // outline: true,
        // outlineColor: Cesium.Color.WHITE
      }
      this.theEarth.czm.viewer.entities.add(polygon)
      // this.theEarth.sceneTree.root.children.push('polygon', polygon)
    },
    drawFireLine(treeDatas) {
      var viewer = this.theEarth.czm.viewer
      var that = this
      var geoData = treeDatas.map(item => {
        return Cesium.Cartesian3.fromDegrees(item.treeLocationY, item.treeLocationX, item.treeLocationNz)
      })
      var primitive = new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
          geometry: new Cesium.PolylineGeometry({
            positions: geoData,
            width: 2.0,
            vertexFormat : Cesium.PolylineColorAppearance.VERTEX_FORMAT
          }),
          attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(that.treeColor.get(8))
          }
        }),
        appearance : new Cesium.PolylineColorAppearance({
          translucent : false
        })
      })
      viewer.scene.primitives.add(primitive)
    },
    fireLineSort(treeDatas) {
      if(this.startFireTree && treeDatas && treeDatas.length > 0) {
        const leftTop = [], rightTop = [], rightBottom = [], leftBottom = []
        treeDatas.forEach(item => {
          item.xNum = Number.parseFloat(item.treeLocationX)
          item.yNum = Number.parseFloat(item.treeLocationY)
          const xDis = item.xNum - Number.parseFloat(this.startFireTree.treeLocationX)
          const yDis = item.yNum - Number.parseFloat(this.startFireTree.treeLocationY)
          if(xDis <= 0 && yDis > 0) {
            leftTop.push(item)
          } else if(xDis > 0 && yDis >= 0) {
            rightTop.push(item)
          } else if(xDis >= 0 && yDis < 0) {
            rightBottom.push(item)
          } else if(xDis < 0 && yDis <= 0) {
            leftBottom.push(item)
          }
        })
        leftTop.sort((a, b) => {
          return a.xNum - b.xNum || a.yNum - b.yNum
        })
        rightTop.sort((a, b) => {
          return a.xNum - b.xNum || b.yNum - a.yNum
        })
        rightBottom.sort((a, b) => {
          return b.xNum - a.xNum || b.yNum - a.yNum
        })
        leftBottom.sort((a, b) => {
          return b.xNum - a.xNum || a.yNum - b.yNum
        })
        treeDatas = [...leftTop, ...rightTop, ...rightBottom, ...leftBottom]
      }
      return treeDatas
    },
    createEarth() {
      var earth = new XE.Earth(this.$refs.earthContainer)
      earth.sceneTree.root = {
        children: [
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
        that.longitude = Cesium.Math.toDegrees(position[0])
        that.latitude = Cesium.Math.toDegrees(position[1])
        var minDisTree = that.computeShortDistance()
        that.fire.longitude = minDisTree.treeLocationY
        that.fire.latitude = minDisTree.treeLocationX
        that.fire.treeid = minDisTree && minDisTree.treeid
        that.fire.treeHeight = minDisTree && minDisTree.treeLocationNz
        that.$refs.fire.validate(valid => {})
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

      this.theEarth = earth
      this.flyToGoal(114.062930, 22.544420, 5000)
    },
    createTreeModel(tree) {
      var viewer = this.theEarth.czm.viewer
      // viewer.entities.removeAll()

      var url = './tree.glb'
      var position = Cesium.Cartesian3.fromDegrees(tree.treeLocationY, tree.treeLocationX, tree.treeLocationNz)
      var color = this.treeColor.get(tree.status)
      var heightScale = Number.parseInt(tree.treeheight / 2) / 2

      var entity = viewer.entities.add({
        // id: tree.treeid,
        name: tree.treeid,
        position: position,
        model: {
          uri: url,
          scale: heightScale,
          minimumPixelSize: 128,
          maximumScale: 200,
          id: tree.treeid,
          color: color
        }
        // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      })
      
      viewer.trackedEntity = entity
    },
    createModelTrees(treeDatas) {
      var viewer = this.theEarth.czm.viewer
      var url = './ts.gltf'
      // viewer.entities.removeAll()
      treeDatas.forEach(tree => {
        var position = Cesium.Cartesian3.fromDegrees(tree.treeLocationY, tree.treeLocationX, tree.treeLocationNz)
        var color = this.treeColor.get(tree.status)
        var heightScale = Number.parseInt(tree.treeheight / 2) / 2
        var entity = {
          name: tree.treeid,
          position: position,
          model: {
            uri: url,
            scale: heightScale,
            minimumPixelSize: 128,
            maximumScale: 200,
            id: tree.treeid,
            color: color
          },
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
        viewer.entities.add(entity)
      })
    },
    create3dTrees(treeDatas) {
      // var viewer = this.theEarth.czm.viewer
      // var instances = treeDatas.map(tree => {
      //   var position = Cesium.Cartesian3.fromDegrees(tree.treeLocationY, tree.treeLocationX, tree.treeLocationNz)
      //   var heightScale = Number.parseInt(tree.treeheight / 2) / 2
      //   var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position)
      //   Cesium.Matrix4.multiplyByUniformScale(modelMatrix, heightScale, modelMatrix)
      //   return { modelMatrix: modelMatrix }
      // })
      // // viewer.scene.primitives.removeAll()
      // var primitive = new Cesium.ModelInstanceCollection({
      //   url: "./ts.gltf",
      //   instances: instances
      // })
      // viewer.scene.primitives.add(primitive)

      var viewer = this.theEarth.czm.viewer
      treeDatas.forEach(tree => {
        var position = Cesium.Cartesian3.fromDegrees(tree.treeLocationY, tree.treeLocationX, tree.treeLocationNz)
        var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position)
        var color = this.treeColor.get(tree.status)
        var model = Cesium.Model.fromGltf({
          url: './ts.gltf',
          modelMatrix: modelMatrix,
          minimumPixelSize: 128,
          maximumScale: 200,
          color: color
        })
        viewer.scene.primitives.add(model)
      })
    },
    createStickTrees(treeDatas, options) {      
      var viewer = this.theEarth.czm.viewer
      var points = viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection())
      treeDatas = treeDatas.forEach(tree => {
        var position = Cesium.Cartesian3.fromDegrees(tree.treeLocationY, tree.treeLocationX, tree.treeLocationNz)
        var color = this.treeColor.get(tree.status)
        points.add(Object.assign({
          position,
          color
        }, options))
      })
    }
  }
}
</script>
<style>
.row-content-center {
  display: flex;
  justify-content: center;
}
.oper-btn-row {
  margin: 0 0 18px;
}
.el-col .el-select {
  width: 100%;
}
.el-form-item__label {
  /* color: #cdd3d9 !important; */
  font-size: 12px !important;
}
.earth-container {
  width: 100%;
  height: 100%;
}
.earth-box {
  position: absolute;
  left: 20px;
  top: 20px;
  color: white;
  /* background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  border-radius: 25px;
  min-width: 300px; */
  font-size: 14px;
}
.dragg-wrapper::after {
  content: " ";
  clear: both;
  display: block;
  height: 0;
  visibility: hidden;
}
.dragg-container {
  position: absolute;
  left: 20px;
  top: 60px;
  width: 35%;
  padding: 0 20px 20px 0;
  border-radius: 6px;
  background: #fff;
  font-size: 14px;
  /* max-height: 800px;
  overflow: auto; */
}
.dragg-header {
  padding: 20px 0;
}
.tree-color {
  color: #6ec941;
  color: #c92525;
  color: #494646;
}
</style>