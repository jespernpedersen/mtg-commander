<template> 
    <div class="basic-lands">
        <ul>
            <li @click="AddLand('white')"><img src="./../assets/symbols/mana-w.png" title="Plains"/></li>
            <li @click="AddLand('blue')"><img src="./../assets/symbols/mana-u.png" title="Island"/></li>
            <li @click="AddLand('black')"><img src="./../assets/symbols/mana-b.png" title="Swamp"/></li>
            <li @click="AddLand('red')"><img src="./../assets/symbols/mana-r.png" title="Mountain"/></li>
            <li @click="AddLand('green')"><img src="./../assets/symbols/mana-g.png" title="Forest"/></li>
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
        padding: 0 15px;
        cursor: pointer;
    }
    img {
        max-width: 50px;
    }
</style>
