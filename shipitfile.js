module.exports = function (shipit) {
  require('shipit-deploy')(shipit);
  require('shipit-shared')(shipit);
  require('shipit-npm')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/deploy',
      deployTo: '/deploy/juce-scraper',
      repositoryUrl: 'https://github.com/conube/juce-scraper.git',
      ignores: ['.git', 'node_modules'],
      keepReleases: 2,
      deleteOnRollback: false,
      shallowClone: true,
      shared: {
        triggerEvent: false,
        overwrite: true,
        dirs: [
          'node_modules',
          {
            path: 'node_modules',
            overwrite: true
          }
        ]
      },
      npm: {
        remote: true,
        triggerEvent: false
      },
    },
    production: {
      servers: 'user@server',
      branch: 'master'
    }
  });

  shipit.task('pwd', function () {
    return shipit.remote('pwd');
  });

  shipit.task('nodev', function () {
    return shipit.remote('node --version');
  });

  shipit.task('n', function () {
    return shipit.remote('n --version');
  });

  shipit.task('whoami', function () {
    return shipit.remote('whoami');
  });

  shipit.task('startOrRestart', function () {
    var current = [shipit.config.deployTo, 'current'].join('/');
    return shipit.remote('cd ' + current + '; pm2 startOrRestart server-prod.json');
  });

  shipit.task('deploy', function () {
    return shipit.start(
      'deploy:init',
      'deploy:fetch',
      'deploy:update',
      'deploy:publish',
      'deploy:clean',
      'shared:prepare',
      'shared:create-dirs',
      'shared:set-permissions',
      'shared:link',
      'shared:end',
      'npm:init',
      'npm:install',
      'startOrRestart'
    );
  });
};
