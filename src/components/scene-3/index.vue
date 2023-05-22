<template>
  <div class="scene-3" ref="scene-3" onselectstart="return false;"></div>
</template>

<script>
import Change from "./Change";
import { RunScene, Utils } from "run-scene-v2";
import bus from "./../three-scene/Bus";
export default {
  data() {
    return {
      change: null,
      runScene: null,
      Bus: bus,
      isShowSprite: false,
    };
  },
  mounted() {
    // 加载场景
    this.loadScene();
  },
  methods: {
    // 加载场景
    loadScene() {
      this.runScene = new RunScene({
        msg: {
          // show: true,
        },
        // showFps: true,
        coverSameId: true,
        instanceClone: false,
        render3: true,
        render2: true,
        renderConfig: {
          // 是否允许设置模型位置后自动渲染最新效果
          matrixAutoUpdate: true,
          scriptFrame: 60,
        },
      })
        .load({
          path: "https://linktwins-1303915342.cos.ap-shanghai.myqcloud.com/weicai/scene-3.glb",
          dom: this.$refs["scene-3"],
        })
        .on("complete", () => {
          console.log("场景加载结束");
        });
      this.change = new Change(this.runScene);
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
.scene-3 {
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
