import React from 'react';
import logo from './logo.svg';
import './App.css';
import JSONLint from 'jsonlint-webpack'

import AceEditor from "react-ace"
import "brace"
import "brace/mode/json"
import "brace/theme/tomorrow"
import "brace/ext/language_tools"
import "brace/ext/searchbox"

function parseLine(e) {
  const str = e+''
  let [, line] = /Parse error on line ([0-9]+)/.exec(str) || []
  line = parseInt(line) || 0
  // Convert to ace line
  return line - 1
}

function parseLintError(e) {
  const [lineStr, ...lines] = (e+'').split('\n')
  const msg = lines.join('\n')
  const line = parseLine(lineStr)
  return { line, msg }
}


class App extends React.Component {

  state = {
    jsonStr: '',
    json: null,
    validationMsg: '',
    validationLine: null,
    editor: null,
  }

  onChange = (jsonStr) => {
    console.log('jsonStr', jsonStr)
    try {
      JSONLint.parse(jsonStr)
      this.setState({ validationMsg: '', jsonStr })
    } catch(e) {
      const { msg, line } = parseLintError(e)
      this.setState({ validationMsg: msg, validationLine: line, jsonStr})
    }
  }

  setError = (err) => {
    console.log("err", err)
  }

  onLoad = (editor) => {
    this.editor = editor
    window.editor = editor
  }

  jumpTo = () =>  {
    this.editor.gotoLine(this.state.validationLine + 1)
  }


  render() {
    let annotations = []
    const { validationMsg, validationLine } = this.state

    if(validationMsg) {
      annotations.push({
        column: 0,
        row: validationLine,
        text: validationMsg,
        type: "error"
      })
    }

    return (
      <div className="App">
        <header className="App-header">
          <p>
            Such fun!
          </p>
          <AceEditor
            theme="tomorrow"
            ref={"reactAce"}
            mode="json"
            annotations={annotations}
            value={this.state.jsonStr}
            onLoad={this.onLoad}
            onChange={this.onChange}
            setOptions={{ useWorker: false }}
            editorProps={{ $blockScrolling: true }}
          />
          { validationMsg ? (
            <div>
              <button onClick={this.jumpTo}>Jump to { validationLine + 1}</button>
              <p className="error">
                {validationMsg.split("\n").map( text => (
                  <div>{text}</div>
                ))}
              </p>
            </div>
          ) : (
            <h2>Valid!</h2>
          ) }
        </header>
      </div>
    )
  }
}

export default App;
