const app = new Vue({
  el: '#app',
  data: {
    input: {
      row: 1,
      column: 1,
      color: '#ffffff',
      idMode: false,
      selectMode: '全選'
    },
    leds: [{
      id: 1,
      color: '#ffffff',
      active: false
    }],
    exportedCode: '',
    constant: {
      all: '全選',
      none: '全不選'
    },
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
      this.input.selectMode = this.constant.all;
      this.exportCode();
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
      this.exportCode();
    },
    selectMode() {
      if (this.input.selectMode === this.constant.all) {
        this.leds = _.map(this.leds, (led) => {
          led.active = true;
          return led;
        });
        return this.input.selectMode = this.constant.none;
      }
      if (this.input.selectMode === this.constant.none) {
        this.leds = _.map(this.leds, (led) => {
          led.active = false;
          return led;
        });
        return this.input.selectMode = this.constant.all;
      }
    },
    exportCode() {
      const codeArray = _.map(this.leds, (led) => {
        let id = led.id.toString();

        if (id.length < 2) {
          id = '0' + id;
        }
        return id + led.color.replace('#', '');
      });

      this.exportedCode = codeArray.join('');
    }
  }
});
