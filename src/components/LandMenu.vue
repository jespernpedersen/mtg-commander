<template> 
    <div class="basic-lands">
        <ul>
            <li @click="AddLand('white')">Plains</li>
            <li @click="AddLand('blue')">Island</li>
            <li @click="AddLand('black')">Swamp</li>
            <li @click="AddLand('red')">Mountain</li>
            <li @click="AddLand('green')">Forest</li>
        </ul>
    </div>
</template>

<script>
import Moveable from 'vue-moveable';

export default {
	name: 'BasicLands',
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
    AddLand(land) {
        // console.log(land)
        if(land == 'white') {
            let name = 'Plains'
        }
        else if(land == 'blue') {
            let name = 'Island'
        }
        else if(land == 'black') {
            let name = 'Swamp'
        }
        else if(land == 'red') {
            let name = 'Mountain'
        }
        else if(land == 'green') {
            let name = 'Forest'
        }
        let type = land

        let LandArray = {
            landName: name,
            landType: type
        }
        this.$parent.$parent.basiclands.push(LandArray)
        console.log(this.$parent.$parent.basiclands)

    },
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
    IncreaseIndex() {
        this.cardIndex++;
    },
    handleDrag({ target, left, top }) {
      target.classList.add("active");
      target.style.zIndex = this.cardIndex;
      target.style.left = `${left}px`;
      target.style.top = `${top}px`;
    },
  },
};
	</script>

<style scoped>
    ul {
        list-style: none;
        display: flex;
        justify-content: space-between;
        margin-left: 0;
        padding-left: 0;
        padding-top: 32px;
    }

    li {
        display: inline-block;
    }
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
</style>
