const app = new Vue({
  el: '#app',
  data: {
    input: {
      row: 1,
      column: 1,
      color: '#ffffff',
      idMode: false,
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
    applyColor(e) {
      const id = parseInt($(e.target).attr('id'));
      const index = _.findIndex(this.leds, (led) => {
        return led.id === id;
      });

      this.leds[index].color = this.input.color;
      this.exportCode();
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
