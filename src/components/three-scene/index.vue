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

      <div
        v-for="(i, _) in [
          '水分烘干工位',
          '前处理工位',
          '1喷漆室',
          '2喷漆室',
          '面漆烘干',
        ]"
      >
        <button @click="cameraAnima(i)">相机动画{{ i }}</button>
      </div>

      <!-- <button @click="switchSprite">切换看牌</button> -->
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
          // path: "./assets/scene.glb",
          path: "https://linktwins-1303915342.cos.ap-shanghai.myqcloud.com/weicai/scene.glb",
          // path: "https://test2-1303915342.cos.ap-shanghai.myqcloud.com/WeiCai/scene.glb",
          // path: "http://192.168.3.8:8080/file?path=project/linkpoint/&key=202301161055066763391001202316",
          dom: this.$refs["three-scene"],
        })
        .on("complete", () => {
          console.log("场景加载结束");
        });
      this.change = new Change(this.runScene);
    },

    // 测试模型移动
    testMahcineMove() {
      console.log("执行");
      this.change.moveMachine.testMahcineMove();
    },

    switchSprite() {
      this.isShowSprite = !this.isShowSprite;
      this.change.sceneSprite.switchLabel(this.isShowSprite);
    },
    // 相机动画
    cameraAnima(name) {
      this.change.cameraAnima.anima(name);
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
