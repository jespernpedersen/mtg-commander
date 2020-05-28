<template>
    <Moveable
        class="moveable card"
        v-bind="moveable"
        @drag="handleDrag"
    >
        <figure v-if="!type" @click="TapUntapCard($event, id)">
            <img v-bind:src="image" :title="name" :class="{ tapped : tappedCard == true }" /> 
        </figure>
        <!-- Basic Land -->
        <figure v-if="type" @click="TapUntapLand($event, id)">
            <img v-if="type == 'white'" src="./../assets/basiclands/plains.png" :class="{ tapped : tappedCard == true }" />
            <img v-if="type == 'blue'" src="./../assets/basiclands/island.png" :class="{ tapped : tappedCard == true }"/>
            <img v-if="type == 'black'" src="./../assets/basiclands/swamp.png" :class="{ tapped : tappedCard == true }"/>
            <img v-if="type == 'red'" src="./../assets/basiclands/mountain.png" :class="{ tapped : tappedCard == true }"/>
            <img v-if="type == 'green'" src="./../assets/basiclands/forest.png" :class="{ tapped : tappedCard == true }"/> 
        </figure>
    </Moveable>
</template>

<script>
import Moveable from 'vue-moveable';

// Data
import { libraryRef } from '@/../firebase/db.js'

export default {
	name: 'Card',
    props: ['image', 'name', 'id', 'type', 'commander'],
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
        cardIndex: 16,
        tappedCard: false
  }),
  methods: {
    TapUntapCard(e, id) {
        if (e.shiftKey) {
            if(this.tappedCard == true) {
                this.tappedCard = false
            }
            else {
                this.tappedCard = true
            }
        }
        // Not pressing shift
        else if(e.ctrlKey) {
            console.log(id)
            libraryRef.doc(this.$router.app._route.params.library).collection("cards").doc(String(id)).delete()
        }
    },
    TapUntapLand(e, id) {
        if (e.shiftKey) {
            if(this.tappedCard == true) {
                this.tappedCard = false
            }
            else {
                this.tappedCard = true
            }
        }
        // Not pressing shift
        else if(e.ctrlKey) {
            this.$parent.$parent.basiclands.splice(id, 1)
        }
    },
    IncreaseIndex() {
        this.cardIndex++;
    },
    handleDrag({ target, left, right, top }) {
      target.classList.add("active");
      target.style.zIndex = this.cardIndex;
      if(this.commander == false) {
        target.style.left = `${left}px`;
      }
      else {
          target.style.right = `${right}px`;
      }
      target.style.top = `${top}px`;
    },
  },
};
	</script>

<style scoped>
    img {
        width: 100%;
    }
    .moveable {
        z-index: 15;
        position: relative;
    }
    .moveable:hover {
        z-index: 9999;
    }
    .moveable.active {
        position: fixed;
        margin-top: 0 !important;
    }


    .moveable.active img {
        transition: all 0.3s ease-in-out;
        transform-origin: center center;
    }

    .moveable.active img.tapped {
        transform: rotate(90deg);
        opacity: 0.5;
    }

    .moveable.active img.tapped:hover {
        opacity: 1;
    }

    .theme--dark.v-sheet {
        background-color: transparent;
    }

    



    /* Card Sizes */
    .small .basic-land .moveable img,
    .small .moveable.active img {
        max-width: 160px;
    }
    .normal .basic-land .moveable img,
    .normal .moveable.active img {
        max-width: 202px;
    }
    .big .basic-land .moveable img,
    .big .moveable.active img {
        max-width: 300px;
    }
</style>
