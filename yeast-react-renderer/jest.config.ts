import type { Config } from '@jest/types';
import { defaults as tsJestDefaults } from 'ts-jest/presets';

const config: Config.InitialOptions = {
	roots: ['src/__tests__/tests/'],
	moduleNameMapper: {
		// Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
		uuid: require.resolve('uuid'),
	},
	preset: 'ts-jest',
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/tsconfig.json',
			diagnostics: { warnOnly: true },
		},
		__DEV__: true,
		__TEST__: true,
	},
	testTimeout: 10000,
	testEnvironment: 'jsdom',

	transform: {
		...tsJestDefaults.transform,
		// see note on transformIgnorePatterns
		'^.+\\.tsx?$': 'ts-jest',
		'.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
	},
	// This added to workaround an issue where genesys-spark-components-react is in ESM format
	// Normally jest doesn't transpile node_modules, but we can opt-into it
	transformIgnorePatterns: ['/node_modules/(?!(genesys-react-components|genesys-dev-icons|yeast-core)/)'],
};

export default config;
