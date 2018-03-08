const app = new Vue({
  el: '#app',
  data: {
    input: {
      row: 1,
      column: 1,
      color: '#ffffff',
      showId: false,
      showBoardSetting: false,
      selectMode: '全選',
      deviceID: '10EdaPvQ',
      deviceType: 'Smart',
      pin: 15
    },
    leds: [{
      id: 1,
      color: '#ffffff'
    }],
    exportedCode: '',
    webduino: {
      board: null,
      queue: null,
      ws2812: null
    }
  },
  methods: {
    createLeds() {
      if (typeof this.input.row !== 'number' || this.input.row < 1) {
        this.input.row = 1;
      }
      if (typeof this.input.column !== 'number' || this.input.column < 1) {
        this.input.column = 1;
      }
      const ledCount = this.input.row * this.input.column;

      this.leds = [];
      for (let i = 1; i <= ledCount; i++) {
        this.leds.push({
          id: i,
          color: '#ffffff'
        });
      }
      this.exportCode();
    },
    createBoard(config) {
      return new Promise((resolve, reject) => {
        if (!config || !config.board) {
          reject(new Error('Invalid config'));
        }
        const board = new webduino.WebArduino(config);
        board.once(webduino.BoardEvent.READY, () => {
          this.webduino.board = board;
          resolve(board);
        });
      });
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
      this.executeCode();
    },
    toggleBoardSetting() {
      this.showBoardSetting = !this.showBoardSetting;
      if (!this.showBoardSetting) {
        this.webduino.board.disconnect();
        this.webduino.board = null;
        this.webduino.ws2812 = null;
      }
      return this.showBoardSetting;
    },
    executeCode() {
      if (!this.input.deviceID || !this.input.showBoardSetting) {
        return;
      }

      const config = {
        board: this.input.deviceType,
        device: this.input.deviceID,
        transport: 'mqtt'
      };

      if (this.webduino.queue) {
        clearTimeout(this.webduino.queue);
      }
      this.webduino.queue = setTimeout(() => {
        if (this.webduino.ws2812) {
          return this.webduino.ws2812.setColor(this.exportedCode);
        }
        this.createBoard(config).then((board) => {
          board.samplingInterval = 50;
          board.once(webduino.BoardEvent.DISCONNECT, () => {
            this.webduino.ws2812 = null;
          });
          this.webduino.ws2812 = getWS2812(board, this.input.pin, this.leds.length);
          this.webduino.ws2812.setColor(this.exportedCode);
        })
        .catch((ex) => {
          alert(ex);
        });
      }, 800);
    }
  }
});
