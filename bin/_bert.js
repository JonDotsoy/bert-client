#! /usr/bin/env node

const path = require('path')
const argv = require('minimist')(process.argv.slice(2), {
  default: {
    bertfile: '.bert.js'
  }
})
const localBert = require('..')
const logger = require('../lib/logger')

localBert.on('task_start', function ({task}) {
  console.log(logger.startTask(task))
})

localBert.on('task_stop', function ({task, duration}) {
  console.log(logger.stopTask(task, duration))
})

const bertfile = path.join(process.cwd(), argv.bertfile)

async function run () {
  /* Load task bert */
  require(bertfile)

  localBert.start('default')
}

run()