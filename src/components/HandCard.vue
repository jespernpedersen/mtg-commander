<template>
    <div class="card" @click="PlayCard(id, isPlayed)">
        <figure v-if="!isSearching" :class="{ hidden: hidden == true }">
            <div class="card-face front">
                <img v-bind:src="image" :title="name" :class="{ tapped : tappedCard == true }" /> 
            </div>
            <div class="card-face back">
                <img src="./../assets/card-back.png" :class="{ tapped : tappedCard == true }" />
            </div>
            <div class="hand-card-actions">
                <span v-if="!isSearching" class="top-deck" @click="PutCardTop(id)">Top</span>
                <span v-if="!isSearching" class="bottom-deck" @click="PutCardBottom(id)">Bottom</span>
            </div>
        </figure>
        <figure v-if="isSearching" @click="SearchedForCard(id)">
            <img v-bind:src="image" :title="name" :class="{ tapped : tappedCard == true }" /> 
        </figure>
    </div>
</template>

<script>
import Moveable from 'vue-moveable';


// Data
import { libraryRef } from '@/../firebase/db.js'

export default {
	name: 'Card',
    props: ['image', 'name', 'id', 'type', 'commander', 'isSearching', 'hidden', 'isPlayed'],
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
        hiddenCards: this.$parent.showingHand,
        cardIndex: 16,
        tappedCard: false,
        modifier: null,
        showModifier: false,
        modifiersign: null,
  }),
  methods: {
    PlayCard(id, isPlayed) {
        if(!isPlayed) {
            this.$parent.$parent.PlayingCard(id)
        }
        else {
            this.$parent.$parent.UndoPlaying(id)
        }
    },
    SearchedForCard(id) {
        console.log("Adding to Hand..")
        this.$parent.$parent.AddToHand(id);
    },
    PutCardTop(id) {
        this.$parent.$parent.CardLibraryTop(id)
    },
    PutCardBottom(id) {
        this.$parent.$parent.CardLibraryBottom(id)
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
    .card {
        z-index: 15;
        position: relative;
    }
    .card:hover {
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

    .hand-card-actions{
        position: absolute;
        bottom: 0;
        width: 100%;
    }


    .hand-card-actions span {
        display: inline-block;
        width: 100%;
        opacity: 0;
        transition: 0.3s ease-in-out;
        position: absolute;
    }

    .card:hover span {
        opacity: 1;
    }

    .hand-card-actions span:last-of-type {
        text-align: right;
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

    /* Hide Cards */
     .back  {
         display: none;
     }
    .card {
        height: 282px;
        width: 100%;
        perspective: 600px;
        position: relative;
    }
    .card figure {      
        width: 100%;
        height: 100%;
        position: relative;
        transition: transform 1s;
        transform-style: preserve-3d;
    }
    .hidden .back {
        display: block;
        height: 100%;
        width: 100%;
    }
    .card-face {
        position: absolute;
        height: 100%;
        width: 100%;
        backface-visibility: hidden;
    }
    .hidden {      
        transform: rotateY(180deg);
    }
    .hidden_cards .card.tapped .card-face.front {
        display: none;
    }
    .back {      
        transform: rotateY( 180deg );
    }
    

    .scrying .card-face {
        position: static;
    }
</style>
