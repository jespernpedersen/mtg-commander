<template>
	<v-app dark>
        <div class="new-deck">
            <div class="container v-center">
            <h1>Magic: Commander -> Deck List</h1>
            
            <div class="new-deck-creator">
                <form>
                    <input type="text" v-model="deckname" required>
                    <a v-bind:href="deckname" title="Create new deck" class="button">Create new deck</a>
                </form>
            </div>
        </div>
        </div>
        <div class="container center">
            <ul class="all-libraries">
                <li class="library-decks" v-for="library in alllibraries" :key="library.active"> 
                    <a v-bind:href="'/' + library.name" v-if="!library.active">{{ library.name }}</a>
                </li>
            </ul>
        </div>
	</v-app>
</template>

<script>

// Data
import { libraryRef } from '@/../firebase/db.js'

let library = [];

export default {
	name: 'App',
	components: {
	},
	data () {
		return {
            deckname: '',
			alllibraries: [],
		}
	},
	created() {
	},
	methods: {
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
	},
	firestore() {
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
		padding: 0;
        max-width: 1200px;
    }

    h1 {
        text-align: center;
        padding-top: 100px;
        font-size: 40px;
    }

    .button {
        border: 3px solid #FFF;
        padding: 3px 8px;
        text-transform: uppercase;
        -webkit-transition: all 0.3s ease-in-out;
        transition: all 0.3s ease-in-out;
        background-color: transparent;
        color: inherit;
        margin-left: 15px;
        outline: none;
    }

    .new-deck {
        background-color: #fff;
        color: #222;
        padding-bottom: 70px;
    }

    form {
        margin-top: 50px;
    }
    
    .button:hover {
        background-color: #222;
        color: #fff;
    }

    .v-center {
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    input {
        background-color: #222;
        padding: 8px 20px;
        border-radius: 16px;
        color: white;
        outline: none;
    }

    .center {
        display: flex;
        align-items: center;
    }
    ul {
        width: 100%;
        list-style: none;
        display: flex;
        flex-wrap: wrap;
    }
    ul li {
        width: 20%;
        font-size: 18px;
        margin-bottom: 15px;
    }
    ul li a {
        color: inherit;
        text-decoration: none;
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
</style>