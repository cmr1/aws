'use strict'

const fs = require('fs')
const Cmr1Cli = require('cmr1-cli')

const cli = new Cmr1Cli()

const aws_env_groups = [
  [
    'AWS_PROFILE'
  ],
  [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY'
  ]
]

function succeed (env_group) {
  cli.success(`Using AWS credentials defined by: ${env_group.join(' & ')}`)
  process.exit(0)
}

function fail () {
  cli.warn('Locate the missing CMR1 Travis CI AWS account keys, and export as ENV variables before testing.')
  cli.error('Unable to find CMR1 AWS test account credentials!')

  process.exit(1)
}

aws_env_groups.forEach(env_group => {
  let is_valid = true

  env_group.forEach(env_var => {
    if (typeof process.env[env_var] === 'undefined' || process.env[env_var].trim() === '') {
      cli.warn(`Unable to find '${env_var}' in environment.`)
      is_valid = false
    }
  })

  if (is_valid) {
    succeed(env_group)
  }
})

fail()
