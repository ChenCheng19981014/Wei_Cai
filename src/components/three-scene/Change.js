/**
 * 交付项目时场景不可留有log ***
 * 记得开启
 */
// const console = {
//   log: () => { }
// }

import { Utils } from "run-scene-v2";
import bus from "./Bus";
import * as THREE from "three";
import RoadMap from "./const";
// 声明变量
let camera, scene, controls, renderer2, renderer, dom, t, p, runScene, Bus;
// 工具
const { getRes, getMacro } = Utils;
// 拿资源
const setAssets = (assets) => {
  camera = assets.camera;
  scene = assets.scene;
  controls = assets.controls;
  renderer = assets.renderer;
  dom = assets.engineDom;
  t = assets.t;
  // renderer2 = assets.renderer2;
  // p = assets.p;
};

//  页面接口总出口
function Change(runScene) {
  /* 拿资源 分解资源
        this挂载至t上
        runScene上的其他Api可以直接runScene.直接使用
    */
  setAssets({ ...runScene.assetsEx.get(), t: this, runScene });

  // 挂载runScene
  t.runScene = runScene;

  // 懒加载结束回调
  runScene.on("lazyLoadedTexture", () => { });

  // 加载后回调
  runScene.on("loaded", (a) => { });

  // 最后一帧加载回调
  runScene.on("complete", async () => {
    // 每帧渲染
    // t.runScene.cb.render.add("每帧渲染注册名称", () => { });

    /**
     * 注册事件
     * 均必须***需要等待场景加载到最后生命周期执行
     * (防止报错)***
     */
    this.events = new Events();

    this.moveMachine = new MoveMachine();

    this.moveMachine.init();

    // controls.maxPolarAngle = Math.PI / 2 - 0.2;

    // controls.screenSpacePanning = false;

    // 入场动画
    t.events.cameraFoucs(
      {
        cx: -5013.515237318247,
        cy: 3245.588404416484,
        cz: -8036.278141760255,
        tx: -4681.286120950418,
        ty: 288.1998663090785,
        tz: -3353.178373424808,
      },
      1
    );
  });

  // 模型特殊处理 加载初始不显示
  runScene.on("modelLoaded", (models) => {
    // console.log(models, "models");
  });

  // 销毁
  this.dispose = () => runScene.dispose();
}

// 移动模型模块
class MoveMachine {
  machine1 = null;
  machine2 = null;
  // 路线表
  roadMap = RoadMap;

  // 模型的映射表
  machineType = {
    ydj: t.runScene.modelEx.getModel("移动件"),
  };

  // 克隆的模型对象
  cloneMachineModelMap = {};

  // 点位数组
  positonArray = [];

  // 是否第一次加载克隆
  isCloneFirstMap = {};

  // 生成的路线
  savedRoutes = [];

  firstLength = null;

  isFrist = false;

  moveSpeed = 0.01

  init() {
    // 设置路线
    this.setRoadMap();

    // 获取路线
    this._setLine();

    // 默认第一个不显示
    this.machineType["ydj"].visible = false;
  }

