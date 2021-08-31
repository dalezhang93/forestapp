/* eslint-disable no-debugger */
/* eslint-disable no-undef */
// 两点之间抛物线绘制函数，twoPoints是一个数组：[lon1,lat1,lon2,lat2]
function animatedParabola(twoPoints, viewer) { //动态抛物线绘制
  let startPoint = [twoPoints[0], twoPoints[1], 0]; //起点的经度、纬度
  let end = [twoPoints[2], twoPoints[3]]; //终点的经度、纬度
  let step = 80; //线的数量，越多则越平滑
  let heightProportion = 0.125; //最高点和总距离的比值(即图中H比上AB的值)
  let dLon = (end[0] - startPoint[0]) / step; //经度差值
  let dLat = (end[1] - startPoint[1]) / step; //纬度差值
  let deltaLon = dLon * Math.abs(111000 * Math.cos(twoPoints[1])); //经度差(米级)
  let deltaLat = dLat * 111000; //纬度差(米),1纬度相差约111000米
  let endPoint = [0, 0, 0]; //定义一个端点（后面将进行startPoint和endPoint两点画线）
  let heigh = (step * Math.sqrt(deltaLon * deltaLon + deltaLat * deltaLat) * heightProportion).toFixed(0);
  let x2 = (10000 * Math.sqrt(dLon * dLon + dLat * dLat)).toFixed(0); //小数点扩大10000倍，提高精确度
  let a = (heigh / (x2 * x2)); //抛物线函数中的a
  function y(x, height) { //模拟抛物线函数求高度
    //此处模拟的函数为y = H - a*x^2 (H为高度常数)
    return height - a * x * x;
  }
  for (let i = 1; i <= step; i++) { //逐“帧”画线
    endPoint[0] = startPoint[0] + dLon; //更新end点经度
    endPoint[1] = startPoint[1] + dLat; //更新end点纬度
    let x = x2 * (2 * i / step - 1); //求抛物线函数x
    endPoint[2] = (y(x, heigh)).toFixed(0); //求end点高度
    viewer.clock.currentTime = Cesium.JulianDate.now(); //将时钟指针移到当前时间
    //这里viewer是容器初始化时new Cesium.Viewer构造的: var viewer = new Cesium.Viewer('mapContainer', {...});
    let IsoTime = Cesium.JulianDate.now(); //获取当前时间
    viewer.entities.add({ //添加动态线
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(startPoint.concat(endPoint)),
        width: 4,
        material: new Cesium.PolylineOutlineMaterialProperty({
          color: Cesium.Color.GOLD,
          outlineWidth: 0.3,
        })
      },
      availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ //设置显示的时间区间
        start: {
          dayNumber: IsoTime.dayNumber,
          secondsOfDay: IsoTime.secondsOfDay + ((i - 1) * 300),
        },
        stop: {
          dayNumber: IsoTime.dayNumber,
          secondsOfDay: IsoTime.secondsOfDay + (i * 300),
        },
      })]),
    });
    viewer.entities.add({ //添加静态线
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(startPoint.concat(endPoint)),
        width: 4,
        material: new Cesium.PolylineGlowMaterialProperty({
          color: Cesium.Color.AQUA.withAlpha(0.9),
          outlineWidth: 0.3,
          glowPower: 0.3,
        })
      },
    });
    // end点变为start点
    startPoint[0] = endPoint[0];
    startPoint[1] = endPoint[1];
    startPoint[2] = endPoint[2];
  }
  viewer.clock.shouldAnimate = true; //启动时钟开始转动
  viewer.clock.multiplier = 1600; //时钟转动速度
}

function parabola(twoPoints, viewer) { //抛物线绘制
  let startPoint = [twoPoints[0], twoPoints[1], 0]; //起点的经度、纬度
  let end = [twoPoints[2], twoPoints[3]]; //终点的经度、纬度
  let step = 10; //线的多少，越多则越平滑(但过多浏览器缓存也会占用越多)
  let heightProportion = 0.125; //最高点和总距离的比值
  let dLon = (end[0] - startPoint[0]) / step; //经度差值
  let dLat = (end[1] - startPoint[1]) / step; //纬度差值
  let deltaLon = dLon * Math.abs(111000 * Math.cos(twoPoints[1])); //经度差(米级)
  let deltaLat = dLat * 111000; //纬度差(米),1纬度相差约111000米
  let endPoint = [0, 0, 0]; //定义一个端点（后面将进行startPoint和endPoint两点画线）
  let heigh = (step * Math.sqrt(deltaLon * deltaLon + deltaLat * deltaLat) * heightProportion).toFixed(0);
  let x2 = (10000 * Math.sqrt(dLon * dLon + dLat * dLat)).toFixed(0); //小数点扩大10000倍，提高精确度
  let a = (heigh / (x2 * x2));
  function y(x, height) { return height - a * x * x; }
  for (var i = 1; i <= step; i++) { //逐“帧”画线
    endPoint[0] = startPoint[0] + dLon; //更新end点经度
    endPoint[1] = startPoint[1] + dLat; //更新end点纬度
    let x = x2 * (2 * i / step - 1); //求抛物线函数x
    endPoint[2] = (y(x, heigh)).toFixed(0); //求end点高度
    viewer.entities.add({ //添加静态线
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(startPoint.concat(endPoint)),
        width: 4,
        material: new Cesium.PolylineGlowMaterialProperty({
          color: Cesium.Color.AQUA.withAlpha(0.9),
          outlineWidth: 0.3,
          glowPower: 0.3,
        })
      },
    });
    // end点变为start点
    startPoint[0] = endPoint[0];
    startPoint[1] = endPoint[1];
    startPoint[2] = endPoint[2];
  }
}

export {
  animatedParabola,
  parabola
}