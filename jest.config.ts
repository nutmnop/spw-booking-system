import type {Config} from 'jest'

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  preset: 'ts-jest',
  collectCoverageFrom: [ 'src/**/*.ts' ],
  coveragePathIgnorePatterns: [ 'src/types' ],
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleDirectories: [
    'node_modules'
  ],
}

export default config
