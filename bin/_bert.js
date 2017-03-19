#! /usr/bin/env node
const path = require('path')
const querystring = require('querystring')
const fs = require('fs')

const every = require('lodash/every')
const argv = require('minimist')(process.argv.slice(2), {
  default: {
    bertfile: '.bert.js'
  }
})
const localBert = require('..')
const logger = require('../lib/logger')

const getToLoadTasks = () => argv._.length === 0 ? ['default'] : argv._

let countRunClears = 0

localBert.on('task_start', function ({task}) {
  console.log(logger.startTask(task))
})

localBert.on('task_stop', function ({task, duration}) {
  if (countRunClears === 0) {
    process.nextTick(() => {
        localBert.start('clear containers')
    })
  }

  console.log(logger.stopTask(task, duration))
})

localBert.on('task_err', function ({task, message, err}) {
  console.log(logger.errTask(task, message, err.stack))
  process.exit(1)
})

localBert.task('clear containers', async () => {
  countRunClears += 1

  if (every(getToLoadTasks().map(task => localBert.tasks[task].done), Boolean)) {
    await Promise.all(Object.keys(localBert.agents).map(agent => localBert.agents[agent].rmContainer({silent: !true})))
  }
})

global.bert = localBert
const bertfile = path.join(process.cwd(), argv.bertfile)

async function run () {
  /* Load task bert */
  require(bertfile)

  getToLoadTasks().map(e => localBert.start(e))
}

run()
.catch(err => console.error(err.stack))
