<template>
	<v-app dark>
        <div v-bind:class="size">
			<div dark class="gamepad" v-bind:style="{ backgroundImage: 'url(' + settings.playmat + ')' }">
				<div class="library">
					<Search v-on:search-cards="searchData" />
					<div class="library-tools">
						<Result :error="error" :cards="cards" />
                        <div class="result"  v-if="cards.length > 0" >
                        <span style="color: lightgreen;">Card has been found</span>
						<button @click="SaveLibrary(cards)">Add to library?</button>
                        </div>
					</div>
					<div class="library-list">
                            <Card v-for="(card, i) in library" :key="i"
                                :id="card.id"
                                :name="card.name"
                                :image="card.image"
                            >
                            </Card>
					</div>
                            <LandMenu>
                            </LandMenu>
				</div>
				<div class="battlefield">
                    <div class="settings">
                        <ul>
                            <li @click="ChangeView('big')" :class="{ active : size == 'big' }">Big View</li>
                            <li @click="ChangeView('normal')" :class="{ active : size == 'normal' }">Normal View</li>
                            <li @click="ChangeView('small')" :class="{ active : size == 'small' }">Small View</li>
                        </ul>
						<div class="playmat-setting">
							<label>Playmat: </label>
							<input type="text" v-model="settings.playmat" @change="SavePlaymat(settings.playmat)" placeholder="(should be 1920x1080)" />
						</div>
                    </div>
                    <div class="lands">
                        <figure v-for="(basicland, i) in basiclands" :key="i" class="basic-land">
                            <Card
                                :type="basicland.landType"
                                :id="i"
                            >
                            </Card>
                        </figure>
                    </div>
				</div>
				<div class="special-zone">
					<div class="command-zone">
						<h2>COMMAND ZONE</h2>
						<div id="search-wrapper"  v-if="!hasSearchedCommander">
							<Search v-on:search-cards="searchCommander"/>
						</div>
                            <Card v-for="(card, i) in commander" :key="i"
                                :id="card.id"
                                :name="card.name"
                                :image="card.image_uris.png"
                            >
                            </Card>
					</div>
					<div class="graveyard">
						<h2>GRAVEYARD</h2>
					</div>
				</div>
			</div>
        </div>
	</v-app>
</template>

<script>
import Search from '@/components/Search'
import Result from '@/components/Result'
import CommanderResult from '@/components/CommanderResult'
import Card from '@/components/Card'
import LandMenu from '@/components/LandMenu'

// Data
import { libraryRef } from '@/../firebase/db.js'

let library = [];

export default {
	name: 'App',
	components: {
		Search,
		Result,
        CommanderResult, 
        Card,
        LandMenu
	},
	data () {
		return {
			cardResults: [],
			commander: [],
			cards: [],
			error: "",
			symbols: [],
            library: [],
            basiclands: [],
			hasSearchedCommander: null,
            testlibrary: [],
            playmat: '',
            size: 'normal'
		}
	},
	created() {
	},
	methods: {
        ChangeView(view) {
            this.size = view;
		},
		SavePlaymat(url) {
			libraryRef.doc(this.$router.app._route.params.library).set({
				playmat: url
			})
		},
		SaveLibrary(cards) {
			cards.forEach((card) => {
				let card_name = card.name
				let card_image = card.image_uris.png
				if(this.library.length > 0) {
					libraryRef.doc(this.$router.app._route.params.library).collection("cards").orderBy("id", "desc").limit(1).get().then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							if(doc.exists) {
								let cardData = doc.data()
								let card_id = cardData.id + 1;

								libraryRef.doc(this.$router.app._route.params.library).collection("cards").doc(String(card_id)).set({
									id: card_id,
									name: card_name,
									image: card_image
								})
							}
							else {					
							}

						})
					}).catch(function(error) {
						console.log("Error occurred")
					})
				}
				else {
					let card_id = 0
					libraryRef.doc(this.$router.app._route.params.library).collection("cards").doc(String(card_id)).set({
						id: card_id,
						name: card_name,
						image: card_image
					})					
				}
			})

		},
		searchData(searchTerm) {
			const url = 'https://api.scryfall.com/cards/named?fuzzy=';
			this.cards = []
			this.error = this.post = null
			this.loading = true
			let self = this
			fetch(url + searchTerm)
			.then(res => {
				if (res.status === 200) {
					return res.json()
				} else {
					self.error = "No results found";
				}
			})
			.then(response => {
				var cardsData = response
				self.cards = new Array(cardsData);
       		})
			.catch(error => {
				console.error('Error:',error);

			})
		},
		searchCommander(searchTerm) {
			const url = 'https://api.scryfall.com/cards/named?fuzzy=';
			this.commander = []
			this.error = this.post = null
			this.loading = true
			let self = this
			fetch(url + searchTerm)
			.then(res => {
				if (res.status === 200) {
					return res.json()
				} else {
					self.error = "No results found";
				}
			})
			.then(response => {
				var cardsData = response
				self.commander = new Array(cardsData);
       		})
			.catch(error => {
				console.error('Error:',error);

			})
			this.hasSearchedCommander = true;

		},
	},
	firestore() {
		return {
            library: libraryRef.doc(this.$router.app._route.params.library).collection("cards").orderBy("name"),
            settings: libraryRef.doc(this.$router.app._route.params.library)
		}
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
    	max-height: 82vh;
	}

    .gamepad {
        background-size: 100% auto;
        background-repeat: no-repeat;
		background-image: url('https://i.imgur.com/xuOFwIB.png')
    }

    .library-list {
        padding-right: 15px;
		padding-top: 127%;
	}


	.library-list .card {
		margin-top: -127%;
	}

	.library-list img {
		max-width: 100%;
    }
    
    .result {
        padding-top: 10px;
        padding-bottom: 25px;
        display: flex;
        justify-content: space-between;
        align-items: center;

    }

    .result span {
        vertical-align: middle;
        font-size: 12px;
    }

    .result button {
        border: 3px solid #FFF;
        padding: 3px 8px;
        text-transform: uppercase;
        transition: all 0.3s ease-in-out;
        background-color: transparent;
    }
    .result button:hover {
        background-color: #FFF;
        color: #222;
    }

    .settings ul {
        list-style: none;
        padding-top: 8px;
		display: inline-block;
    }

    .settings ul li {
        display: inline-block;
        cursor: pointer;
        opacity: 0.5;
        transition: 0.3s ease-in-out;
        border-bottom: 1px solid transparent;
    }

    .settings ul li:hover {
        opacity: 1;
    }

    .settings ul li.active {
        padding-bottom: 0px;
        border-color: #FFF;
    }

    .settings ul li:not(:last-of-type) {
        margin-right: 15px;
    }

    #commander {
        width: 100%;
    }
	.playmat-setting {
		display: inline-block;
		margin-left: 15px;
		opacity: 0.5;
	}
</style>