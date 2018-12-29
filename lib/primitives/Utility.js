'use strict'

const colors = require('colors/safe')

const defaultArgTypes = {
  'string': 'method',
  'function': 'callback',
  'object': (obj) => { return Array.isArray(obj) ? 'required' : 'params' }
}

let isVerbose = false

class Utility {
  static verbose () {
    Utility.setVerbose(true)
  }

  static setVerbose (verbose) {
    isVerbose = !!verbose
  }

  static toggleVerbose () {
    isVerbose = !isVerbose
  }

  static getArgs (args, types = {}) {
    const typeMap = Object.assign({}, defaultArgTypes, types)

    const parsed = {}

    Object.keys(args).forEach(index => {
      const argValue = args[index]
      const argType = typeof argValue

      if (typeMap[argType]) {
        const argName = typeMap[argType]

        if (typeof argName === 'string') {
          parsed[argName] = argValue
        } else if (typeof argName === 'function') {
          const argKey = argName(argValue)
          parsed[argKey] = argValue
        } else if (typeof argName !== 'boolean') {
          Utility.error(`Invalid arg name for type: ${argType}! Arg name must be string or function.`)
        }
      } else if (argType !== 'undefined') {
        Utility.warn('Unknown argument type: ', argType)
      }
    })

    // Utility.debug('Processing raw args:', args);
    // Utility.debug('Parsed args:', parsed);

    return parsed
  }

  static colorize (args, color) {
    if (typeof colors[color] === 'function') {
      Object.keys(args).forEach(key => {
        if (typeof args[key] === 'string') {
          args[key] = colors[color](args[key])
        }
      })
    }

    return args
  }

  static dateString () {
    let stamp = new Date().toISOString()

    return `[${stamp}] `
  }

  static log () {
    console.log(Utility.dateString(), ...Utility.colorize(arguments, 'green'))
  }

  static warn () {
    console.warn(Utility.dateString(), colors.yellow('WARN: '), ...Utility.colorize(arguments, 'yellow'))
  }

  static debug () {
    if (isVerbose) {
      Utility.log(colors.cyan('DEBUG: '), ...Utility.colorize(arguments, 'cyan'))
    }
  }

  static error () {
    const msg = (typeof arguments[0] === 'string' ? arguments[0] : 'Unknown error')

    console.error(Utility.dateString(), colors.red('ERROR: '), ...Utility.colorize(arguments, 'red'))

    throw new Error(msg)
  }

  static requireParams (params, requiredKeys = []) {
    requiredKeys.forEach(key => {
      if (typeof params[key] === 'undefined') {
        Utility.error(`Missing required parameter: '${key}'`)
      }
    })
  }
}

module.exports = Utility
