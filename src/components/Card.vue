<template>
    <div class="card">
        <Moveable
            class="moveable"
            v-bind="moveable"
            @drag="handleDrag"
            v-if="!cannotMove"
        >
            <!-- Normal Card -->
            <figure v-if="!type && !isToken && !flip && !isTokenList" @click="TapUntapCard($event, id)">
                <span v-if="!showModifier" class="counter" @click="AddCounter($event)">Add Counter (CTRL-LClick)</span>
                <span v-if="showModifier" class="modifier"  v-on:click="IncreaseCounter($event)" v-on:click.right="DecreaseCounter($event)">{{ modifiersign }}{{ modifier }}</span>
                <img v-bind:src="image" :title="name" :class="{ tapped : tappedCard == true }" /> 
            </figure>
            <!-- Token List Template -->
            <figure v-if="isTokenList" @click="AddToken(name, image)" class="token">
                <img v-bind:src="image" :title="name" :class="{ tapped : tappedCard == true }" /> 
            </figure>
            <!-- Token Template -->
            <figure v-if="isToken" class="token" @click="TapUntapCard($event, id)">
                <span v-if="!showModifier" class="counter" @click="AddCounter($event)">Add Counter (CTRL-LClick)</span>
                <span v-if="showModifier" class="modifier"  v-on:click="IncreaseCounter($event)" v-on:click.right="DecreaseCounter($event)">{{ modifiersign }}{{ modifier }}</span>
                <img v-bind:src="image" :title="name" :class="{ tapped : tappedCard == true }" /> 
            </figure>
            <!-- Basic Land Template -->
            <figure v-if="type" @click="TapUntapLand($event, id)">
                <span v-if="!showModifier" class="counter" @click="AddCounter($event)">Add Counter (CTRL-LClick)</span>
                <span v-if="showModifier" class="modifier"  v-on:click="IncreaseCounter($event)" v-on:click.right="DecreaseCounter($event)">{{ modifiersign }}{{ modifier }}</span>
                <img v-if="type == 'white'" src="./../assets/basiclands/plains.png" :class="{ tapped : tappedCard == true }" />
                <img v-if="type == 'blue'" src="./../assets/basiclands/island.png" :class="{ tapped : tappedCard == true }"/>
                <img v-if="type == 'black'" src="./../assets/basiclands/swamp.png" :class="{ tapped : tappedCard == true }"/>
                <img v-if="type == 'red'" src="./../assets/basiclands/mountain.png" :class="{ tapped : tappedCard == true }"/>
                <img v-if="type == 'green'" src="./../assets/basiclands/forest.png" :class="{ tapped : tappedCard == true }"/> 
            </figure>
            <!-- Flipable Card -->
            <figure v-if="!type && !isToken && flip" @click="TapUntapCard($event, id)" class="flip-card" :class="{ isflipped : transformed == true }">
                <div class="actions">
                    <span @click="transformCard($event, id)" class="transform-action">Transform</span>
                    <span v-if="!showModifier" class="counter" @click="AddCounter()">Add Counter</span>
                    <span v-if="showModifier" class="modifier"  v-on:click="IncreaseCounter($event)" v-on:click.right="DecreaseCounter($event)">{{ modifiersign }}{{ modifier }}</span>
                </div>        
                <div class="card-inner">
                    <div class="card-face face-back">
                        <img v-bind:src="imagealt" :title="name" :class="{ tapped : tappedCard == true }" />
                    </div>
                    <div class="card-face face-front">
                        <img v-bind:src="image" :title="name" :class="{ tapped : tappedCard == true }" /> 
                    </div>
                </div>
            </figure>
        </Moveable>
        <div v-if="cannotMove" class="static">
            <!-- Token Template -->
            <figure @click="AddTokenToBattlefield(name, image)">
                <img v-bind:src="image" :title="name" :class="{ tapped : tappedCard == true }" /> 
            </figure>
        </div>
    </div>
</template>

<script>
import Moveable from 'vue-moveable';


// Data
import { libraryRef } from '@/../firebase/db.js'

