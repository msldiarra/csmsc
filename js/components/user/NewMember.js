import React from 'react'
import Relay from 'react-relay'
import SearchVFQ from './SearchVFQ'
import SearchRole from './SearchRole'

class NewMember extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            locationId: '',
            locationName: '',
            locationRef: '',
            roleId: '',
            roleName: '',
            message: ''
        };
    }

    onLocationEnter(location) {
        this.setState({locationId: location.id, locationName: location.name, locationRef: location.ref});
        this.props.onVFQEnter(location);
    }

    onRoleEnter(role) {
        this.setState({roleId: role.id, roleName: role.name});
        this.props.onRoleEnter(role);
    }

    onChangeMemberInput(e) {



    }

    componentWillMount() {
    }

    componentDidMount() {
    }


    render() {

        let communeRef = this.props.communeRef

        return (
            <div id="memberForm" className="panel panel-default col-md-6 col-lg-4 col-xs-12 col-sm-8 center-block" style={{paddingTop:'15px'}}>
                <div className="form-group">
                    <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 center-block">
                        <label className="opacity-87">Poste</label>
                        <div className="input-group col-md-12 col-lg-12 col-xs-12 col-sm-12">
                            <SearchRole {...this.props} defaultValue='' onRoleEnter={this.onRoleEnter.bind(this)} />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 center-block">
                        <label className="opacity-87">VFQ</label>
                        <SearchVFQ {...this.props} communeRef={communeRef} defaultValue=''  onLocationEnter={this.onLocationEnter.bind(this)} />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 center-block">
                        <label className="opacity-87">Prénoms</label>
                        <input type="text" ref="firstName" name="firstName" className="form-control" placeholder="" />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 col-sm-12 center-block">
                        <label className="opacity-87">Nom</label>
                        <input type="text" ref="lastName" name="lastName"  className="form-control" placeholder="" />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 col-sm-12 center-block">
                        <label className="opacity-87">Nina</label>
                        <input type="text" ref="nina" name="nina" className="form-control" placeholder="" />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 center-block">
                        <label className="opacity-87">Contact</label>
                        <input type="text" ref="contact" name="contact" className="form-control" placeholder="" />
                    </div>
                </div>
            </div>
        );
    }
}


export default Relay.createContainer(NewMember, {

    fragments: {
        viewer: (vars) => Relay.QL`
          fragment on Viewer {
               ${SearchVFQ.getFragment('viewer', vars)}
               ${SearchRole.getFragment('viewer', vars)}
          }
    `,
    }
});