  // 临时测试机器移动
  async testMahcineMove() {
    await this.testMove(this.setMove("id1", "ydj", "ST01-ST02"))
    await this.testMove(this.setMove("id1", "ydj", "ST02-ST03"))
    await this.testMove(this.setMove("id1", "ydj", "ST03-ST04"))
    await this.testMove(this.setMove("id1", "ydj", "ST04-ST08"))
    await this.testMove(this.setMove("id1", "ydj", "ST08-ST09"))
    await this.testMove(this.setMove("id1", "ydj", "ST09-ST10"))
    await this.testMove(this.setMove("id1", "ydj", "ST10-ST11"))
    await this.testMove(this.setMove("id1", "ydj", "ST11-ST12"))
    await this.testMove(this.setMove("id1", "ydj", "ST12-ST13"))
    await this.testMove(this.setMove("id1", "ydj", "ST13-ST14"))
    await this.testMove(this.setMove("id1", "ydj", "ST14-ST15"))
    await this.testMove(this.setMove("id1", "ydj", "ST15-ST16"))
    await this.testMove(this.setMove("id1", "ydj", "ST16-ST17"))
    await this.testMove(this.setMove("id1", "ydj", "ST17-ST18"))
    await this.testMove(this.setMove("id1", "ydj", "ST18-ST19"))
    await this.testMove(this.setMove("id1", "ydj", "ST19-ST20"))
    await this.testMove(this.setMove("id1", "ydj", "ST20-ST21"))
    await this.testMove(this.setMove("id1", "ydj", "ST21-ST22"))
    await this.testMove(this.setMove("id1", "ydj", "ST22-ST23"))
    await this.testMove(this.setMove("id1", "ydj", "ST23-ST24"))
    await this.testMove(this.setMove("id1", "ydj", "ST24-ST25"))
    await this.testMove(this.setMove("id1", "ydj", "ST25-ST26"))
    await this.testMove(this.setMove("id1", "ydj", "ST26-ST27"))
    await this.testMove(this.setMove("id1", "ydj", "ST27-ST28"))
    await this.testMove(this.setMove("id1", "ydj", "ST28-ST29"))
    await this.testMove(this.setMove("id1", "ydj", "ST29-ST31"))
    await this.testMove(this.setMove("id1", "ydj", "ST31-ST32"))
    await this.testMove(this.setMove("id1", "ydj", "ST32-ST33"))
    await this.testMove(this.setMove("id1", "ydj", "ST33-ST34"))
    await this.testMove(this.setMove("id1", "ydj", "ST34-ST35"))
    await this.testMove(this.setMove("id1", "ydj", "ST35-ST36"))
    await this.testMove(this.setMove("id1", "ydj", "ST36-ST37"))
    await this.testMove(this.setMove("id1", "ydj", "ST37-ST38"))
    await this.testMove(this.setMove("id1", "ydj", "ST38-ST39"))
    await this.testMove(this.setMove("id1", "ydj", "ST39-ST40"))
    await this.testMove(this.setMove("id1", "ydj", "ST40-ST41"))
    await this.testMove(this.setMove("id1", "ydj", "ST41-ST42"))
    await this.testMove(this.setMove("id1", "ydj", "ST42-ST43"))
    await this.testMove(this.setMove("id1", "ydj", "ST43-ST44"))
    await this.testMove(this.setMove("id1", "ydj", "ST44-ST45"))
    await this.testMove(this.setMove("id1", "ydj", "ST45-ST46"))
    await this.testMove(this.setMove("id1", "ydj", "ST46-ST47"))
    await this.testMove(this.setMove("id1", "ydj", "ST47-ST48"))
    await this.testMove(this.setMove("id1", "ydj", "ST48-ST49"))
    await this.testMove(this.setMove("id1", "ydj", "ST49-ST50"))
    await this.testMove(this.setMove("id1", "ydj", "ST50-ST51"))
    await this.testMove(this.setMove("id1", "ydj", "ST51-ST52"))
    await this.testMove(this.setMove("id1", "ydj", "ST52-ST53"))
    await this.testMove(this.setMove("id1", "ydj", "ST53-ST54"))
    await this.testMove(this.setMove("id1", "ydj", "ST54-ST55"))
    await this.testMove(this.setMove("id1", "ydj", "ST55-ST56"))
    await this.testMove(this.setMove("id1", "ydj", "ST56-ST57"))
    await this.testMove(this.setMove("id1", "ydj", "ST57-ST58"))
    await this.testMove(this.setMove("id1", "ydj", "ST58-ST59"))
    await this.testMove(this.setMove("id1", "ydj", "ST59-ST60"))
    await this.testMove(this.setMove("id1", "ydj", "ST60-ST61"))
    await this.testMove(this.setMove("id1", "ydj", "ST61-ST62"))
    await this.testMove(this.setMove("id1", "ydj", "ST62-ST63"))
    await this.testMove(this.setMove("id1", "ydj", "ST63-ST64"))
    await this.testMove(this.setMove("id1", "ydj", "ST64-ST65"))
    await this.testMove(this.setMove("id1", "ydj", "ST65-ST66"))
    await this.testMove(this.setMove("id1", "ydj", "ST66-ST67"))
    await this.testMove(this.setMove("id1", "ydj", "ST67-ST68"))
    await this.testMove(this.setMove("id1", "ydj", "ST68-ST69"))
    await this.testMove(this.setMove("id1", "ydj", "ST69-ST70"))
    await this.testMove(this.setMove("id1", "ydj", "ST70-ST71"))
    await this.testMove(this.setMove("id1", "ydj", "ST71-ST72"))
    await this.testMove(this.setMove("id1", "ydj", "ST72-ST73"))
    await this.testMove(this.setMove("id1", "ydj", "ST73-ST74"))
    await this.testMove(this.setMove("id1", "ydj", "ST74-ST75"))
    await this.testMove(this.setMove("id1", "ydj", "ST75-ST79"))
    await this.testMove(this.setMove("id1", "ydj", "ST79-ST01"))
  }

