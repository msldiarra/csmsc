import React from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay'


class SearchVFQ extends React.Component {

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
            const ref = target.getAttribute('data-ref');
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
            const id = target.getAttribute('data-id');

            ReactDOM.findDOMNode(this.refs.locationInput)
                .value = name;
            this.props.onLocationEnter({'id': id,'name': name, 'ref' : ref});
            this.setState({searchedText: '', isVisible: false},
                () =>  this.props.relay.forceFetch({search: '' })
            )
        }
    }

    handleDocumentClick = (e) =>  {

        const area = ReactDOM.findDOMNode(this.refs.vfq_area);
        if(!area.contains(e.target)) {
            this.setState({isVisible: false})
        }
    }

    componentDidMount() {

        document.getElementById('root').addEventListener('click', this.handleDocumentClick);

        let location = this.props.defaultValue ? this.props.defaultValue : undefined
        if(location)
            this.props.onLocationEnter({'id': location.id,'name': location.name, 'ref' : location.ref});
    }

    componentWillUnmount(){
        document.getElementById('root').removeEventListener('click', this.handleDocumentClick);
    }

    render() {

        let tabIndex = 2;
        let vfqs = ""
        let locationName = this.props.defaultValue ? this.props.defaultValue.name : undefined

        if(this.props.viewer.vfq) {
            vfqs = this.props.viewer.vfq.edges.map(function (edge) {

                tabIndex++;

                return <li key={edge.node.id} data-id={edge.node.id} data-ref={edge.node.ref} data-name={edge.node.name}
                           tabIndex={tabIndex} className="col-md-12 col-lg-12 col-xs-12"
                           onClick={this.handleClick.bind(this)} onKeyDown={this.handlePressEnter.bind(this)}>
                    <div><b>{edge.node.name}</b></div>
                </li>
            }.bind(this));
        }

        const visibility = this.state.isVisible? "visible": "hidden";
        const placeHolder = this.props.placeHolder;

        return (
        <div  ref="vfq_area" >
                <input ref="locationInput"
                       type="text"
                       className="form-control text-center"
                       placeholder={placeHolder}
                       onChange={this.handleSearch.bind(this)}
                       autoComplete="off"
                       tabIndex="1"
                       defaultValue={locationName}
                />
                <div className="autocomplete col-md-12 col-lg-12 col-xs-12 row" style={{visibility :  visibility}}>
                    <ul id="places" tabIndex="1" className="col-md-12 col-lg-12 col-xs-12">
                        {vfqs}
                    </ul>
                </div>
        </div>)
    }
}

export default Relay.createContainer(SearchVFQ, {

    initialVariables: {search: "", communeRef: ""},

    fragments: {
        viewer: () => Relay.QL`
          fragment on Viewer {
                id,
                vfq(communeRef: $communeRef, search: $search, first: 50) {
                  edges {
                    node {
                      id
                      ref
                      name
                    }
                  },
                }
          }
    `,
    },
});