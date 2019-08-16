// redux
import { combineReducers, applyMiddleware, createStore, compose } from 'redux'

// redux-query
import { queryMiddleware } from 'redux-query'
import superagentInterface from 'redux-query-interface-superagent'
import { entitiesReducer, queriesReducer } from 'redux-query'

// redux-router
// import Router from 'next/router'
// import { createRouterMiddleware, initialRouterState } from 'connected-next-router'

// reducers/redux-persist
import loginReducer from './reducer/loginReducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// redux-raven-middleware
// sentry报错上传所有的actions中间件
// 临时用，会导致报两次，因不同的sdk，后续改为自行log更好，连同redux-logger可以一并去掉
import Raven from 'raven-js'
import createRavenMiddleware from 'raven-for-redux'

// 开发提示类中间件
import reduxUnhandledAction from 'redux-unhandled-action'

const rootReducer = combineReducers({
	loginState: loginReducer,
  entities: entitiesReducer,
  queries: queriesReducer,
})

// presistReducer
const persistedReducer = persistReducer(
  {
    key: 'ddys-crm', // key is required
    storage, // storage is now required
    whitelist: ['app', 'loginState', 'router'], // 存在的key
  },
  rootReducer,
)


// redux-query
const getQueries = state => state.queries
const getEntities = state => state.entities

// 中间件
// @ts-ignore
Raven.config('http://0a02e02060674543808f87c198279e1d@sentry.diandianys.com/2').install()
const middleWare = [
  queryMiddleware(superagentInterface, getQueries, getEntities),
  createRavenMiddleware(Raven, {
    // @see: https://github.com/captbaritone/raven-for-redux
    breadcrumbMessageFromAction: action => {
      return `【 ${action.type} 】`
    },
    breadcrumbDataFromAction: action => {
      return action.payload || action // 是否显示详情, 默认不显示
    },
    breadcrumbCategory: 'redux-action',
  }),
]

if (process.env.NODE_ENV === 'development' || true) {
  const { createLogger } = require('redux-logger')
  // 加日志中间件
  middleWare.push(
    createLogger({
      // redux-logger设置
      // @see: https://github.com/LogRocket/redux-logger/blob/master/src/defaults.js#L12-L18
      // @todo: 不如自己写的中间件console.log

      // predicate: (getState, action) => !action.type.match(/@@query/), //不打印的动作
      actionTransformer: action => action, // 转换
      collapsed: true, // 是否收缩
      level: {
        // action: action => !action.type.match(/@@query/) && 'log',
        error: 'error',
      },
      titleFormatter: (action, time) =>
        `${time}【${action.type}】=> ${JSON.stringify(action.payload || action)
          .slice(0, 500)
          .replace(/"/g, '')
          .replace(/:/g, '=')
          .replace(/,/g, ', ')}`, // (in ${took.toFixed(2)} ms)
      // diff: true,
      diffPredicate: (_getState, action) =>
        !action.type.match(/@@query|persist|fetch|changeTitle/),
    }),
  )
  // actions未导致状态改变警告
  middleWare.push(
    reduxUnhandledAction(action =>
      console.error(`${JSON.stringify(action)} didn't lead to creation of a new state object`),
    ),
  )
} 

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const initialState = {
  // app: { title: '点点医生' },
  router: { 'pathname': '/', 'asPath': '/' },
}
const store = createStore(persistedReducer, {}, composeEnhancer(applyMiddleware(...middleWare)))

export const persistor = persistStore(store)

export default store
