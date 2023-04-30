<template>
	<v-app dark>
        <div class="new-deck">
            <div class="container v-center">
            <h1>Magic: Commander -> Deck List</h1>
            <p>By jes</p>
            <div class="new-deck-creator">
                <form>
                    <input type="text" v-model="deckname" required placeholder="Name of your deck" @keydown.space.prevent>
                    <a v-bind:href="deckname | lowercase" title="Create new deck" class="button">Create new deck</a>
                </form>
            </div>
        </div>
        </div>
        <div class="container center">
            <h2>All made decks</h2>
            <ul class="all-libraries">
                <li class="library-decks" v-for="library in alllibraries" :key="library.active"> 
                    <a v-bind:href="library.name" v-if="!library.active">{{ library.name }}</a>
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
    filters: {
        lowercase: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.toLowerCase()
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
	},
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
        padding: 8px 20px;
        text-transform: uppercase;
        -webkit-transition: all 0.3s ease-in-out;
        transition: all 0.3s ease-in-out;
        background-color: transparent;
        color: inherit;
        margin-left: 5px;
        outline: none;
        text-decoration: none;
    }

    h2 {
        border-bottom: 2px solid #FFF;
        padding-top: 50px;
        width: 100%;
        margin-bottom: 40px;
        text-transform: uppercase;
    }

    .new-deck {
        background-color: #fff;
        color: #222;
        padding-bottom: 50px;
    }

    form {
        margin-top: 20px;
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
        flex-direction: column;
    }
    ul {
        width: 100%;
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        padding-left: 0;
        overflow-y: scroll;
        max-height: 400px;
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