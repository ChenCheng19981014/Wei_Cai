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
// 导入toRaw函数
import { toRaw } from "@vue/reactivity";

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

    this.sceneSprite = new SceneSprite();

    this.sceneSprite.init();

    this.cameraAnima = new CameraAnima();

    this.cameraAnima.init();

    // 最小距离
    controls.minDistance = 110;
    // // 最大距离
    controls.maxDistance = 12000;

    controls.maxPolarAngle = Math.PI / 2 - 0.3;
    controls.screenSpacePanning = false;

    // 入场动画
    // t.events.cameraFoucs(
    //   {
    //     cx: 1208.6682842150653, cy: 6552.805100037871, cz: 610.91451399788, tx: -3678.4371053911896, ty: 288.199866, tz: 665.9083381883736
    //   },
    //   1
    // );

    t.runScene.cameraEx.setTemp("初始", { time: 2 });
  });

  // 模型特殊处理 加载初始不显示
  runScene.on("modelLoaded", (models) => {
    // console.log(models, "models");
  });

  // 销毁
  this.dispose = () => runScene.dispose();
}

/**
 * 移动模型模块
 * 问题一 拿不到进度 有的传感器之间间隔太大 就无法控制相对进度 可能下一秒或下一帧就可能进入到下一段传感器范围 会出现位置偏移 或极端闪现的问题
 * 问题二 每一段传感器的间隔不一样 移动的时间也不相同 即调用的传入的数据接口周期频率也不同 否则也会造成设备无法无缝移动
 * 问题三 穿模的问题一定会存在 不可避免 除非传入数据接口可以一定避免
 */
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

  moveSpeed = 0.01;

  isGoing = true;

  init() {
    // t.runScene.modelEx.getModel('缩放层').visible = false;

    // 设置路线
    this.setRoadMap();

    // 获取路线
    this._setLine();

    // 默认第一个不显示
    this.machineType["ydj"].visible = false;
  }

  // 临时测试机器移动
  async testMahcineMove() {
    if (!this.isGoing) return;

    this.isGoing = false;

    await this.testMove(async () => {
      await this.setMove("id2", "ydj", "ST01-ST05");
    });

    // await this.testMove(async () => { await this.setMove("id1", "ydj", "ST01-ST02"), await this.setMove("id3", "ydj", "ST01-ST05") })

    await this.testMove(async () => {
      await Promise.all([
        this.setMove("id1", "ydj", "ST01-ST02"),
        this.setMove("id3", "ydj", "ST01-ST05"),
      ]);
    });

    await this.testMove(async () => {
      await this.setMove("id2", "ydj", "ST05-ST06");
    }, 2000);

    await this.testMove(async () => {
      await this.setMove("id3", "ydj", "ST05-ST06");
    }, 2000);

    // await this.testMove(async () => { await this.setMove("id1", "ydj", "ST03-ST04"), await this.setMove("id2", "ydj", "ST06-ST07"), await this.setMove('id3', 'ydj', "ST06-ST07") }, 2000)

    await this.testMove(async () => {
      await Promise.all([
        this.setMove("id1", "ydj", "ST03-ST04"),
        await this.setMove("id2", "ydj", "ST06-ST07"),
        await this.setMove("id3", "ydj", "ST06-ST07"),
      ]);
    }, 2000);

    await this.testMove(async () => {
      await this.setMove("id1", "ydj", "ST04-ST08");
    }, 2000);

    await this.testMove(async () => {
      await this.setMove("id1", "ydj", "ST08-ST09");
    }, 2000);

    await this.testMove(async () => {
      await this.setMove("id2", "ydj", "ST07-ST08");
    }, 2000);

    await this.testMove(async () => {
      await this.setMove("id1", "ydj", "ST09-ST10");
    }, 2000);

    await this.testMove(async () => {
      await this.setMove("id3", "ydj", "ST07-ST08");
    }, 2000);

    await this.testMove(async () => {
      await this.setMove("id2", "ydj", "ST08-ST09");
    }, 2000);

    await this.testMove(async () => {
      await this.setMove("id1", "ydj", "ST10-ST11");
    }, 2000);

    await this.testMove(async () => {
      await this.setMove("id3", "ydj", "ST08-ST09");
    }, 2000);

    await this.testMove(async () => {
      await this.setMove("id2", "ydj", "ST09-ST10");
    }, 2000);

    await this.testMove(async () => {
      await this.setMove("id1", "ydj", "ST11-ST12");
    }, 2000);

    await this.testMove(async () => {
      await this.setMove("id3", "ydj", "ST09-ST10");
    }, 2000);

    await this.testMove(async () => {
      await this.setMove("id2", "ydj", "ST10-ST11");
    }, 2000);

    await this.testMove(async () => {
      await this.setMove("id1", "ydj", "ST12-ST13");
    }, 2000);

    await this.testMove(async () => {
      await this.setMove("id2", "ydj", "ST11-ST12");
    }, 2000);

    await this.testMove(async () => {
      await this.setMove("id1", "ydj", "ST13-ST14");
    }, 2000);
    await this.testMove(async () => {
      await this.setMove("id1", "ydj", "ST14-ST15");
    }, 2000);
    await this.testMove(async () => {
      await this.setMove("id1", "ydj", "ST15-ST16");
    }, 2000);
    await this.testMove(async () => {
      await this.setMove("id1", "ydj", "ST16-ST17");
    }, 2000);
    await this.testMove(async () => {
      await this.setMove("id1", "ydj", "ST17-ST18");
    }, 2000);
    await this.testMove(async () => {
      await this.setMove("id1", "ydj", "ST18-ST19");
    }, 2000);
    await this.testMove(async () => {
      await this.setMove("id1", "ydj", "ST19-ST20");
    }, 2000);
    await this.testMove(async () => {
      await this.setMove("id1", "ydj", "ST20-ST21");
    }, 2000);
    await this.testMove(async () => {
      await this.setMove("id1", "ydj", "ST21-ST22");
    }, 2000);
    await this.testMove(async () => {
      await this.setMove("id1", "ydj", "ST22-ST23");
    }, 2000);
    await this.testMove(async () => {
      await this.setMove("id1", "ydj", "ST23-ST24");
    }, 2000);
    await this.testMove(async () => {
      await this.setMove("id1", "ydj", "ST24-ST25");
    }, 2000);

    this.isGoing = true;
  }

  // 测试使用
  testMove(fn, time = 2000) {
    return new Promise((s) => {
      let timer = setTimeout(async () => {
        await fn();
        await s();
        timer && clearTimeout(timer);
      }, time);
    });
  }

  // 开始行走
  setMove(id, type, location) {
    return new Promise((s) => {
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
        isEnd: false,
      };

      let mahcineInfo = this.setLine(lineInfo);

      // 移动
      this.move(mahcineInfo, s);
    });
  }

  // 移动
  move(mahcineInfo, s) {
    let { model, num, curve, percent } = mahcineInfo;

    let newNum = num == 1 ? 0.95 : 1 - 1 / num;

    const length = curve.getLength();

    let speed = 0.01;

    if (!this.isFrist) {
      this.isFrist = true;
      this.firstLength = length;
    }

    let dySpeed = (this.firstLength / curve.getLength()) * speed;

    model.timer = setInterval(() => {
      // 模型的朝向
      model.lookAt(curve.getPointAt(percent));
      // 模型的位置
      model.position.set(
        curve.getPointAt(percent).x,
        curve.getPointAt(percent).y,
        curve.getPointAt(percent).z
      );
      // 模型的进度
      percent += dySpeed;

      model.savePosition = curve.getPointAt(percent);

      // console.log(percent, 'percent');

      if (percent >= newNum) {
        s();

        mahcineInfo.isEnd = true;
        // 到达一定的值就清空定时器
        // 当走完过后复位原点
        model.timer && clearInterval(model.timer);

        model.timer = null;
      }
    }, 16);
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
    const { id, model, location, curve, isEnd } = lineInfo;

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
      isEnd,
    };
    return mahcineInfo;
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
    // this.clearLine();
  }

  // 清除线
  clearLine() {
    this.savedRoutes.map((i) => {
      t.runScene.modelEx.remove(i);
    });
    this.savedRoutes = [];
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
    // cube.scale.set(1, 1, 1)

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

// 相机动画
class CameraAnima {
  init() { }
  anima(name) {
    // t.runScene.cameraEx.setTemp(animaName, { time: 1, onComplete: () => { } });
    t.runScene.timeLineEx.playGroup(name);


    console.log('name:', name);
  }
}

// 精灵图
class SceneSprite {
  spriteModelMap = {
    transparent: {},
    actual: {},
  };
  init() {
    this.getSpriteModel();
  }

  async getSpriteModel() {
    t.runScene.tags.get("透明").map((i) => {
      let model = t.runScene.modelEx.getById(i);
      this.spriteModelMap.transparent[i] = model;
    });

    t.runScene.tags.get("实际").map((i) => {
      let model = t.runScene.modelEx.getById(i);
      this.spriteModelMap.actual[i] = model;
    });
  }
  // 切换标签
  switchLabel(isShow) {
    Object.values(this.spriteModelMap.transparent).map(
      (model) => (model.visible = isShow)
    );
    Object.values(this.spriteModelMap.actual).map(
      (model) => (model.visible = !isShow)
    );
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

    console.log(
      `cx:${camera.position.x}, cy:${camera.position.y}, cz:${camera.position.z}, tx:${controls.target.x}, ty:${controls.target.y}, tz:${controls.target.z} `,
      "位置"
    );
  };

  controlStart = () => {
    // 关闭其他动画
    this.closeAnmia();
  };

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
