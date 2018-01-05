import React from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay'


class SearchRole extends React.Component {

    constructor(props) {
        super(props)
        this.state = {searchedText: "", isVisible: false}
    }

    handleSearch(e) {
        var searchedText = ReactDOM.findDOMNode(this.refs.roleInput).value
        this.setState({searchedText: searchedText, isVisible: true},
            () =>  this.props.relay.forceFetch({search: searchedText })
        )

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
            ReactDOM.findDOMNode(this.refs.roleInput)
                .value = name;
            this.props.onRoleEnter({'name': name, 'id' : ref});
            this.setState({searchedText: '', isVisible: false},
                () =>  this.props.relay.forceFetch({search: '' })
            )
        }
    }

    handleDocumentClick = (e) =>  {

        const area = ReactDOM.findDOMNode(this.refs.role_area);
        if(!area.contains(e.target)) {
            this.setState({isVisible: false})
        }
    }

    componentDidMount() {

        document.getElementById('root').addEventListener('click', this.handleDocumentClick);
        let role = this.props.defaultValue ? this.props.defaultValue : undefined
        if(role)
            this.props.onRoleEnter({'name': role.name, 'id' : role.id});
    }

    componentWillUnmount(){
        document.getElementById('root').removeEventListener('click', this.handleDocumentClick);
    }

    render() {

        let roleName = this.props.defaultValue ? this.props.defaultValue.name : undefined

        var roles = this.props.viewer.roleSearch.map(function(role){

            return <li key={role.id}  data-ref={role.id} data-name={role.name}  className="col-md-12 col-lg-12 col-xs-12"
                       onClick={this.handleClick.bind(this)}  >
                        <div><b>{role.name}</b></div>
                    </li>
        }.bind(this));

        const visibility = this.state.isVisible? "visible": "hidden";
        const placeHolder = this.props.placeHolder;

        return (
            <div  ref="role_area" className="row">
                    <div className="input-group col-md-12 col-lg-12 col-xs-12">
                        <span className="input-group-addon" aria-hidden="true" id="basic-addon1">
                            <i className="fa fa-user"></i>
                        </span>
                        <input ref="roleInput"
                               type="text"
                               className="form-control"
                               placeholder={placeHolder}
                               aria-describedby="basic-addon1"
                               onClick={this.handleSearch.bind(this)}
                               onChange={this.handleSearch.bind(this)}
                               autoComplete="off"
                               tabIndex="1"
                               defaultValue={roleName}
                        />
                    </div>
                    <div className="autocomplete col-md-12 col-lg-12 col-xs-12 row" style={{visibility :  visibility}}>
                        <ul id="roles" tabIndex="1" className="col-md-12 col-lg-12 col-xs-12">
                            {roles}
                        </ul>
                    </div>
            </div>
        )
    }
}

export default Relay.createContainer(SearchRole, {

    initialVariables: {search: ""},

    fragments: {
        viewer: () => Relay.QL`
          fragment on Viewer {
                id,
                roleSearch(search: $search) {
                      id
                      name
                 }
          }
    `
    },
});