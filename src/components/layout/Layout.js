import React, { useState } from 'react'
import { withRouter, Route, Link, Switch } from 'react-router-dom'
import { routes } from '../../routes/router'
import Header from '../header/Header'
import { Layout, Menu, Icon, Breadcrumb, PageHeader } from 'antd'

const {  Sider, Content, Footer } = Layout
const { SubMenu } = Menu
// 面包屑配置[]
function breadcrumb() {
  const breadcrumbRouters = []
  routes.forEach( (route, params, routes)=> {
    route.breadcrumbName = route.name
    // 首页面包屑
    if(routes.indexOf(route) === 0) return (
      breadcrumbRouters[0] = route
    )

    const pathArr = location.pathname.split('/') || []
    if(route.path == '/'+pathArr[1] ){
      breadcrumbRouters[1] = route
      route.children && route.children.map( children => {
        children.breadcrumbName = children.name
        breadcrumbRouters[2] = children
      })
    }

  })
  return breadcrumbRouters
}

function ProLayout(props) {
    console.log(props)
    const { location } = props
    const breadcrumbRouters = breadcrumb()
    const [current, setCurrent] = useState({
      key: breadcrumbRouters[breadcrumbRouters.length-1].name,
      path: breadcrumbRouters[breadcrumbRouters.length-1].path
    })
    const [collapsed, setCollapsed] = useState(false)

    return (

      <Layout style={{ height:'100%' }}>
        {/* 菜单栏 */}
        <Sider
          trigger={null}
          collapsible={true}
          collapsed={collapsed}
          >
          <div className="white p2 flex a-center" >
            <img className={[collapsed && 'centered']} src='http://diandianys.com/static/ddysVuePic/logo.png' width='40px'/>
            {!collapsed && <div className='px2 f4'>点点医生</div>}
          </div>
          <Menu
            theme="dark"
            onClick={(e) => setCurrent(e)}
            selectedKeys={[current.key]}
            mode="inline"
          >
            {
              routes.map( (item, menuIdx) => {
                if (item.children instanceof Array) {
                  return (
                    <SubMenu key={item.name}
                            title={<span><Icon type={item.icon} /><span>{item.name}</span></span>}>
                      {
                        item.children.map( (subItem, subItemIdx) => (
                          <Menu.Item key={subItem.name}>
                            <Link to={subItem.path}>{subItem.name}</Link>
                          </Menu.Item>
                        ))
                      }
                    </SubMenu>
                  )
                } else {
                  return (
                    <Menu.Item key={item.name}>
                      <Link to={item.path}>
                        <Icon type={item.icon} /><span>{item.name}</span>
                      </Link>
                    </Menu.Item>
                  )
                }
              })
            }
          </Menu>
        </Sider>

        <Layout>
          {/* 右边头部组件 */}
          <Header handleCollapsed={()=> setCollapsed(!collapsed)}/>
        {/* 带页头的面包屑 */}
          {console.log(breadcrumbRouters)}
          <Breadcrumb className='bg-white f4 px4 pt3'>
            <Breadcrumb.Item href={breadcrumbRouters[0].path}>
              <Icon type="home" />
              <span>{breadcrumbRouters[0].name}</span>
            </Breadcrumb.Item>
            {breadcrumbRouters.map( (breadcrumb, breadcrumbIdx)=> {
              if(breadcrumbIdx!==0) return (
                <Breadcrumb.Item key={breadcrumbIdx}  >
                  <span>{breadcrumb.name}</span>
                </Breadcrumb.Item>
              )
            })}

          </Breadcrumb>
          <PageHeader title={current.key} />
          {/* 主体内容 */}
          <Content className='m3 bg-white'>

            {/* 动态route component */}
            <Switch>
              {routes.map( (route, routeIdx) => {
                if(route['children']) return route['children'].map( (children, childrenIdx) => {
                      return (<Route key={children.name} path={children.path} component={children.component} />)
                    })
                if(!route['children'])return(<Route key={route.name} path={route.path} component={route.component} />)
                })
              }
            </Switch>
          </Content>
          <Footer>
            <center className="gray f5">©2019 点点医生</center>
            <center className="gray f5">点点医生出品</center>
          </Footer>

        </Layout>
      </Layout>
    )
}
export default withRouter(ProLayout)