export default {
	name: 'Card',
    props: ['image', 'name', 'id', 'type', 'commander', 'isToken', 'isTokenList', 'flip', 'imagealt', 'cannotMove'],
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
        tappedCard: false,
        transformed: false,
        modifier: null,
        showModifier: false,
        modifiersign: null
  }),
  methods: {
    AddTokenToBattlefield(name, image) {
        this.$parent.$parent.DuplicateToken(name, image)
    },
    transformCard(e, id) {
        if(this.transformed == true) {
            this.transformed = false
        }
        else if(this.transformed == false) {
            this.transformed = true
        }
    },
    AddCounter(e) {
        if(e.ctrlKey) {
            this.showModifier = true
            this.modifier = 0;
        }
    },
    IncreaseCounter(e) {
        if (e.shiftKey) {
            this.modifier += 5;
        }
        else if(e.altKey) {
            this.showModifier = false
            this.modifier = 0;
        }
        else {
            this.modifier++;
        }

        if(this.modifier > 0) {
            this.modifiersign = "+"
        }
        else {
            this.modifiersign = null
        }
    },
    DecreaseCounter(e) {
        e.preventDefault();
        if (e.shiftKey) {
            this.modifier -= 5;
        }
        else {
            this.modifier--;
        }
        if(this.modifier > 0) {
            this.modifiersign = "+"
        }
        else {
            this.modifiersign = null
        }
    },
    AddToken(name, image) {
        this.$parent.$parent.AddToken(name, image)
    },
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
        else if(e.altKey) {
            libraryRef.doc(this.$router.app._route.params.library).collection("cards").doc(String(id)).delete()
        }
        // Flip functionality
        else if(e.ctrlKey) {
            this.transformed = true
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
        else if(e.altKey) {
            this.$parent.$parent.basiclands.splice(id, 1)
        }
    },
    IncreaseIndex() {
        this.cardIndex++;
    },
    handleDrag({ target, left, right, top }) {
      if(this.$parent.$parent.gameStarted == false) {
          this.$parent.$parent.gameStarted = true
          console.log(this.$parent.$parent.gameStarted)
      }
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

    /* Counter */
    .counter {
        position: absolute;
        top: 35%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        pointer-events: none;
        cursor: pointer;
    }
    .moveable.active:hover .counter {
        opacity: 1;
        pointer-events: all;
    }

    .modifier {
        position: absolute;
        top: 35%;
        left: 50%;
        transform: translate(-50%, -50%);     
        font-size: 26px;
        width: 50px;
        height: 50px;
        background-color: #FFF;
        border-radius: 100%;
        color: #000;
        display: flex;
        align-items: center;
        justify-content: center;  
        cursor: pointer;
        z-index: 1000;
        padding-top: 2px;
        border: 2px solid #222;
    }

    


	.static img  {
		cursor: pointer;
	}


    /* Card Sizes */
    .small .basic-land .moveable img,
    .small .moveable.active img,
    .small .token img {
        max-width: 160px;
    }
    .small .moveable.active .flip-card {
        width: 160px;
    }
    .normal .basic-land .moveable img,
    .normal .moveable.active img,
    .normal .token img {
        max-width: 202px;
    }
    .normal .moveable.active .flip-card {
        width: 202px;
    }
    .big .basic-land .moveable img,
    .big .moveable.active img,
    .big .token img {
        max-width: 300px;
    }
    .big .moveable.active .flip-card {
        width: 300px;
    }
    /* Flip Card */
     .actions,
     .face-back  {
         display: none;
     }
    .moveable.active .actions {
        display: block;
        z-index: 9999;
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .moveable.active .actions span.transform-action {
        text-align: center;
        position: relative;
        top: -40px;
        display: block;
        width: 100%;
        cursor: pointer;
    }
    .moveable.active .flip-card {
        height: 282px;
        width: 100%;
        perspective: 600px;
    }
    .moveable.active .flip-card .card-inner {      
        width: 100%;
        height: 100%;
        position: relative;
        transition: transform 1s;
        transform-style: preserve-3d;
    }
    .moveable.active .face-back {
        display: block;
    }
    .moveable.active .card-face {
        position: absolute;
        height: 100%;
        width: 100%;
        backface-visibility: hidden;
    }
    .moveable.active .isflipped .card-inner {      
        transform: rotateY(180deg);
    }
    .moveable.active .isflipped .card-inner .face-front .tapped {
        display: none;
    }
    .moveable.active .face-back {      
        transform: rotateY( 180deg );
    }
</style>
