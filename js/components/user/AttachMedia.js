import React from 'react'


export default class AttachMedia extends React.Component {


    onMediaInsert() {

        const file = this.refs.fileInput.files.item(0);
        const uri = '/docs/' + file.name;
        this.refs.fileName.value = file.name;

        this.props.onMediaInsert(file, uri);
        this.props.onAddMedia(file.name);
    }

    render() {

        return (
            <div className="row">
                    <div className="input-group">
                        <label className="input-group-btn">
                            <span className="btn btn-default">
                                Scan document&hellip; <input ref="fileInput"
                                                                 type="file"
                                                                 multiple
                                                                 onChange={this.onMediaInsert.bind(this)} style={{display: 'none'}}/>
                            </span>
                        </label>
                        <input type="text" ref="fileName" className="form-control" readOnly />
                    </div>
            </div>)
    }
}