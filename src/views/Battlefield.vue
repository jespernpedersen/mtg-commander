<template>
	<v-app dark>
        <div v-bind:class="size">
			<div dark class="gamepad" v-bind:style="{ backgroundImage: 'url(' + settings.playmat + ')' }">
				<div class="library">					
					<div class="deck-list">
						<div :class="{ active: showLibraryList }">
						<span @click="showLibrary()">{{ currentDeck }} <unicon name="angle-down" /></span>
						<ul class="all-libraries">
							<li class="library-decks" v-for="library in alllibraries" :key="library.active"> 
								<a v-bind:href="'/' + library.name" v-if="!library.active">{{ library.name }}</a>
							</li>
						</ul>
						</div>
					</div>
					<Search v-on:search-cards="searchData" />
					<div class="library-tools">
						<Result :error="error" :cards="cards" />
                        <div class="result"  v-if="cards.length > 0" >
                        	<span style="color: lightgreen;">Card has been found</span>
							<button @click="SaveLibrary(cards)">Add to library?</button>
                        </div>
					</div>
					<div class="library-list" :class="{ expanded: hideTokenList }">
                            <Card v-for="card in library" 
								:key="card.id"
                                :id="card.id"
                                :name="card.name"
                                :image="card.image"
								:commander="false"
								:isToken="false"
								:flip="card.flip"
								:imagealt="card.alternative_image"
                            >
                            </Card>
					</div>
					<div class="token-library">
						<div class="token-list" v-if="!hideTokenList">
							<Card v-for="token in tokenLibrary"
								:key="token.id"
								:id="token.id"
								:name="token.name"
								:image="token.image"
								:commander="false"
								:isToken="false"
								:cannotMove="true"
								>
							</Card>
						</div>
						<button @click="showTokenSearch()"  v-if="!hideTokenList" class="token-button">Search new tokens</button>
						<button @click="hideTokens()" v-if="!hideTokenList" class="hide-tokens">Hide Token List</button>
						<button @click="showAllTokens()" v-if="hideTokenList" class="show-tokens">Show Token List</button>
						<div class="history">
                        	<div v-for="(message, i) in messages" :key="i" >
								<div class="message">
									<strong class="owner">{{ message.owner }}: </strong><span>{{ message.text }}</span>
								</div>
							</div>
						</div>
					</div>
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
					<div class="tokens">
                        <figure v-for="(token, i) in tokensActive" :key="i" class="tokens-active">
                            <Card
								:image="token.image"
                                :id="i"
								:name="token.name"
								:commander="false"
								:isToken="true" 
								:cannotMove="false"
                            >
                            </Card>
                        </figure>
					</div>
                    <div class="lands">
                        <figure v-for="(basicland, i) in basiclands" :key="i" class="basic-land">
                            <Card
                                :type="basicland.landType"
                                :id="i"
								:commander="false"
								:isToken="false"
                            >
                            </Card>
                        </figure>
                        <LandMenu>
                        </LandMenu>
                    </div>
				</div>
				<div class="special-zone">
						<div class="commander-damage-wrapper" v-if="hasSearchedCommander">
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
						<div id="search-wrapper">
							<Search v-on:search-cards="searchCommander" />
						</div>
						<div class="commander" v-if="settings.commander">
                            <Card :key="i" 
                                :id="settings.commander.id"
                                :name="settings.commander.name"
                                :image="settings.commander.image"
								:commander="true"
								:isToken="false"
                            >
                            </Card>
						</div>
						<div class="partner" v-if="settings.partner">
							<Card :key="i" 
									:id="settings.partner.id"
									:name="settings.partner.name"
									:image="settings.partner.image"
									:commander="true"
									:isToken="false"
							>
							</Card>
						</div>
						<div class="commander" v-if="!settings.commander">
                            <Card v-for="(card, i) in commander" :key="i" 
                                :id="settings.commander.id"
                                :name="settings.commander.name"
                                :image="settings.commander.image"
								:commander="true"
								:isToken="false"
                            >
                            </Card>
						</div>
					</div>
					<div class="graveyard">
						<h2>GRAVEYARD</h2>
					</div>
				</div>
			</div>
        </div>
		<div class="token-modal" v-if="showTokenList">
			<div class="modal-content">
				<h3>Tokens</h3>
				<SearchToken v-on:search-cards="searchTokenData"/>
				<div class="token-gallery" v-if="tokenList[0]">
					<Card v-for="token in tokenList" :key="token.id"
						:id="token.id"
						:name="token.name"
						:image="token.image"
						:commander="false"
						:isToken="false"
						:type="false"
						:flip="false"
						:isTokenList="true"
					>
					</Card>
				</div>
				<span class="close-modal" @click="hideTokenSearch()">Close</span>
			</div>
		</div>
	</v-app>
