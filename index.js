'use strict'

const stackTrace = require('stack-trace')
const util = require('util')
const glob = require('glob')
const Orchestrator = require('orchestrator')
const ShellAgent = require('./lib/agents/Shell')
const DockerAgent = require('./lib/agents/Docker')

function Bert () {
  Orchestrator.call(this)
}
util.inherits(Bert, Orchestrator)

Bert.prototype.agent = function (name, opts = {}) {
  const agents = this.agents || {}

  const agent = new DockerAgent(Object.assign(opts, {name}))

  agents[name] = agent

  agent._sh = agent.sh
  agent.sh = function (args, opts) { return agent._sh.call(agent, args, opts, getStackTrace(2)) }

  this.agents = agents

  return agents[name]
}

Bert.prototype.shell = new ShellAgent()
Bert.prototype.sh = function (args, opts) { return this.shell.sh.call(this.shell, args, opts, getStackTrace(1)) }

Bert.prototype.task = Bert.prototype.add

// Let people use this class from our instance
Bert.prototype.Bert = Bert

/* Put the current stacktrace on .sh() */
function getStackTrace (n) {
  return stackTrace.get()[n]
}

var inst = new Bert()
module.exports = inst
