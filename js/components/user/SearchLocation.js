import React from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay'


class SearchLocation extends React.Component {

    constructor(props) {
        super(props)
        this.state = {searchedText: "", isVisible: false}
    }

    handleSearch(e) {
        var searchedText = ReactDOM.findDOMNode(this.refs.locationInput).value
        this.setState({searchedText: searchedText, isVisible: true},
            () =>  this.props.relay.forceFetch({search: searchedText })
        )

    }

    handlePressEnter(e) {

        e.preventDefault();

        if(e.keyCode === 13 ) {
            const name = e.target.getAttribute('data-name');
            const ref = e.target.getAttribute('data-ref');
            ReactDOM.findDOMNode(this.refs.locationInput)
                .value = name;
            this.props.onLocationEnter({'name': name, 'ref' : ref});
            this.setState({searchedText: '', isVisible: false},
                () =>  this.props.relay.forceFetch({search: '' })
            )
        }
    }

    handleClick(e) {

        e.preventDefault();

        var target = e.target;

        while(target && target.parentNode.tagName != 'UL') {
            target = target.parentNode;
            if(!target) return;
        }

        if(target.tagName == 'LI') {

            const name = target.getAttribute('data-name');
            const ref = target.getAttribute('data-ref');
            ReactDOM.findDOMNode(this.refs.locationInput)
                .value = name;
            this.props.onLocationEnter({'name': name, 'ref' : ref});
            this.setState({searchedText: '', isVisible: false},
                () =>  this.props.relay.forceFetch({search: '' })
            )
        }
    }

    handleDocumentClick = (e) =>  {

        const area = ReactDOM.findDOMNode(this.refs.area);
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

        var tabIndex = 2;

        var locations = this.props.viewer.locations.edges.map(function(edge){

            tabIndex++;

            return <li key={edge.node.id}   data-ref={edge.node.ref} data-name={edge.node.name}  tabIndex={tabIndex} className="col-md-12 col-lg-12 col-xs-12"
                       onClick={this.handleClick.bind(this)}  onKeyDown={this.handlePressEnter.bind(this)} >
                        <div><b>{edge.node.name}</b></div>
                    </li>
        }.bind(this));

        const visibility = this.state.isVisible? "visible": "hidden";
        const placeHolder = this.props.placeHolder;

        return (
        <div  ref="area" className="row">
                <div className="input-group col-md-12">
                    <span className="input-group-addon" aria-hidden="true" id="basic-addon1">
                        <i className="fa fa-location-arrow"></i>
                    </span>
                    <input ref="locationInput"
                           type="text"
                           className="form-control"
                           placeholder={placeHolder}
                           aria-describedby="basic-addon1"
                           onChange={this.handleSearch.bind(this)}
                           autoComplete="off"
                           tabIndex="1"
                           defaultValue={this.props.defaultValue}
                    />
                </div>
                <div className="autocomplete col-md-12 col-lg-12 col-xs-12 row" style={{visibility :  visibility}}>
                    <ul id="places" tabIndex="1" className="col-md-12 col-lg-12 col-xs-12">
                        {locations}
                    </ul>
                </div>
        </div>)
    }
}

export default Relay.createContainer(SearchLocation, {

    initialVariables: {search: ""},

    fragments: {
        viewer: () => Relay.QL`
          fragment on Viewer {
                id,
                locations(search: $search, first: 10) {
                  edges {
                    node {
                      id
                      ref
                      name
                    }
                  },
                },
          }
    `,
    },
});