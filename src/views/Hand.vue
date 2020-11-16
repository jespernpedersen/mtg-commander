<template>
	<v-app dark>
        <div>
			<div dark class="gamepad" v-bind:style="{ backgroundImage: 'url(' + settings.playmat + ')' }">
                <div class="library">
                </div>

                <div class="actions">
                    <span class="draw" @click="Draw()" v-if="gameStarted">Draw</span>
                    <span class="draw-hand" @click="DrawHand()" v-if="!gameStarted">Draw Hand</span>
                    <span class="shuffle-library" @click="ShuffleLibrary()">Shuffle Library</span>
                    <span class="scry">
                        <input type="number" v-model="scrynumber" />
                        <span @click="Scry(scrynumber)">Scry</span>
                    </span>
                    <span class="search-library" v-if="!searchingLibrary" @click="SearchLibrary()">Search Library</span>
                    <span class="search-library" v-if="searchingLibrary" @click="StopSearchingLibrary()">Stop Searching Library</span>
                    <span class="hide-hand" v-if="!showingHand" @click="HideHand()">Hide Hand</span>
                    <span class="show-hand" v-if="showingHand" @click="ShowHand()">Show Hand</span>
                </div>

                <div class="scrying" v-if="scry.length > 0">
                    <div class="card-wrapper">
                        <HandCard v-for="card in scry" 
                            :key="card.id"
                            :id="card.id"
                            :name="card.name"
                            :image="card.image"
                            :source="'library'"
                            >
                        </HandCard> 
                    </div>
                    <span class="remove-scry" @click="StopScrying()">Stop Scrying</span>
                </div>

                <div class="hand">
                    <div class="game-info">
                        <span>Library Size: {{ library.length }}</span>
                        <span v-if="hand.length > 0">Hand Size: {{ hand.length }}</span>
                    </div>
                    <div class="hand-wrapper">
                        <HandCard v-for="card in hand"
                            :key="card.id"
                            :id="card.id"
                            :name="card.name"
                            :image="card.image"
                            :hidden="showingHand"
                            :isPlayed="false"
                            :source="'hand'"
                            >
                        </HandCard>
                    </div>
                </div>

                <div class="on-battlefield">
                    <h3>Played Cards</h3>
                    <div class="played-list">
                        <HandCard v-for="card in playedCards"
                            :key="card.id"
                            :id="card.id"
                            :name="card.name"
                            :image="card.image"
                            :isPlayed="true"
                            >
                        </HandCard>
                    </div>
                </div>
            </div>
		</div>
        <div class="library" v-if="searchingLibrary">
            <span>Stop Searching</span>
            <div class="library-wrapper">
                <HandCard v-for="card in library"
				    :key="card.id"
                    :id="card.id"
                    :name="card.name"
                    :image="card.image"
                    :isSearching="true"
                >
                </HandCard>              
            </div>
        </div>
	</v-app>
</template>

<script>
import HandCard from '@/components/HandCard'

// Data
import { libraryRef, messageRef, firebase } from '@/../firebase/db.js'

let library = [];

