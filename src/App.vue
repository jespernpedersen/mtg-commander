<template>
  <div id="app">
    <div id="nav" >
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  data() {
  },
}
</script>

<style>

	@font-face {
		font-family: 'Beleren';
		src: url('./assets/fonts/Beleren-Bold.eot?#iefix') format('embedded-opentype'),  url('./assets/fonts/Beleren-Bold.woff') format('woff'), url('./assets/fonts/Beleren-Bold.ttf')  format('truetype'), url('./assets/fonts/Beleren-Bold.svg#Beleren-Bold') format('svg');
		font-weight: normal;
		font-style: normal;
	}

	*,
	h2 {
		font-family: 'Beleren', sans-serif;
	}

	.v-tabs__bar {
		background-color: transparent !important;
	}

	.v-tabs__wrapper--show-arrows {
		margin: 0 !important;
	}

	h2 {
		padding-top: 10px;
		font-size: 28px;
	}

	.application a,
	.application a:hover {
		color: #FFF;
	}

</style>