  // 测试使用
  testMove(fn) {
    return new Promise((s) => {
      let timer = setTimeout(() => {
        fn && fn();
        s() && timer && clearTimeout(timer);
      }, 3000);
    })
  }

  // 设置路线---点
  _setLine() {
    Object.keys(this.roadMap).map((i) => {
      const { spot } = this.roadMap[i];
      this.roadMap[i]["spot"] = [];
      let array = [];
      Object.values(spot).map((m) => {
        array.push(
          new THREE.Vector3(
            m.model.position.x,
            m.model.position.y,
            m.model.position.z
          )
        );
      });
      this.roadMap[i]["spot"] = array;
    });
  }

  // 开始行走
  setMove(id, type, location) {
    // 刷新数据和线段
    this.refreshData(id);

    const model = this.addModel(id, type);
    // 清除对应的定时器
    this.clearTimer(model);
    // 去除要走的线位置
    let temporaryArray = [...this.roadMap[location]["spot"]];
    // 存储  模型的位置
    const savePosition = model.savePosition;

    // 第一次必须要立刻进入路线
    if (!this.isCloneFirstMap[id]) {
      this.isCloneFirstMap[id] = id;
    } else {
      temporaryArray.unshift(
        new THREE.Vector3(
          (savePosition && savePosition.x) || model.position.x,
          (savePosition && savePosition.y) || model.position.y,
          (savePosition && savePosition.z) || model.position.z
        )
      );
    }

    const { curve } = this.getCurve(temporaryArray, true);

    temporaryArray = [];

    // 基本信息
    const lineInfo = {
      id,
      model,
      location,
      curve,
    };

    const mahcineInfo = this.setLine(lineInfo);

    // 移动
    this.move(mahcineInfo);
  }

  // 清除定时器
  clearTimer(model) {
    clearInterval(model.timer);
  }

  // 刷新数据
  refreshData(id) {
    Object.values(this.roadMap).map((i) => {
      const machine = i.machine;
      if (!machine.includes(id)) return;
      const index = machine.indexOf(id);
      machine.splice(index, 1);
    });

    this.clearLine();
  }

  // 添加模型至场景
  addModel(id, type) {
    // 若已经克隆过后即不再进行克隆 直接使用
    if (this.cloneMachineModelMap[id]) return this.cloneMachineModelMap[id];
    const model = t.runScene.modelEx.clone(this.machineType[type]);
    // 显示
    model.visible = true;
    t.runScene.modelEx.add(model);
    this.cloneMachineModelMap[id] = model;
    return model;
  }

  // 设置路线的映射表
  setRoadMap() {
    Object.keys(this.roadMap).map((roads) => {
      const road = this.roadMap[roads];
      Object.keys(road).map((r) => {
        const { spot } = this.roadMap[roads];
        Object.keys(spot).map((sp) => {
          this.roadMap[roads].spot[sp]["model"] =
            t.runScene.modelEx.getModel(sp);
        });
      });
    });
  }

