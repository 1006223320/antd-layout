import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import Layout from '../components/layout/Layout'
import Login from '../pages/login/Login'
import AuthorizedRoute from './AuthorizedRoute'
import NoFound from '../pages/noFound/NoFound'

import Home from '../pages/home/Home'
import PatList from '../pages/pat/PatList'
import BaseData from '../pages/data/BaseData'

export const Router = () => (
		<BrowserRouter>
			<div>
				<Switch>
					<Route path="/login" component={Login} />
					<Redirect from="/" exact to="/login"/>{/*注意redirect转向的地址要先定义好路由*/}
					<AuthorizedRoute component={Layout} />
					<Route component={NoFound}/>
				</Switch>
			</div>
		</BrowserRouter>
)


export const routes = [
	{
		path: '/home',
		name: '首页',
		icon: 'home',
		component: Home
	},
	{
		path: '/data',
		name: '数据统计',
		icon: 'smile',
		children: [
			{
				path: '/data/base',
				name: '基础数据',
				breadcrumbName: '基础数据',
				icon: 'smile',
				component: BaseData
			}
		]
	},
	{
		path: '/pat',
		name: '用户管理',
		icon: 'user',
		children: [
			{
				path: '/pat/list',
				name: '用户列表',
				icon: 'list',
				component: PatList
			}
		]

	},
]







