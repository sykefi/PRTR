<template>
  <div>
    <div class="svg-spinner">
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 80 80"
        class="loading-icon"
        :style="size ? 'height:' + size + 'px;' : ''"
      >
        <path
          :fill="color ? color : 'white'"
          d="M40,80C17.944,80,0,62.056,0,40C0,17.944,17.944,0,40,0c22.056,0,40,17.944,40,40c0,2.209-1.791,4-4,4s-4-1.791-4-4C72,22.355,57.645,8,40,8C22.355,8,8,22.355,8,40c0,17.645,14.355,32,32,32c2.209,0,4,1.791,4,4S42.209,80,40,80z"
        />
      </svg>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    color: String,
    size: Number
  }
});
</script>

<style scoped>
.loading-icon {
  height: 30px;
  width: auto;
  display: block;
}
.svg-spinner svg {
  animation-name: spin;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  -webkit-animation-name: spin;
  -webkit-animation-duration: 1s;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-timing-function: linear;
  -moz-animation-name: spin;
  -moz-animation-duration: 1s;
  -moz-animation-iteration-count: infinite;
  -moz-animation-timing-function: linear;
  -ms-animation-name: spin;
  -ms-animation-duration: 1s;
  -ms-animation-iteration-count: infinite;
  -ms-animation-timing-function: linear;
}
@-moz-keyframes spin {
  from {
    -moz-transform: rotate(0deg);
  }
  to {
    -moz-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
