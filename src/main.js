import {Component, createElement, render} from './toyReact';


class MyComponent extends Component{
    render () {
        return (
            <div className={'my_c'}>
                <header>
                    <h1>This is the header</h1>
                </header>
                {this.children}
            </div>
        )
    }
}


render((
    <MyComponent id={'132'} className={'my_component'}>
        <main>核心内容</main>
        <footer>页脚</footer>
    </MyComponent>
), document.body);
