<template>
  <div class="view">
    <three-scene></three-scene>
  </div>
</template>
<script>
import ThreeScene from "../../components/three-scene";

export default {
  components: {
    ThreeScene,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="less" scoped>
.view {
  width: 100%;
  height: 100%;
}
</style>
