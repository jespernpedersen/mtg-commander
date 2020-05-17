<template>

						<v-layout row wrap>
							<v-flex
							v-for="command in commander"
							:key="command.mtgo_id"
							d-flex
							>
							<v-card flat tile class="d-flex">
                                <Moveable
                                    class="moveable commander"
                                    v-bind="moveable"
                                    @drag="handleDrag"					
                                >
								    <img v-for="command in commander" :key="command.oracle_id" id="commander" :src="command.image_uris.png" />
                                </Moveable>
							</v-card>
						</v-flex>
					</v-layout>
</template>

<script>
import Moveable from 'vue-moveable';

export default {
	name: 'CommanderResult',
    props: ['commander'],
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
    TapUntap(e, id) {
        if (e.shiftKey) {
            if(this.tappedCard == true) {
                this.tappedCard = false
            }
            else {
                this.tappedCard = true
            }
        }
        // Not pressing shift
        else {
        }
    },
    handleDrag({ target, left, top }) {
      console.log('onDrag left, top', left, top);
      target.style.left = `${left}px`;
      target.style.top = `${top}px`;
    },
  },
};
	</script>

<style scoped>
    .moveable {
        position: relative;
    }
    .command-zone {
      position: relative;
    }
    .moveable.commander {
      position: fixed;
    }
    .theme--dark.v-sheet {
        background-color: transparent;
    }

    #commander {
      transition: 0.3s ease-in-out;
    }
    

    .small .moveable #commander {
        max-width: 170px;
    }

    .normal .moveable #commander {
        max-width: 212px;
    }
    .big .moveable #commander {
        max-width: 310px;
    }
</style>
