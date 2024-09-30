import type { Config } from 'jest'

const config: Config = {
	preset: 'ts-jest', 
	testEnvironment: 'node',
	verbose: true,
	testMatch: ['**/tests/**/*.test.ts'],
	setupFilesAfterEnv: ['./jest.setup.ts'],
}
export default config

