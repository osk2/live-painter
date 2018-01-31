const app = new Vue({
  el: '#app',
  data: {
    input: {
      row: 0,
      column: 0
    },
    status: {
      isSelected: false,
      selected: {
        $target: null,
        row: 0,
        column: 0
      }
    },
    rows: []
  },
  methods: {
    createTable() {
      // Push led into row
      this.rows = [];
      for (let i = 1; i <= this.input.row; i++) {
        const row = {
          id: i,
          leds: []
        };

        for (let j = 1; j <= this.input.column; j++) {
          const led = {
            id: j,
            active: false,
            color: ''
          }
          row.leds.push(led);
        }
        this.rows.push(row);
      }
    },
    triggerColorPicker() {
      $('.current-color').trigger('click');
    },
    changeColor(e) {
      const $target = $(e.target);
      const color = $target.val();

      this.rows[row - 1].leds[column - 1].color = color;
      this.status.selected.$target.css('background-color', color);
    },
    selectColumn(e) {
      const $target = $(e.target);
      const row = $target.data('row');
      const column = $target.data('column');

      _.each(this.rows, (row) => {
        _.map(row.leds, (led) => {
          led.active = false;
          return led;
        });
      });
      this.rows[row - 1].leds[column - 1].active = true;
      this.status.isSelected = !this.status.isSelected;
      this.status.selected.$target = $target;
      this.status.selected.row = row;
      this.status.selected.column = column;
    }
  }
});