</template>

<script>
import Search from '@/components/Search'
import SearchToken from '@/components/SearchToken'
import Result from '@/components/Result'
import CommanderResult from '@/components/CommanderResult'
import Card from '@/components/Card'
import LandMenu from '@/components/LandMenu'

// Data
import { libraryRef, messageRef } from '@/../firebase/db.js'

let library = [];


let newLifeCount = 20

export default {
	name: 'App',
	components: {
		Search,
		SearchToken,
		Result,
        CommanderResult, 
        Card,
        LandMenu
	},
	data () {
		return {
			lifecount: newLifeCount,
			cardResults: [],
			commander: [],
			cards: [],
			messages: [],
			tokenLibrary: [],
			tokenList: [],
			tokensActive: [],
			error: "", 
			symbols: [],
            library: [],
            basiclands: [],
			hasSearchedCommander: null,
            testlibrary: [],
            playmat: '',
			size: 'normal',
			commanderdamages: [],
			commanderid: 0,
			alllibraries: [],
			currentDeck: this.$router.app._route.params.library,
			showLibraryList: false, 
			settings: [],
			showTokenList: false,
			showTokens: true,
			hideTokenList: false,
			gameStarted: false
		}
	},
	created() {
		window.addEventListener('beforeunload', (event) => {
			if(this.gameStarted) {
				event.preventDefault();
				event.returnValue = '';
			}
		});
	},
	methods: {
		DuplicateToken(name, image) {
			this.tokensActive.push({
				name: name,
				image: image,
				id: this.tokensActive.length
			})
			console.log("Adding token")
		},
		hideTokens() {
			this.hideTokenList = true
		},
		showAllTokens() {
			this.hideTokenList = false
		},
		showLibrary() {
			if(this.showLibraryList == false) {
				this.showLibraryList = true
			}
			else {
				this.showLibraryList = false
			}
		},
		showTokenSearch() {
			this.showTokenList = true;
		},
		hideTokenSearch() {
			this.showTokenList = false;
		},
		AddToken(name, image) {
			let tokenArray = {
				name: name,
				image: image
			}
			libraryRef.doc(this.$router.app._route.params.library).collection("tokens").doc().set({
				name: name,
				image: image
			})
		},
		getLibraries() {
			libraryRef.get().then((libraries) => {
				libraries.forEach((library) => {
					if(library.exists) {
						if(this.$router.app._route.params.library != library.id) {
							let libraryArray = {
								name: library.id,
								active: false
							}
							this.alllibraries.push(libraryArray)	
						}
					}
				})
			})
		},
		checkCommander() {
			let this_library = libraryRef.doc(this.$router.app._route.params.library)

			this_library.get().then((doc) => {
				if(doc.exists) {
					let docData = doc.data()
					if(docData.commander.name != undefined) {
						this.lifecount = 40;
						this.hasSearchedCommander = true;
					}
				}
			})
		},
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
			libraryRef.doc(this.$router.app._route.params.library).update({
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

				if(card.card_faces) {
					let card_image = card.card_faces[0].image_uris.png
					let card_image_alt = card.card_faces[1].image_uris.png

					if(this.library.length > 0) {
						libraryRef.doc(this.$router.app._route.params.library).collection("cards").orderBy("id", "desc").limit(1).get().then((querySnapshot) => {
							querySnapshot.forEach((doc) => {
								if(doc.exists) {
									let cardData = doc.data()
									let card_id = cardData.id + 1;

									libraryRef.doc(this.$router.app._route.params.library).collection("cards").doc(String(card_id)).set({
										id: card_id,
										name: card_name,
										image: card_image,
										flip: true,
										alternative_image: card_image_alt
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
							image: card_image,
							flip: true,
							alternative_image: card_image_alt
						})					
					}
				}
				else {
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
				}
				console.log(card_image)

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
		searchTokenData(searchTerm) {
			const url = 'https://api.scryfall.com//cards/search?q=';
			const isToken = '+%2B%2Bis%3Atoken'
			this.tokenList = []
			this.error = this.post = null
			this.loading = true
			let self = this
			fetch(url + searchTerm + isToken)
			.then(res => {
				if (res.status === 200) {
					return res.json()
				} else {
					self.error = "No results found";
				}
			})
			.then(response => {
				let tokensData = {
					name: response.name,
					image: response.image_uris
				}
				response.data.forEach((token) => {
					let tokenArray = {
						id: token.mtgo_id,
						name: token.name,
						image: token.image_uris.png,
					}
					self.tokenList.push(tokenArray);
				})
       		})
			.catch(error => {
				console.error('Error:', error);

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
				if(self.settings.commander) {
					let commanderArray = {
						id: self.commander[0].oracle_id,
						name: self.commander[0].name,
						image: self.commander[0].image_uris.png
					}
					libraryRef.doc(this.$router.app._route.params.library).update({
						partner: commanderArray
					})
				}
				else {
					let commanderArray = {
						id: self.commander[0].oracle_id,
						name: self.commander[0].name,
						image: self.commander[0].image_uris.png
					}
					libraryRef.doc(this.$router.app._route.params.library).update({
						playmat: this.settings.playmat,
						commander: commanderArray
					})
				}
       		})
			.catch(error => {
				console.error('Error:',error);

			})
			this.hasSearchedCommander = true;
			this.lifecount = 40;

		},
	},
	firestore() {
		return {
			library: libraryRef.doc(this.$router.app._route.params.library).collection("cards").orderBy("name"),
			tokenLibrary: libraryRef.doc(this.$router.app._route.params.library).collection("tokens").orderBy("name"),
			settings: libraryRef.doc(this.$router.app._route.params.library),
			messages: messageRef.orderBy('timeStamp'),
			hasCommander: this.checkCommander()
		}
	},
	mounted() {
		this.getLibraries()
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
		position: relative;
		z-index: 50
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
		transition: 0.3s ease-in-out;
	}

	.library-list.expanded {
		max-height: 80vh;
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

    .library-list,
	.token-list {
        padding-right: 15px;
    	padding-top: 109%;
	}


	.library-list .card,
	.token-list .card {
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

	.basic-lands {
		position: fixed;
		top: 93vh;
		width: 100%;
		text-align: center;
		transform: translate(-50%, -50%);
		left: 50%;
		z-index: 20;
	}
	
	.commander-damage-wrapper > button {
		min-width: 250px
	}

	.all-libraries {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.all-libraries a {
		color: inherit;
		text-decoration: none;
	}

	.deck-list {
		position: relative;
	}

	.deck-list span {
		border: 2px solid #FFF;
		width: 100%;
		display: inline-block;
		padding: 5px 15px;
		transition: 0.3s ease-in-out;
		font-size: 15px;
		cursor: pointer;
		position: relative;
		text-transform: uppercase;
	}

	.deck-list .active span,
	.deck-list:hover span {
		background-color: #FFF;
		color: #222;
		border-bottom: 2px solid #222;
	}

	.deck-list .unicon {
		position: absolute;
		right: 4px;
		top: 4px;
		fill: #FFF;
		transition: 0.3s ease-in-out;
	}

	.deck-list .active .unicon {
		fill: #222;
		transform: rotate(180deg);
		top: -4px;
	}

	.deck-list:hover .unicon {

		fill: #222;		
	}
	

	.deck-list ul {
		position: absolute;
		background-color: #FFF;
		color: #222;
		width: 100%;
		z-index: 9999;
		padding: 10px 0;

		pointer-events: none;
		opacity: 0;
	}


	.deck-list .active ul {
		pointer-events: all;
		opacity: 1;
	}

	.deck-list ul li {
		padding: 3px 15px;
	}


	.token-modal {
		content:"";
		position: absolute;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0,0,0, 0.4);
		left: 0;
		top: 0;
		z-index: 99999999999;
	}

	.token-modal .modal-content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		height: 60vh;
		width: 60vw;
		background-color: rgba(255, 255, 255, 0.4);
		padding: 10px 60px;
	}

	.token-modal h3 {
		text-align: center;
		font-size: 40px;
		padding-top: 15px;
	}

	.token-gallery {
		margin-top: 20px;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-gap: 30px;
		overflow-y: scroll;
		max-height: calc(60vh - 173px);
		padding: 0 15px;
	}

	.token-library {
		margin-top: 5px;
	}

	.library-list:not(.expanded) {
		margin-bottom: 25px;
	}

	.close-modal {
		top: 30px;
		right: 30px;
		position: absolute;
		font-size: 18px;
		cursor: pointer;
	}

	.token-library {
		position: relative;
	}

	.token-button,
	.hide-tokens,
	.show-tokens {
		position: relative;
		z-index: 99999999999;
		margin-top: 5px;
		font-size: 12px;
	}

	.hide-tokens {
		margin-left: 10px;
	}
	
	.hide-tokens,
	.show-tokens {
		margin-top: 10px;
	}
	.history {
		height: 100px;
		background-color: rgba(255, 255, 255, 0.7);
		padding: 20px;
		overflow-y: scroll;
		position: absolute;
		bottom: 45px;
		left: 290px;
		width: 120%;
		color: #000;
		overflow-x: hidden;
		display: flex;
		align-items: flex-end;
		flex-direction: column;
		justify-content: center;
	}

	.history > div {
		width: 100%;
	}

	.history .message span {
		text-align: left;
		opacity: 0.5;
	}

	.partner {
		margin-top: -310px;
		margin-left: 25px;
	}
</style>