  // 生成线
  setLine(lineInfo) {
    // 设备id 模型 地址
    const { id, model, location, curve } = lineInfo;

    const { machine } = this.roadMap[location];

    // 俩点之间存放设备id数
    machine.push(id);

    const num = machine.indexOf(id) + 1;

    let percent = 0;

    const mahcineInfo = {
      model,
      num,
      curve,
      percent,
    };
    return mahcineInfo;
  }

  // 清除线
  clearLine() {
    console.log(this.savedRoutes, "this.savedRoutes");
    this.savedRoutes.map((i) => {
      t.runScene.modelEx.remove(i);
    });
    this.savedRoutes = [];
  }

  // 移动
  move(mahcineInfo) {
    let { model, num, curve, percent } = mahcineInfo;

    let newNum = num == 1 ? 0.9 : 1 - 1 / num;

    const length = curve.getLength();

    if (!this.isFrist) {
      this.isFrist = true;
      this.firstLength = length;
    }

    console.log(this.firstLength, 'this.firstLength');

    const proportion = length / this.firstLength || 1;

    const bl = proportion * this.moveSpeed

    // 从上一个判断她的速度
    this.moveSpeed = bl

    console.log(this.moveSpeed, bl, length, '比例', proportion, 'moveSpeed');

    // console.log(length, this.lastLength, proportion, this.moveSpeed, 'moveSpeed');

    this.lastLength = length;

    model.timer = setInterval(() => {

      // 模型的朝向
      model.lookAt(curve.getPointAt(percent + 0.01));
      // 模型的位置
      model.position.set(
        curve.getPointAt(percent).x,
        curve.getPointAt(percent).y,
        curve.getPointAt(percent).z
      );
      // 模型的进度
      percent += this.moveSpeed;

      // let lerp = curve.getLength() / (test + curve.getLength());

      // model.savePosition = curve.getPointAt(lerp * percent);

      model.savePosition = curve.getPointAt(percent);

      if (percent >= newNum) {
        // 到达一定的值就清空定时器
        // 当走完过后复位原点
        // console.log("清空");
        model.timer && clearInterval(model.timer);

        model.timer = null;
      }
    }, 16);
  }

  getNamesByNum(baseName, length, beginNum = 1, endName) {
    return new Array(length).fill("").map((_, index) => {
      const nowIndex = index + beginNum;
      return baseName + nowIndex + (endName ? endName : "");
    });
  }

  getNameMapModel(nameList) {
    const map = {};
    nameList.map((name) => {
      map[name] = pb.getModel(name);
    });
    return map;
  }

  getCurve(positions, showLine = false) {
    let curve = new THREE.CatmullRomCurve3(positions);

    let geometry = new THREE.BufferGeometry(); //创建一个缓冲类型几何体

    let pointsArr = curve.getSpacedPoints(curve.getLength() / 1000); //分段数100，返回101个顶点
    // let pointsArr = curve.getSpacedPoints(100); //分段数100，返回101个顶点

    // let cube = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), new THREE.LineBasicMaterial({
    //   color: "#ff0000"
    // }));
    // cube.scale.set(5, 5, 5)

    // pointsArr.map((i, _) => {

    //   let newCube = cube.clone()

    //   newCube.position.set(i.x, i.y, i.z);

    //   t.runScene.modelEx.add(newCube);
    // });

    geometry.setFromPoints(pointsArr);

    let material = new THREE.LineBasicMaterial({
      color: "#ff0000",
      opacity: 1.0,
      linewidth: 1,
    });

    let line = new THREE.Line(geometry, material);

    line.scale.set(50, 50, 50);

    this.savedRoutes.push(line);

    scene.add(line);

    line.visible = true;

    return { line, curve };
  }
}

