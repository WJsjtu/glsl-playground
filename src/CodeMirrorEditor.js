import CodeMirror from 'codemirror';
import {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';

require('codemirror/lib/codemirror.css');
require('codemirror/mode/clike/clike.js');
require('codemirror/theme/monokai.css');

export default class CodeMirrorEditor extends Component {

    constructor(props) {
        super(props);
        this.handleChange = ::this.handleChange;
    }

    componentDidMount() {
        this.editor = CodeMirror.fromTextArea(findDOMNode(this.refs.editor), {
            mode: 'x-shader/x-fragment',
            lineNumbers: this.props.lineNumbers,
            lineWrapping: true,
            smartIndent: true,
            matchBrackets: true,
            theme: 'monokai',
            readOnly: false
        });
        this.editor.on('change', this.handleChange);
    }

    handleChange() {
        this.props.onChange && this.props.onChange(this.editor.getValue());
    }

    render() {
        return (
            <div className={this.props.className}>
                <textarea ref='editor' defaultValue={this.props.codeText}/>
            </div>
        );
    }

}

CodeMirrorEditor.propTypes = {
    codeText: PropTypes.string,
    lineNumbers: PropTypes.bool,
    onChange: PropTypes.func
};

CodeMirrorEditor.defaultProps = {
    lineNumbers: true
};
