import {React, ReactDom} from '../src/index'
import App from './App.js'

const dom = (<div data-set={'haha'} title={'xixi'} id={'demo'} className={'main'} onClick={() => {
}} style={'color:green;text-align:center'}>
    <h1>Breact</h1>
    <span>hello breact framework</span>
</div>);

const Comp1 = (props) => {
    return (
        <div>
            哈哈哈哈
            {/*<h4>哈哈哈哈</h4>*/}
            {/*<p>完美的组件渲染机制</p>*/}
            {/*<App/>*/}
        </div>
    )
};

class Comp2 extends React.Component {
    constructor(props) {
        super(props);
        // console.log('constructor');
        this.props = props;
        this.state = {
            count: 0
        }
    }

    componentDidMount() {
        // console.log('componentDidMount', this.state)
    }

    componentDidUpdate() {
        // console.log('我更新啦')
    }

    add() {
        this.setState({
            count: this.state.count + 1
        })
    }

    reduce() {
        this.setState({
            count: this.state.count - 1
        })
    }

    crazy() {
        for (let i = 0; i < 100; i++) {
            this.setState({count: this.state.count + 1});
            console.log(this.state.count)
        }
    }

    render() {
        // console.log('render');
        return (<div>
            <h3>{this.props.name}</h3>
            <p>我是一个类组件</p>
            <p>我的内部状态是 {this.state.count}</p>
            <button onClick={() => this.add()}>+</button>
            <button onClick={() => this.reduce()}>-</button>
            <button onClick={() => this.crazy()}>疯狂</button>
        </div>)
    }


}

ReactDom.render(<div><Comp2 name={'组件'}/></div>, document.getElementById('root'));

