import test from 'ava';
import indentString from 'indent-string';
import execa from 'execa';
import pkg from './package';
import m from './';

global.Promise = Promise;

test('return object', t => {
	const cli = m({
		env: ['nothing'],
		argv: ['foo', '--foo-bar', '-u', 'cat', '--', 'unicorn', 'cake'],
		help: `
			Usage
			  foo <input>
		`
	}, {
		'alias': {u: 'unicorn'},
		'default': {woofwoof: 'dog'},
		'--': true
	});

	t.is(cli.input[0], 'foo');
	t.true(cli.flags.fooBar);
	t.is(cli.flags.woofwoof, 'dog');
	t.is(cli.flags.unicorn, 'cat');
	t.deepEqual(cli.input, ['foo', 'unicorn', 'cake']);
	t.is(cli.pkg.name, 'woofwoof');
	t.is(cli.help, indentString('\nCLI app helper forked from meow\n\nUsage\n  foo <input>\n', 2));
});

test('support help shortcut', t => {
	const cli = m(`
		unicorn
		cat
	`);
	t.is(cli.help, indentString('\nCLI app helper forked from meow\n\nunicorn\ncat\n', 2));
});

test('spawn cli and show version', async t => {
	const {stdout} = await execa('./fixture.js', ['--version']);
	t.is(stdout, pkg.version);
});

test('spawn cli and show help screen', async t => {
	const {stdout} = await execa('./fixture.js', ['--help']);
	t.is(stdout, indentString('\nCustom description\n\nUsage\n  foo <input>\n', 2));
});

test('spawn cli and test input', async t => {
	const {stdout} = await execa('./fixture.js', ['-u', 'cat']);
	t.is(stdout, 'woofwoof\ncamelCaseOption\ntype\nu\nunicorn\n$0');
});

test('spawn cli and test input flag', async t => {
	const {stdout} = await execa('./fixture.js', ['--camel-case-option', 'bar']);
	t.is(stdout, 'bar');
});

test.serial('pkg.bin as a string should work', t => {
	m({
		pkg: {
			name: 'browser-sync',
			bin: 'bin/browser-sync.js'
		}
	});

	t.is(process.title, 'browser-sync');
});

test('single character flag casing should be preserved', t => {
	t.is(m({env: [''], argv: ['-F']}).flags.F, true);
});

/* Behavour is too diference in minimist from yargs
test('type inference', t => {
	t.is(m({env: [''], argv: ['5']}).input[0], '5');
	t.is(m({env: [''], argv: ['5']}, {string: ['_']}).input[0], '5');
	t.is(m({env: [''],
		argv: ['5'],
		inferType: true
	}).input[0], 5);
	t.is(m({env: [''],
		argv: ['5'],
		inferType: true
	}, {env: [''], string: ['foo']}).input[0], 5);
	t.is(m({env: [''],
		argv: ['5'],
		inferType: true
	}, {env: [''], string: ['_', 'foo']}).input[0], 5);
});
*/
