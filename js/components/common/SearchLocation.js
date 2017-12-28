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
            const location = e.target.getAttribute('data-location');
            ReactDOM.findDOMNode(this.refs.locationInput)
                .value = location.city? location.city +', '+ location.country: location.country;
            this.props.onLocationEnter(location);
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

            const city = target.getAttribute('data-city');
            const country = target.getAttribute('data-country');
            const countryCode = target.getAttribute('data-code');
            ReactDOM.findDOMNode(this.refs.locationInput)
                .value = city? city +', '+ country: country;
            this.props.onLocationEnter({'city': city, 'country': country, 'countryCode': countryCode});
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

        var places = this.props.viewer.places.edges.map(function(edge){

            const place = edge.node.city ? edge.node.city +', '+ edge.node.country : edge.node.country;
            tabIndex++;

            return <li key={edge.node.id}   data-city={edge.node.city} data-country ={edge.node.country} data-code ={edge.node.code} tabIndex={tabIndex} className="col-md-12 col-lg-12 col-xs-12"
                       onClick={this.handleClick.bind(this)}  onKeyDown={this.handlePressEnter.bind(this)} >
                        <div><b>{place}</b></div>
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
                        {places}
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
                places(search: $search, first: 100) {
                  edges {
                    node {
                      id
                      country
                      city
                      code
                    }
                  },
                },
          }
    `,
    },
});