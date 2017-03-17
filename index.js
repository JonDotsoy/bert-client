'use strict'

const util = require('util')
const Orchestrator = require('orchestrator')
const ShellAgent = require('./lib/agents/Shell')
const DockerAgent = require('./lib/agents/Docker')

function Bert () {
  Orchestrator.call(this)
}
util.inherits(Bert, Orchestrator)

Bert.prototype.agent = function (name, opts = {}) {
  const agents = this.agents || {}

  const agent = new DockerAgent(opts)

  agents[name] = Object.assign(agent, {name})

  this.agents = agents

  return agents[name]
}

Bert.prototype.shell = new ShellAgent()
Bert.prototype.sh = function () { return this.shell.sh.apply(this.shell, arguments) }

Bert.prototype.task = Bert.prototype.add

// Let people use this class from our instance
Bert.prototype.Bert = Bert

var inst = new Bert()
module.exports = inst
