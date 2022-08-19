<template>
  <div class="three-scene" ref="three-scene" onselectstart="return false;">
    <div
      @pointerdown="
        (e) => {
          // e.preventDefault();
          e.stopPropagation();
        }
      "
      class="btn"
    >
      <button @click="testMahcineMove">机器移动测试按钮</button>
    </div>
  </div>
</template>

<script>
import Change from "./Change";
import { RunScene, Utils } from "run-scene-v2";
import bus from "./Bus";
export default {
  data() {
    return {
      change: null,
      runScene: null,
      Bus: bus,
    };
  },
  mounted() {
    // 加载场景
    this.loadScene();
    // 打印点击的模型接口
    bus.on("logClickModel", this.logClickModel);
  },
  methods: {
    // 加载场景
    loadScene() {
      const sceneKey = "202205311024313282651001202252";

      this.runScene = new RunScene({
        // path: "./assets/sceneold.glb",
        path:
          "http://192.168.3.8:8080/file?path=project/linkpoint/&key=" +
          sceneKey,
        rootDom: this.$refs["three-scene"],
        options: {
          // render2: true,
          // render3: true,
          texture: {
            // load: false,
            // lazyload: {
            //   open: true,
            //   IntervalTime: 16.6,
            // },
          },
          /**
            msg?: {
            是否显示打印，默认显示
              show: boolean = true
             显示打印的等级 默认显示基础打印
              level: "base" | 'detail' =  base
              }
             是否渲染
              run?: boolean = true
             decode 的路径
              decodePath?: string = ./draco/
             是否显示fps 默认关
              showFps?: boolean = false
             是否延迟加载 默认不延迟
              loadInterval?: number = 0
             模式 默认运行模式
              mode?: 'editor' | 'debug' | 'running' = 'running
             texture?:{
             是否加载贴图
               load?:boolean = true
               lazyload?:{
             是否懒加载贴图 默认是
                 open?:boolean = false,
             懒加载的时间区间 默认为16.0ms
                 IntervalTime?:number = 16.6
              },
             贴图质量 可大幅度降低显存占用 0-1 之间
              quality?:number = 1
             }
             是否加载实例后的模型 节省性能 默认关闭
              instanceClone?: boolean =false
             2drenderer
              render2?: boolean = false
             3drenderer
              render3?: boolean, = false
               */
        },
      })
        .on("modelLoaded", (models) => {
          // console.log(models, "models");
          // models[0].children.map((i) => {
          //   i.visible = false;
          // });
        })
        .on("complete", () => {});
      this.change = new Change(this.runScene);
    },

    // 测试模型移动
    testMahcineMove() {},

    // 打印点击到的模型
    logClickModel(model) {
      console.log("点击的模型为:", model.name);
    },

    onDone() {
      console.log("场景加载完毕~");
    },
  },
  // 场景自带销毁
  destroyed() {
    this.runScene && this.runScene.dispose();
  },
};
</script>

<style lang="less" scoped>
// 场景
.three-scene {
  width: 100%;
  height: 100%;

  .btn {
    z-index: 3;
    position: absolute;
  }
  .oth {
    position: absolute;
    z-index: 2;
  }

  .show {
    opacity: 1 !important;
  }

  .none {
    opacity: 0 !important;
  }
}
</style>
