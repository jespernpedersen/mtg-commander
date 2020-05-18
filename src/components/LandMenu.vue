<template> 
    <div class="basic-lands">
        <ul>
            <li @click="AddLand('white')">Plains</li>
            <li @click="AddLand('blue')">Island</li>
            <li @click="AddLand('black')">Swamp</li>
            <li @click="AddLand('red')">Mountain</li>
            <li @click="AddLand('green')">Forest</li>
        </ul>
    </div>
</template>

<script>
import Moveable from 'vue-moveable';

export default {
	name: 'BasicLands',
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
  }),
  methods: {
    AddLand(land) {
        // console.log(land)
        if(land == 'white') {
            let name = 'Plains'
        }
        else if(land == 'blue') {
            let name = 'Island'
        }
        else if(land == 'black') {
            let name = 'Swamp'
        }
        else if(land == 'red') {
            let name = 'Mountain'
        }
        else if(land == 'green') {
            let name = 'Forest'
        }
        let type = land

        let LandArray = {
            landName: name,
            landType: type
        }
        this.$parent.$parent.basiclands.push(LandArray)
        console.log(this.$parent.$parent.basiclands)

    },
  },
};
	</script>

<style scoped>
    ul {
        list-style: none;
        margin-left: 0;
        padding-left: 0;
        padding-top: 32px;
    }

    li {
        display: inline-block;
        padding: 0 25px;
        cursor: pointer;
    }
    img {
        width: 100%;
    }
</style>