// 基本事件
class Events {
  constructor() {
    controls.addEventListener("start", this.controlStart);
    t.runScene.cb.events.pointer.down.add("pointerDown", this.mouseDown);
    t.runScene.cb.events.pointer.up.add("pointerUp", this.mouseUp);
  }

  showAnima(info) {
    const { model, isShow, time, cb, opacity } = info;
    const models = [];
    model.traverse((m) => {
      if (m.type === "Group") return;
      if (m.type === "Object3D") return;
      m.material.transparent = true;
      isShow ? (m.material.opacity = 0) : null;
      models.push(m);
    });
    if (isShow) model.visible = isShow;
    Utils.anima(
      { opc: isShow ? 0 : opacity || 1 },
      { opc: isShow ? opacity || 1 : 0 },
      time,
      (data) => {
        models.map((m) => (m.material.opacity = data.opc));
      },
      () => {
        if (!isShow) model.visible = isShow;
        cb && cb();
      }
    );
  }

  cameraFoucs(position, time = 1, fn) {
    t.events.closeAnimaAtStart.anima = Utils.anima(
      {
        cx: t.runScene.assetsEx.camera.position.x,
        cy: t.runScene.assetsEx.camera.position.y,
        cz: t.runScene.assetsEx.camera.position.z,
        tx: t.runScene.assetsEx.controls.target.x,
        ty: t.runScene.assetsEx.controls.target.y,
        tz: t.runScene.assetsEx.controls.target.z,
      },
      {
        ...position,
      },
      time,
      (data) => {
        t.runScene.assetsEx.camera.position.set(data.cx, data.cy, data.cz);
        t.runScene.assetsEx.controls.target.set(data.tx, data.ty, data.tz);
        t.runScene.assetsEx.camera.updateProjectionMatrix();
        t.runScene.assetsEx.controls.update();
      },
      () => {
        fn && fn();
      }
    );
  }

  downPosition = { x: 0, y: 0 };

  closeAnimaAtStart = { enterAnima: "" };

  mouseDown = (event) => {
    this.downPosition = {
      x: event.offsetX,
      y: event.offsetY,
    };
  };

  mouseUp = (event) => {
    if (event.button === 2) return;
    const ux = event.offsetX;
    const uy = event.offsetY;
    const { x, y } = this.downPosition;
    // 当点击的位置和点击后的位置一致时就会触发
    ux === x && uy === y && this.triggerClick(event);
  };

  triggerClick = (e) => {
    const model = t.runScene.modelEx.select;
    if (!model) return;
    bus.emit("logClickModel", model);

    console.log(
      `cx:${camera.position.x}, cy:${camera.position.y}, cz:${camera.position.z}, tx:${controls.target.x}, ty:${controls.target.y}, tz:${controls.target.z} `,
      "位置"
    );
  };

  controlStart = () => { };

  closeAnmia() {
    Object.values(this.closeAnimaAtStart).map(
      (item) =>
        // 暂停动画 并清空内容 item就是那个动画
        item && item.kill()
    );
  }

  dispose() {
    dom.removeEventListener("pointerdown", this.mouseDown);
    dom.removeEventListener("pointerup", this.mouseUp);
    controls.removeEventListener("start", this.controlStart);
  }
}

export default Change;

/* 常用run-scene-v--API 详细的github自取
   版本更新飞书自查
*/

/**
 * 获取模型
 * t.runScene.modelEx.getModel('');
 *
 * 基本的场景配置
 * controls.maxPolarAngle = Math.PI / 2 - 0.2;
 * controls.screenSpacePanning = false;
 *
 * 转dom
 * Utils.domTo3DSprite(dom);
 * Utils.domTo2Dui(dom);
 * Utils.domTo3Dui(dom);
 *
 * 相机当前位置以及视角
 * Utils.getCamAnimaData()
 *
 * 宏任务(自带清计时器)
 * Utils.getMacro(()={},time)
 *
 * 补帧动画
 * Utils.anima({},{},time,(data)=>{},()=>{})
 *
 * */
