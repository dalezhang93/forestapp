// 贝塞尔曲线二维转三维  返回一个三维点数组
// 参数： x1,y1,x2,y2,h 两点经纬度坐标和飞线高度
export function getBSRPoints(x1, y1, x2, y2, h) {
  let point1 = [y1, 0]
  let point2 = [(y2 + y1) / 2, h]
  let point3 = [y2, 0]
  let arr = getBSR(point1, point2, point3)
  let arr3d = []
  for (let i in arr) {
    let x = (x2 - x1) * (arr[i][0] - y1) / (y2 - y1) + x1
    arr3d.push([x, arr[i][0], arr[i][1]])
  }
  return arr3d
}
export function getBSRxyz(x1, y1, x2, y2, h) {
  let arr3d = getBSRPoints(x1, y1, x2, y2, h)
  let arrAll = []
  for (let i in arr3d) {
    arrAll.push(arr3d[i][0])
    arrAll.push(arr3d[i][1])
    arrAll.push(arr3d[i][2])
  }
  return arrAll
}
// 生成贝塞尔曲线
function getBSR(point1, point2, point3) {
  var ps = [{ x: point1[0], y: point1[1] }, { x: point2[0], y: point2[1] }, { x: point3[0], y: point3[1] }]
  let guijipoints = CreateBezierPoints(ps, 100);
  return guijipoints
}
// 贝赛尔曲线算法
// 参数：
// anchorpoints: [{ x: 116.30, y: 39.60 }, { x: 37.50, y: 40.25 }, { x: 39.51, y: 36.25 }]
function CreateBezierPoints(anchorpoints, pointsAmount) {
  var points = [];
  for (var i = 0; i < pointsAmount; i++) {
    var point = MultiPointBezier(anchorpoints, i / pointsAmount)
    points.push([point.x, point.y]);
  }
  return points;
}
function MultiPointBezier(points, t) {
  var len = points.length;
  var x = 0, y = 0;
  var erxiangshi = function (start, end) {
    var cs = 1, bcs = 1;
    while (end > 0) {
      cs *= start;
      bcs *= end;
      start--;
      end--;
    }
    return (cs / bcs);
  };
  for (var i = 0; i < len; i++) {
    var point = points[i];
    x += point.x * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (erxiangshi(len - 1, i));
    y += point.y * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (erxiangshi(len - 1, i));
  }
  return { x: x, y: y };
}
