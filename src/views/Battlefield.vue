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
                            <Card v-for="card in library" :key="card.id"
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
					
						<div class="commander-damage-wrapper" v-if="commander.length > 0">
							<div class="commander-damages" v-if="commanderdamages">
								<div class="commander-damage" v-for="(commanderdamage, i) in commanderdamages" :key="i">
									<input type="text" v-model="commanderdamage.name" />
									<span class="commanderdamage"  v-on:click="IncreaseCDamage($event, i)" v-on:click.right="DecreaseCDamage($event, i)">{{ commanderdamage.dmg }}</span>
								</div>
							</div>
							<button @click="AddCommander()">Add Commander Damage</button>
						</div>
					<div class="life-counter" v-on:click="DecreaseLife($event)" v-on:click.right="IncreaseLife($event)">
						<div class="life-total">{{ lifecount }}</div>
					</div>
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
			lifecount: 20,
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
			size: 'normal',
			commanderdamages: [],
			commanderid: 0
		}
	},
	created() {
	},
	methods: {
		AddCommander() {
			let CommanderArray = {
				id: this.commanderid,
				name: "Name",
				dmg: 0
			}
			this.commanderdamages.push(CommanderArray)
			this.commaderid++;
		},
        ChangeView(view) {
            this.size = view;
		},
		SavePlaymat(url) {
			libraryRef.doc(this.$router.app._route.params.library).set({
				playmat: url
			})
		},
		DecreaseCDamage(e, id) {
			e.preventDefault();
			if(e.shiftKey) {
				this.commanderdamages[id].dmg -= 5
			}
			else {
				this.commanderdamages[id].dmg--
			}
		},
		IncreaseCDamage(e, id) {
			if(e.shiftKey) {
				this.commanderdamages[id].dmg += 5
			}
			else {
				this.commanderdamages[id].dmg++
			}
		},
		DecreaseLife(e) {
			if(e.shiftKey) {
				this.lifecount -= 5
			}
			else {
				this.lifecount--
			}
		},
		IncreaseLife(e) {
			e.preventDefault();
			if(e.shiftKey) {
				this.lifecount += 5
			}
			else {
				this.lifecount++
			}
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

    button {
        border: 3px solid #FFF;
        padding: 3px 8px;
        text-transform: uppercase;
        transition: all 0.3s ease-in-out;
        background-color: transparent;
    }
    button:hover {
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

	.life-counter {
		position: absolute;
		top: 10px;
		left: -100px;
		cursor: pointer;
		outline: none;
	}

	.life-total {
		font-size: 64px;
	}
	.commander-damage-wrapper {
		position: absolute;
		width: auto;
		right: 140%;
		top: 2.9%;
		font-size: 16px;
		display: flex;
	}
	.commander-damages {
		display: inline-flex;
		align-items: center;
		font-size: 20px;
	}

	.commander-damage {
		display: grid;
		grid-template-columns: 1fr 50px;
		grid-gap: 15px;
	}

	.commander-damage input {
		display: inline-block;
		text-align: right;
		width: auto;
		max-width: 75px;
	}
	
	.commander-damage-wrapper > button {
		min-width: 250px
	}
</style>