const sharedConfig = require('@govbr-ds/release-config')

module.exports = {
  branches: [...sharedConfig.branches],
  plugins: [
    sharedConfig.plugins.commitAnalyzer,
    sharedConfig.plugins.releaseNotes,
    sharedConfig.plugins.changelog,
    sharedConfig.plugins.git,
    sharedConfig.plugins.gitlab,
  ],
}
