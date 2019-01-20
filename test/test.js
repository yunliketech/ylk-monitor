describe('karma Test', function () {
  it('should have jQuery', function () {
    if (!window.jQuery) {
      throw new Error('查看下 karma.conf.js 配置项 files 是否正确')
    }
  })

  it('should have jQuery', function () {
    if (!window.ylkMonitor) {
      throw new Error('查看ylkMonitor不存在')
    }
  })



  describe('默认配置初始化', function () {

    before(function () {
      window.ylkMonitor.init({
        id: 1,
        url: 'http://localhost:9876/pathToMonitorServer'
      });
    })

    it('Can trriger an errorReport', function (done) {
      ylkMonitor.on('beforeReport', function (msg) {
        msg.log.forEach(function (item) {
          if (item.type === 'error') {
            console.log('准备上报一个error');
            done()
          }
        })
      });
      // 执行不存在的函数，触发报错
      setTimeout(function () {
        window.isNotFunc()
      }, 500)
    })

    it('Can trriger a DiyReport', function (done) {
      ylkMonitor.on('beforeReport', function (msg) {
        msg.log.forEach(function (item) {
          if (item.type === 'diy') {
            console.log('准备上报一个diy');
            done()
          }
        })
      })

      ylkMonitor.submit({
        type:'diy',
        msg:'自定义直接上报'
      })
    })

    it('Can trriger a performanceReport', function (done) {
      ylkMonitor.on('beforeReport', function (msg) {
        msg.log.forEach(function (item) {
          if (item.type === 'performance') {
            console.log('准备上报一个performance')
            done()
          }
        })
      })
    })
  })
})