export default {
	name: 'App',
	components: {
        HandCard,
	},
	data () {
		return {
            library: [],
            hand: [],
            playedCards: [],
            scry: [],
            scrynumber: 1,
            gameStarted: false,
            searchingLibrary: false,
            showingHand: false
		}
	},
	created() {
	},
	methods: {
        PlayingCard(id) {
            this.hand.forEach((card) => {
                if(card.id == id) {
                    this.playedCards.push(card)
                    let index = this.hand.indexOf(card)
                    this.hand.splice(index, 1)
                }
            })
        },
        UndoPlaying(id) {
            this.playedCards.forEach((card) => {
                if(card.id == id) {
                    let index = this.playedCards.indexOf(card)
                    this.hand.push(card)
                    this.playedCards.splice(index, 1)
                }
            })
        },
        HideHand() {
            console.log("Hiding Hand")
            this.showingHand = true
        },
        ShowHand() {
            this.showingHand = false
        },
        SearchLibrary() {
            this.searchingLibrary = true;
            
            messageRef.doc().set({
                owner: this.$router.app._route.params.library,
                text: "searched their library",
                timeStamp: firebase.firestore.Timestamp.fromDate(new Date())
            })
        },
        StopSearchingLibrary() {
            this.searchingLibrary = false
        },
        AddToHand(id) {
            this.library.forEach((card) => {
                if(card.id == id) {
                    let specifiedCard = card;
                    let index = this.library.indexOf(specifiedCard)
                    this.library.splice(index, 1)
                    this.hand.push(specifiedCard);
                    this.searchingLibrary = false
                }
            })
        },
        CardLibraryTop(id) {
            this.hand.forEach((card) => {
                if(card.id == id) {
                    let specifiedCard = card;
                    let index = this.hand.indexOf(specifiedCard)
                    this.hand.splice(index, 1)
                    this.library.unshift(specifiedCard)
                }
            })
        },
        CardLibraryBottom(id, source) {
            if(source == "hand") {
                this.hand.forEach((card) => {
                    if(card.id == id) {
                        let specifiedCard = card;
                        let index = this.hand.indexOf(specifiedCard)
                        this.hand.splice(index, 1)
                        this.library.push(specifiedCard)
                    }
                })
            }
            else if (source == "library") {
                this.library.forEach((card) => {
                    if(card.id == id) {
                        let specifiedCard = card;
                        let index = this.library.indexOf(specifiedCard)
                        this.library.splice(index, 1)
                        this.library.push(specifiedCard);
                    }
                })
                this.scry.forEach((card) => {
                    if(card.id == id) {
                        let specifiedCard = card;
                        let index = this.scry.indexOf(specifiedCard)
                        this.scry.splice(index, 1)
                    }
                })
            }
            else {
                console.log("Error. Contact Jes. Source of card could not be read");
            }
        },
        Scry(amount) {
            var i;
            for (i = 0; i < amount; i++) {
                this.scry.push(this.library[i]);
            }

            messageRef.doc().set({
                owner: this.$router.app._route.params.library,
                text: "has scryed for " + amount,
                timeStamp: firebase.firestore.Timestamp.fromDate(new Date())
            })
        },
        StopScrying() {
            this.scrynumber = 1;
            this.scry = [];
        },
        ShuffleLibrary() {
            this.Shuffle(this.library)
            messageRef.doc().set({
                owner: this.$router.app._route.params.library,
                text: "shuffled their library",
                timeStamp: firebase.firestore.Timestamp.fromDate(new Date())
            })
        },
        Draw() {
            this.hand.push(this.library[0])
            this.RemoveCard()

            messageRef.doc().set({
                owner: this.$router.app._route.params.library,
                text: "draws a card",
                timeStamp: firebase.firestore.Timestamp.fromDate(new Date())
            })
        },
        DrawHand() {
            this.hand.push(this.library[0], this.library[1], this.library[2], this.library[3], this.library[4], this.library[5], this.library[6])
            this.RemoveOpeningHand()
            this.gameStarted = true
        },
        RemoveCard() {
            this.library.splice(0, 1)
        },
        RemoveOpeningHand() {
            this.library.splice(0, 7)
        },
        Shuffle(a) {
            var j, x, i;
            for (i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
            return a;
        }
	},
	firestore() {
		return {
            library: libraryRef.doc(this.$router.app._route.params.library).collection("cards").orderBy("name"),
			settings: libraryRef.doc(this.$router.app._route.params.library),
		}
	},
	mounted() {
            this.Shuffle(this.library)
	}
};
</script>
<style scoped>
	* {
		box-sizing: border-box;
	}
	.container {
		width: 100%;
		max-width: 100%;
		padding: 0;
    }
	.gamepad {
		display: grid;
		grid-template-columns: 300px auto 280px;
        width: 100%;
        height: 100vh;
		max-height: 100vh;
        overflow: hidden;
        position: relative;
    }
    
    html,
    body {
        overflow-y: hidden;
    }

	.library {
		padding: 15px;
	}

	.special-zone {
		display: grid;
		grid-template-rows: 1fr 1fr;
		
		position: relative;
	}
	.command-zone {
		padding: 15px;
	}

	.fadedOut {
		opacity: 0.2;
		transition: 0.3s ease-in-out;
	}

	h2 {
		text-align: center;
	}

	.library-list {
		overflow-y: scroll;
		height: calc(100% - 120px);
    	max-height: 40vh;
	}

	.token-list {
		overflow-y: scroll;
    	max-height: 20vh;		
	}

    .gamepad {
        background-size: 100% auto;
        background-repeat: no-repeat;
		background-image: url('https://i.imgur.com/xuOFwIB.png')
    }

    .scrying { 
        z-index: 1111;  
        width: 100vw;
        height: 100vh;
    }

    .scrying .card-wrapper {
        transform: translate(-50%, -50%);
        position: fixed;
        top: 50%;
        left: 50%;
        padding: 0 100px;    
        width: 100%;
        display: flex;
        justify-content: center;    
    }

    .scrying .card-wrapper .card:not(:last-child) {
        margin-right: 30px;
    }

    .scrying .remove-scry {
        z-index: 1111;
        top: 25%;
        transform: translate(-50%, -50%);
        font-size: 30px;
        position: absolute;
        left: 50%;
        cursor: pointer;
    }

    .hand {
        width: 100%;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .hand .game-info span {
        
        text-align: center;
        display: block;
        width: 100%;
        font-size: 20px;
        margin-bottom: 20px;
    }

    .hand-wrapper {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        justify-content: center;
        padding: 0 300px;
    }

    .hand .card:not(.active):hover {
        transform: scale(1.5)
    }

    .actions {
        width: 100%;
        text-align: center;
        padding-top: 35px;
        padding-bottom: 35px;
        font-size: 34px;
        background-color: rgba(0,0,0,0.4);
        position: absolute;
        z-index: 99999999;
    }

    .actions > span {
        cursor: pointer;
    }

    .actions span:not(:last-of-type) {
        margin-right: 45px;
    }

    .scrying:before {
        content:"";
        background-color: rgba(0,0,0,0.95);
        height: 100vh;
        width: 100vw;
        top: 0;
        left: 0;
        position: absolute;
    }


    .library .card,
    .scrying .card,
    .hand .card {
        max-width: 220px;
        margin-bottom: 20px;
        min-height: 307px;
    }

    .hand .card:not(:last-child) {
        margin-right: 20px;
    }

    .hand .card:not(.active) {
        transition: 0.3s ease-in-out;
    }

    .on-battlefield {
        position: absolute;
        bottom: 250px;
        right: 60px;
    }

    .library {
        position: fixed;
        width: 100%;
        height: 100vh;
        width: 100vw;
    }

    .library:not(:empty):before {
        content:"";
        background-color: rgba(0,0,0,0.95);
        height: 100vh;
        width: 100vw;
        top: 0;
        left: 0;
        position: absolute;
    }

    .scry input {
        width: 50px;
        background-color: rgba(255, 255, 255, 0.2);
        color: #FFF;
        border-radius: 100%;
        margin-right: 10px;
        text-align: center;
        -webkit-appearance: none;
    }

    .scry input::-webkit-outer-spin-button,
    .scry input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .library-wrapper {
        padding-top: 100px;
        overflow-y: scroll;
        max-height: 100vh;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        z-index: 10000000; 
        position: relative;
    }

    .played-list {
        max-height: 500px;
        overflow: scroll;
        overflow-x: hidden;
        width: 160px;
        padding-top: 180%;
    }

    .played-list  .card {
		margin-top: -180%;
	}

	.played-list  img {
		max-width: 100%;
    }

    .library-wrapper .card:not(:last-child) {
        margin-right: 15px;
    }
</style>