const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

module.exports = class extends Generator {
  initializing() {
    // 打印欢迎语
    this.log(
      yosay(`Welcome to the shining ${chalk.cyan('generator-njr-vue')} generator!`)
    );
  }

  prompting() {
    // 让用户选择是否需要包含vuex
    const prompts = [
      // 平台
      {
        type: 'list',
        name: 'platform',
        message: 'Which platform would you like?',
        choices: [
          {
            name: 'PC',
            value: 'pc'
          },
          {
            name: 'Mobile',
            value: 'mobile'
          }
        ]
      },
      // 项目名
      {
        type: 'input',
        name: 'name',
        message: 'Name of project:',
        default: path.basename(process.cwd())
      },
      // 项目描述
      {
        type: 'input',
        name: 'description',
        message: 'Description:',
        default: ''
      },
      // 加vuex
      {
        type: 'confirm',
        name: 'includeVuex',
        message: 'Would you like to include "vuex" in your project?',
        default: true
      },
      // ============== mobile
      // 加wechat js-SDK
      {
        type: 'confirm',
        name: 'includeWechat',
        message: 'Would you like to include "wechat JS-SDK" in your project?',
        default: false,
        when: answers => {
          return answers.platform === 'mobile';
        }
      },
      {
        type: 'confirm',
        name: 'includeHybrid',
        message: 'Would you like to include "hybrid" in your project?',
        default: false,
        when: answers => {
          return answers.platform === 'mobile';
        }
      },
      // ==============
      // ============== pc
      // 加element-ui
      {
        type: 'confirm',
        name: 'includeElementUI',
        message: 'Would you like to include "element-ui" in your project?',
        default: false,
        when: answers => {
          return answers.platform === 'pc';
        }
      },
      // 支持的IE的版本
      {
        type: 'list',
        name: 'ieVersion',
        message: 'Which "version of IE" would you like to support?',
        choices: [
          {
            name: 'IE 9',
            value: '9'
          },
          {
            name: 'IE 10',
            value: '10'
          },
          {
            name: 'IE 11 or higher',
            value: '11'
          }
        ],
        default: '11',
        when: answers => {
          return answers.platform === 'pc';
        }
      },
      // ==============
      // 单元测试
      {
        type: 'confirm',
        name: 'includeUnitTest',
        message: 'Would you like to include "unit-test"?',
        default: false
      },
      // 端到端测试
      {
        type: 'confirm',
        name: 'includeE2eTest',
        message: 'Would you like to include "e2e-test"?',
        default: false
      },
      // 加hubble
      {
        type: 'confirm',
        name: 'includeHubble',
        message: 'Would you like to include "hubble of netease" in your project?',
        default: false
      }
    ];
    return this.prompt(prompts).then(answers => {
      this.platform = answers.platform;
      this.name = answers.name;
      this.description = answers.description;
      this.includeUnitTest = answers.includeUnitTest;
      this.includeE2eTest = answers.includeE2eTest;
      this.ieVersion = answers.ieVersion;
      this.includeVuex = answers.includeVuex;
      this.includeElementUI = answers.includeElementUI;
      this.includeHubble = answers.includeHubble;
      this.log(chalk.green('platform: ', this.platform));
      this.log(chalk.green('name: ', this.name));
      this.log(chalk.green('description: ', this.description));
      this.log(chalk.green('includeUnitTest: ', this.includeUnitTest));
      this.log(chalk.green('includeE2eTest: ', this.includeE2eTest));
      this.log(chalk.green('includeVuex: ', this.includeVuex));
      this.log(chalk.green('includeHubble: ', this.includeHubble));
      // 如果选择PC平台，则有下列参数
      if (this.platform === 'pc') {
        this.log(chalk.green('ieVersion: ', this.ieVersion));
        this.log(chalk.green('includeElementUI: ', this.includeElementUI));
        // 处理ie version
        this.ieVersionSupport = '';
        switch (this.ieVersion) {
          case '9':
            this.ieVersionSupport = 'ie >= 9';
            break;
          case '10':
            this.ieVersionSupport = 'ie >= 10';
            break;
          default:
            this.ieVersionSupport = 'ie >= 11';
        }
      } else {
        this.log(chalk.green('includeHybrid: ', this.includeHybrid));
        this.log(chalk.green('includeWechat: ', this.includeWechat));
        this.includeHybrid = answers.includeHybrid;
        this.includeWechat = answers.includeWechat;
      }
    });
  }

  configuring() {
    // 因为husky原理是在安装的时候去.git文件夹中的hooks做修改
    // 所以在安装之前，需要确认git是否已经安装
    // 如果不存在git，则init一下
    // 否则直接安装
    if (!fs.existsSync('.git')) {
      spawn('git', ['init']);
    }
  }

  writing() {
    // 复制普通文件
    // https://github.com/sboudrias/mem-fs-editor
    this.fs.copyTpl(
      this.templatePath(),
      this.destinationPath(),
      {
        isPc: this.platform === 'pc',
        name: this.name,
        includeUnitTest: this.includeUnitTest,
        includeE2eTest: this.includeE2eTest,
        ieVersion: this.ieVersionSupport,
        includeElementUI: this.includeElementUI,
        includeVuex: this.includeVuex,
        includeHubble: this.includeHubble,
        includeHybrid: this.includeHybrid,
        includeWechat: this.includeWechat
      },
      {},
      {
        globOptions: {
          // https://github.com/isaacs/node-glob
          dot: true,
          ignore: ['**/@selections/**'],
          gitignore: false
        }
      }
    );

    // 处理package.json
    let pkgJson = {
      name: this.name,
      description: this.description,
      dependencies: {},
      devDependencies: {}
    };

    // 根据用户选择，决定是否安装 单元测试（unit test）
    if (this.includeUnitTest) {
      // 处理package.json
      pkgJson.devDependencies = Object.assign({}, pkgJson.devDependencies, {
        mocha: '^5.2.0',
        karma: '^3.0.0',
        'karma-chrome-launcher': '^2.2.0',
        'karma-coverage': '^1.1.2',
        'karma-jasmine': '^1.1.2',
        'karma-mocha': '^1.3.0',
        'karma-mocha-reporter': '^2.2.5',
        'karma-sinon-chai': '^1.3.4',
        'karma-sourcemap-loader': '^0.3.7',
        'karma-webpack': '^4.0.0-rc.2',
        sinon: '^4.5.0',
        chai: '^4.2.0',
        'sinon-chai': '^3.2.0',
        'babel-plugin-istanbul': '^5.1.0'
      });
      // 把unit拿出来(test/unit)
      this.fs.copy(
        this.templatePath('@selections/common/test/unit'),
        this.destinationPath('test/unit')
      );
    }

    // 根据用户选择，决定是否安装 端到端测试（e2e test）
    if (this.includeE2eTest) {
      // 处理package.json
      pkgJson.devDependencies = Object.assign({}, pkgJson.devDependencies, {
        mocha: '^5.2.0',
        chai: '^4.2.0',
        nightmare: '^3.0.1'
      });
      // 把e2e拿出来(test/e2e)
      this.fs.copy(
        this.templatePath('@selections/common/test/e2e'),
        this.destinationPath('test/e2e')
      );
    }

    // 根据用户选择，决定是否安装vuex
    if (this.includeVuex) {
      // 处理package.json
      pkgJson.dependencies = Object.assign({}, pkgJson.dependencies, {
        vuex: '^3.0.1'
      });
      // 把store拿出来(src/store)
      this.fs.copy(
        this.templatePath('@selections/common/vuex/store'),
        this.destinationPath('src/store')
      );
    }

    // 根据用户选择，决定是否安装element-ui
    if (this.includeElementUI) {
      // 处理package.json
      pkgJson.dependencies = Object.assign({}, pkgJson.dependencies, {
        'element-ui': '^2.4.8'
      });
      // 将element-ui拷贝到src/plugins中
      this.fs.copy(
        this.templatePath('@selections/pc/plugins/element-ui'),
        this.destinationPath('src/plugins/element-ui')
      );
    }

    // 根据用户选择，决定是否加入hubble埋点
    if (this.includeHubble) {
      // 将hubble拷贝到src/plugins中
      this.fs.copy(
        this.templatePath('@selections/common/plugins/hubble'),
        this.destinationPath('src/plugins/hubble')
      );
    }

    // 用户选择mobile做的通用文件拷贝
    if (this.platform === 'mobile') {
      // 将mobile通用的plugins资源拷贝到src/plugins中
      this.fs.copy(
        this.templatePath('@selections/mobile/plugins/device'),
        this.destinationPath('src/plugins/device')
      );
      this.fs.copy(
        this.templatePath('@selections/mobile/plugins/dialog'),
        this.destinationPath('src/plugins/dialog')
      );
      this.fs.copy(
        this.templatePath('@selections/mobile/plugins/fastclick'),
        this.destinationPath('src/plugins/fastclick')
      );
      this.fs.copy(
        this.templatePath('@selections/mobile/plugins/responsive'),
        this.destinationPath('src/plugins/responsive')
      );
      this.fs.copy(
        this.templatePath('@selections/mobile/plugins/toast'),
        this.destinationPath('src/plugins/toast')
      );
      this.fs.copy(
        this.templatePath('@selections/mobile/plugins/vue-lazyload'),
        this.destinationPath('src/plugins/vue-lazyload')
      );
      // 处理package.json
      pkgJson.dependencies = Object.assign({}, pkgJson.dependencies, {
        fastclick: '^1.0.6',
        'vue-lazyload': '^1.2.6'
      });
      pkgJson.devDependencies = Object.assign({}, pkgJson.devDependencies, {
        'postcss-pxtorem': '^4.0.1'
      });
    }

    // 根据用户选择，决定是否加入微信SDK
    if (this.includeWechat) {
      // 将wechat拷贝到src/plugins中
      this.fs.copy(
        this.templatePath('@selections/mobile/plugins/wechat'),
        this.destinationPath('src/plugins/wechat')
      );
    }

    // 根据用户选择，决定是否加入hybrid
    if (this.includeHybrid) {
      // 将hybrid拷贝到src/plugins中
      this.fs.copy(
        this.templatePath('@selections/mobile/plugins/hybrid'),
        this.destinationPath('src/plugins/hybrid')
      );
    }

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }

  install() {
    this.npmInstall();
  }

  end() {
    this.log(chalk.green('Construction completed!'));
  }

  _copyTo(from, to) {
    this.fs.copy(this.templatePath(from), this.destinationPath(to));
  }
};
