import React from 'react'
import _ from 'lodash'
import ReactDOM from 'react-dom'

export default class MediaList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isVisible: false}
    }

    handleClick(e) {

        e.preventDefault()

        const name = e.target.parentNode.getAttribute('data-name');
        const id = e.target.parentNode.getAttribute('data-id');

        this.props.onDeleteMedia(id, name);
    }


    render() {

        let mediaList = ''
        if(this.props.media) {

            mediaList = this.props.media.map(function (edge) {
                return (
                    <li className="" key={edge.node.id} style={{lineHeight:'28px'}} >
                        <span className="row">
                            <a href={edge.node.uri} className="col-md-10 col-xs-10 col-sm-10" style={{overflow:'hidden', textOverflow: 'ellipsis'}} download>
                                <i className="fa fa-file-pdf-o" aria-hidden="true"></i> {edge.node.name}
                            </a>
                            <span className="opacity-54 text-center" data-id={edge.node.id} data-name={edge.node.name} onClick={this.handleClick.bind(this)} >
                                <i className="fa fa-trash-o" aria-hidden="true"></i>
                            </span>
                        </span>
                    </li>
                )
            }.bind(this));
        }


        return (
            <ul className="dropdown-menu" style={{width:'100%'}} aria-labelledby="dropdownMenu1">
                {mediaList}
            </ul>);
    }
}
