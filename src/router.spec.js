/* eslint-disable
 import/no-extraneous-dependencies,
 react/jsx-filename-extension,
 react/prop-types
 */
/* eslint-env jest */
import React from 'react'
import renderer from 'react-test-renderer'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import sinon from 'sinon'
import router from './router'

const Component = props => <div>{JSON.stringify(props)}</div>

const store = createStore(() => ({
  router: {
    result: {
      title: 'TITLE_1',
      parent: {
        title: 'TITLE_2',
      },
    },
  },
}))

const snap = (title, options, st = store) => {
  const Decorated = router(title, options)(Component)

  const component = renderer.create(
    <Provider store={st}>
      <Decorated prop1="prop1" show />
    </Provider>,
  )

  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
}

describe('Router -redux-little-router- HOC', () => {
  it('should print Component on first level', () => snap('TITLE_1'))
  it('should not print Component', () => snap('TITLE_42'))
  it('should print Component on second level', () => snap('TITLE_2'))
  it('should not print Component on second level (absolute mode)', () => snap('TITLE_2', { absolute: true }))
  it('should match multiple routes -one failed, one is ok-', () => snap(['TITLE_42', 'TITLE_1']))
  it('should match multiple routes -one failed, one is ok with absolute-', () => snap(['TITLE_42', 'TITLE_1'], { absolute: true }))
  it('should match multiple routes -both are ok-', () => snap(['TITLE_2', 'TITLE_1']))
  it('should match multiple routes -both are ko-', () => snap(['TITLE_42', 'TITLE_43']))
  it('should match multiple routes -both are ko because of absolute-', () => snap(['TITLE_2', 'TITLE_42'], { absolute: true }))

  describe('Errors', () => {
    let spy
    beforeEach(() => { spy = sinon.stub(console, 'error') })
    afterEach(() => { spy.restore() })

    const snapError = (state) => {
      snap('TITLE_1', undefined, createStore(() => state))
      expect(spy.calledOnce).toBe(true)
      expect(spy.getCall(0).args[0]).toEqual('/HOC/ Router | There is no route found in `state.router.result`')
    }

    it('should print an error when router reducer is not found', () => snapError({}))
    it('should print an error when no result is found', () => snapError({ router: {} }))
  })
})

/* eslint-enable
 import/no-extraneous-dependencies,
 react/jsx-filename-extension,
 react/prop-types
 */
