/**
 * 交付项目时场景不可留有log ***
 * 记得开启
 */
// const console = {
//   log: () => { }
// }

import { Utils } from "run-scene-v2";
import bus from "./../three-scene/Bus";
import * as THREE from "three";
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
    t.runScene.assetsEx.controls.autoRotate = false

    // t.runScene.controlsEx.clearAutoDelay(false)

    t.runScene.cameraEx.setTemp("初始", { time: 2 });
  });

  // 模型特殊处理 加载初始不显示
  runScene.on("modelLoaded", (models) => {
    // console.log(models, "models");
  });

  // 销毁
  this.dispose = () => runScene.dispose();
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
