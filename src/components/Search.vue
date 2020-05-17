<template>
	<v-container>
		<v-layout row wrap>
			<v-flex xs12 sm12 md12>
				<v-form v-on:submit.prevent="handleSearch">
					<v-text-field
					class="md5"
					v-model="value"
					:hint="'Try searching for \'Birds of Paradise\'.'"
					:label="`Search for a MTG card...`"
					v-on:click:append="$emit('search-cards', this.target.value)"
					@submit="handleSearch"
					></v-text-field>
				</v-form>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>

export default {
	name: 'Search',

	data() {
		return {
			loading: false,
			post: null,
			error: null,
			value: ""
		}
	},
methods: {
		handleSearch() {
			this.$emit('search-cards', this.value);
		}
	}
}

	</script>
