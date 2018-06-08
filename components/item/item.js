// components/item/item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: String,
      value: ''
    },
    tags: {
      type: Array,
      value: []
    },
    extra: {
      type: String,
      value: ''
    },
    finished: {
      type: Boolean,
      value: false
    },
    action: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    collapsed: true
  },

  attached: function () {
    console.log('component attached!');
  },

  detached: function () {
    console.log('component dettached!');
  },

  /**
   * 组件的方法列表
   */
  methods: {
    removeTodo: function () {
      this.triggerEvent('itemremove');
    },
    toggleExtra: function (e) {
      this.setData({
        collapsed: !this.data.collapsed
      });
    }
  }
})
