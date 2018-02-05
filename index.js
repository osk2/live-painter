const app = new Vue({
  el: '#app',
  data: {
    input: {
      row: 1,
      column: 1,
      showID: false,
      color: '#ffffff'
    },
    leds: []
  },
  methods: {
    createLeds() {
      const ledCount = this.input.row * this.input.column;

      this.leds = [];
      for (let i = 1; i <= ledCount; i++) {
        this.leds.push({
          id: i,
          color: '#ffffff',
          active: false
        });
      }
    },
    triggerColorPicker(e) {
      e.stopPropagation();
      $('.color-picker').trigger('click');
    },
    toggleLed(e) {
      const id = parseInt($(e.target).attr('id'));
      const index = _.findIndex(this.leds, (led) => {
        return led.id === id;
      });
      this.leds[index].active = !this.leds[index].active;
    },
    applyColor(e) {
      const color = $(e.target).val();

      this.leds = _.map(this.leds, (led) => {
        if (led.active) {
          led.color = color;
        }
        return led;
      });
    }
  }
});
