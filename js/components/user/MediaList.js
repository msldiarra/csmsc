import React from 'react'
import _ from 'lodash'
import ReactDOM from 'react-dom'

export default class MediaList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isVisible: false}
    }

    showFiles() {

        this.setState({isVisible: true})
    }

    handleClick(e) {

        e.preventDefault()

        const name = e.target.parentNode.getAttribute('data-name');
        const id = e.target.parentNode.getAttribute('data-id');

        this.props.onDeleteMedia(id, name);
    }

    handleDocumentClick = (e) =>  {

        const area = ReactDOM.findDOMNode(this.refs.files);
        if(!area.contains(e.target)) {
            this.setState({isVisible: false})
        }
    }

    componentDidMount() {

        document.getElementById('root').addEventListener('click', this.handleDocumentClick);
    }

    componentWillUnmount(){
        document.getElementById('root').removeEventListener('click', this.handleDocumentClick);
    }



    render() {

        let memberList, firstMedia = ''
        const visibility = this.state.isVisible? "visible": "hidden";

        if(this.props.media) {

            firstMedia = this.props.media[0].node

            memberList = _.drop(this.props.media).map(function (edge) {
                return (
                    <li className="" key={edge.node.id} >
                        <span>
                            <a href={edge.node.uri} className="col-md-10" style={{overflow:'hidden', textOverflow: 'ellipsis'}} download>
                                <i className="fa fa-file-pdf-o" aria-hidden="true"></i> {edge.node.name}
                            </a>
                            <span className="opacity-54" data-id={edge.node.id} data-name={edge.node.name} onClick={this.handleClick.bind(this)} >
                                <i className="fa fa-trash-o" aria-hidden="true"></i>
                            </span>
                        </span>
                    </li>
                )
            }.bind(this));
        }


        return (
            <div ref="files" className="row" onMouseOver={this.showFiles.bind(this)}>
                <div className="col-md-12 row"  key={firstMedia.id} data-id={firstMedia.id} data-uri={firstMedia.uri} >
                    <div className="row" style={{height:'34px', lineHeight: '34px', verticalAlign: 'middle'}}>
                        <a className="col-md-8" style={{overflow:'hidden', textOverflow: 'ellipsis', cursor: 'pointer'}} download>
                            <i className="fa fa-file-pdf-o" aria-hidden="true"></i> {firstMedia.name}
                            </a>
                        <span className="col-md-4 opacity-54 text-center" data-id={firstMedia.id} data-name={firstMedia.name} onClick={this.handleClick.bind(this)}>
                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                        </span>
                    </div>
                </div>
                <div className="autocomplete col-md-12 row" style={{visibility :  visibility}}>
                    <ul className="col-md-12">
                        {memberList}
                    </ul>
                </div>
            </div>
        );
    }
}
