<template>

						<v-layout row wrap>
							<v-flex
							v-for="card in cards"
							:key="card.mtgo_id"
							d-flex
							>
						</v-flex>
					</v-layout>
</template>

<script>
export default {
	name: 'Result',
	props: ['cards', 'error', 'symbols', 'commander'],
	data () {
		return {

		}
	},
	computed: {
		pnt(e) {
			if (this.cards[0].power || this.cards[0].toughness) {
				return `${this.cards[0].power} / ${this.cards[0].toughness}`
			}
			if (this.commander[0].power || this.commander[0].toughness) {
				return `${this.commander[0].power} / ${this.commander[0].toughness}`
			}
		},
		mana_cost(e) {
			var mana_cost = this.cards[0].mana_cost;
			var symbols = this.symbols[62];
			console.log(mana_cost);
			if (symbols) {
				symbols.toString(symbol => symbol.code == mana_cost)
				let symbol = this.symbols.find(symbol => {
					if (symbol.code == mana_cost) {
						return `{background-image:${symbol.url};}`
					}
				});
				console.log(symbol);
			}
		}
	}
};
	</script>

<style scoped>

.wrapper {
	margin-bottom: 50px;
}

.margin {
	margin: 10px;
}

.title {
	padding-bottom:5px;
}

.flavor, .artist {
	font-style: italic;
}

.legal {
	color: black;
	font-style: italic;
}

.card-error {
	color: red;
	font-style: italic;
}

#image {
	border-radius: 20px;
}

.theme--dark.v-sheet {
	background-color: transparent;
}

</style>
