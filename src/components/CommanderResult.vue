<template>
    <Moveable
        class="moveable card"
        v-bind="moveable"
        @drag="handleDrag"
    >
        <figure @click="TapUntap($event, id)">
            <img v-bind:src="image" :title="name" :class="{ tapped : tappedCard == true }"
          />   
        </figure>
    </Moveable>
</template>

<script>
import Moveable from 'vue-moveable';

export default {
	name: 'CommanderResult',
    props: ['commander'],
    components: {
		Moveable
    },
    data: () => ({
    moveable: {
      draggable: true,
      throttleDrag: 0,
      resizable: false,
      throttleResize: 1,
      keepRatio: true,
      scalable: false,
      throttleScale: 0,
      rotatable: false,
      throttleRotate: 0,
    },
  }),
  methods: {
    TapUntap(e, id) {
        if (e.shiftKey) {
            if(this.tappedCard == true) {
                this.tappedCard = false
            }
            else {
                this.tappedCard = true
            }
        }
        // Not pressing shift
        else {
        }
    },
    handleDrag({ target, left, top }) {
      console.log('onDrag left, top', left, top);
      target.style.left = `${left}px`;
      target.style.top = `${top}px`;
    },
  },
};
	</script>

<style scoped>
    .moveable {
        position: relative;
    }
    .command-zone {
      position: relative;
    }
    .moveable.commander {
      position: fixed;
    }
    .theme--dark.v-sheet {
        background-color: transparent;
    }

    #commander {
      transition: 0.3s ease-in-out;
    }
    

    .small .moveable #commander {
        max-width: 170px;
    }

    .normal .moveable #commander {
        max-width: 212px;
    }
    .big .moveable #commander {
        max-width: 310px;
    }
</style>
