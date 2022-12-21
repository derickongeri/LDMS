<template>
  <div ref="draggableContainer" id="draggable-container" class="legend  ">
    <div id="draggable-header"  @mousedown="dragMouseDown">
     <h4> jhhhh</h4>
    </div>
    <div v-for="(stat, i) in legendData.data" :key="stat">
      <i :style="`background:` +  legendData.colors[i].color" ></i>
        <span>{{legendData.colors[i].value }}</span>
        <br />
    </div>

    <div>
      kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
    </div>
  </div>
</template>

<script>
import { Log } from "src/Services/Logger";
export default {
  props: {
    legendData: Object
  },
  data() {
    return {
      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0
      }
    };
  },
  watch:{
      legendData (val){
          Log(" div length ", document.getElementById("draggable-container").offsetHeight)
      }
  },
  methods: {
    dragMouseDown: function(event) {
      event.preventDefault();
      // get the mouse cursor position at startup:
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;
      document.onmousemove = this.elementDrag;
      document.onmouseup = this.closeDragElement;
    },
    elementDrag: function(event) {
      event.preventDefault();
      this.positions.movementX = this.positions.clientX - event.clientX;
      this.positions.movementY = this.positions.clientY - event.clientY;
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;
      // set the element's new position:
      this.$refs.draggableContainer.style.top =
        this.$refs.draggableContainer.offsetTop -
        this.positions.movementY +
        "px";
      this.$refs.draggableContainer.style.left =
        this.$refs.draggableContainer.offsetLeft -
        this.positions.movementX +
        "px";
    },
    closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
};
</script>

<style scoped>
#draggable-container {
  position: absolute;
  z-index: 9;
   background-color: #008080;
  text-align: center;
  border: 1px solid #d3d3d3;
 top: 70%; left:80%;
 min-width: 222px;
}
#draggable-header {
  padding: 10px;
  cursor: move;
  z-index: 10;
  color:#008080;
}

/*Legend specific*/
.legend {
  font: 17px Arial, Helvetica, sans-serif;
  color: rgb(15, 7, 7);
  min-width: 100px;
}
.legend h4 {
  text-align: center;
  font-size: 15px;
  color: rgb(15, 7, 7);
}

.legend span {
  position: relative;
  font-size: 15px;
}
.legend i {
  width: 50px;
  height: 15px;
  font-size: 14px;
}

</style>
