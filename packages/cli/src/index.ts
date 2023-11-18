import 'reflect-metadata';
import {program} from 'commander';
import {disposeContext, initContext, logEndAndClose, logErrorAndStop, runDiff, runPull, runPush,} from './lib';
import Path from 'path';
import {runUntrack} from './lib/commands/untrack';

const defaultDumpPath = Path.join(process.cwd(), 'directus-config');
const defaultSnapshotPath = 'snapshot';
const defaultCollectionsPath = 'collections';

program
  .option('-d, --debug', 'display more logging', false)
  .option(
    '-u, --directus-url <directusUrl>',
    'Directus URL. Can also be set via DIRECTUS_URL env var',
  )
  .option(
    '-t, --directus-token <directusToken>',
    'Directus access token. Can also be set via DIRECTUS_TOKEN env var',
  )
  .option(
    '--no-split',
    'should the schema snapshot be split into multiple files',
    true,
  )
  .option(
    '--dump-path <dumpPath>',
    'the base path for the dump, must be an absolute path',
    defaultDumpPath,
  )
  .option(
    '--collections-path <collectionPath>',
    'the path for the collections dump, relative to the dump path',
    defaultCollectionsPath,
  )
  .option(
    '--snapshot-path <snapshotPath>',
    'the path for the schema snapshot dump, relative to the dump path',
    defaultSnapshotPath,
  )
  .option(
    '-f, --force',
    'force the diff of schema, even if the Directus version is different',
    false,
  );

registerCommand(
  'pull',
  'get the schema and collections and store them locally',
  runPull,
);
registerCommand(
  'diff',
  'describe the schema and collections diff. Does not modify the database.',
  runDiff,
);
registerCommand('push', 'push the schema and collections', runPush);
registerCommand('untrack', 'stop tracking of an element', runUntrack)
  .option('-c, --collection <collection>', 'the collection of the element')
  .option('-i, --id <id>', 'the id of the element to untrack');

program.parse(process.argv);

function registerCommand(
  name: string,
  description: string,
  action: (options?: any) => Promise<void>,
) {
  return program
    .command(name)
    .description(description)
    .action((options) => {
      return initContext(program.opts())
        .then(() => action(options))
        .catch(logErrorAndStop)
        .then(disposeContext)
        .then(logEndAndClose);
    });
}
