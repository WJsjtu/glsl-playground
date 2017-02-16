import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import CodeMirrorEditor from './CodeMirrorEditor';

import FragmentShader from './FragmentShader';

export default class Playground extends Component {

    constructor(props) {
        super(props);
        this.handleCodeChange = ::this.handleCodeChange;
        this.onToggle = ::this.onToggle;
        this.state = {
            isOpen: true,
            code: this.props.codeText
        };
    }

    onToggle(event) {
        event.stopPropagation();
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    handleCodeChange(value) {
        this.setState({code: value});
        clearTimeout(this.timeoutID);
        const _this = this;
        this.timeoutID = setTimeout(function () {
            _this.executeCode(_this.state.code);
            clearTimeout(_this.timeoutID);
        }, 500);
    }

    executeCode(shader) {
        try {
            this.shaderInstance.execute(shader);
        } catch (e) {
            console.log(e.toString());
            if (this.shaderInstance) {
                this.shaderInstance.dispose();
            }
        }
    }

    componentDidMount() {
        const mountNode = findDOMNode(this.refs.mount);
        this.shaderInstance = new FragmentShader(mountNode);
        this.executeCode(this.state.code);
    }

    render() {

        const buttonHeight = 40;

        const commonMargin = 10;

        return (
            <div style={{position: 'relative', margin: 0, padding: 0}}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    margin: 0,
                    padding: 0,
                    zIndex: 999,
                    width: window.innerWidth,
                    height: buttonHeight,
                    opacity: 0.9,
                    overflow: 'hidden'
                }}>
                    <span style={{
                        display: 'inline-block',
                        marginLeft: commonMargin,
                        fontSize: 13,
                        backgroundColor: '#333333',
                        color: '#ffffff',
                        cursor: 'pointer',
                        lineHeight: 1,
                        marginTop: 5,
                        padding: `${(buttonHeight - 13 - 10) / 2}px 8px`
                    }} onClick={this.onToggle}>Toggle editor</span>
                </div>
                <div style={{
                    display: this.state.isOpen ? 'block' : 'none',
                    position: 'absolute',
                    top: buttonHeight + commonMargin,
                    left: 0,
                    margin: 0,
                    padding: 0,
                    marginLeft: commonMargin,
                    zIndex: 998,
                    width: window.innerWidth - commonMargin * 2,
                    height: window.innerHeight - buttonHeight - commonMargin * 2,
                    opacity: 0.7,
                    overflow: 'auto'
                }}>
                    <CodeMirrorEditor onChange={this.handleCodeChange}
                                      codeText={this.state.code}
                                      lineNumbers={this.props.showLineNumbers}
                    />
                </div>
                <div style={{position: 'absolute', top: 0, left: 0, margin: 0, padding: 0, zIndex: 997}}>
                    <canvas width={window.innerWidth} height={window.innerHeight} ref='mount'>
                        Please use a browser that supports "canvas"
                    </canvas>
                </div>
            </div>
        );
    }
}

Playground.propTypes = {
    codeText: PropTypes.string.isRequired,
    showLineNumbers: PropTypes.bool
};

Playground.defaultProps = {
    showLineNumbers: true
};
