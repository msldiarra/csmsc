import React from 'react'
import Relay from 'react-relay'
import SearchVFQ from './SearchVFQ'

class MemberEdit extends React.Component {

    
    constructor(props) {

        super(props);
        this.state = {
            locationId: '',
            locationName: '',
            locationRef: '',
            message: ''
        } ;
    }

    onLocationEnter(location) {
        this.setState({locationId: location.id, locationName: location.name, locationRef: location.ref}, () => this.handleLineFilled());
    }

    handleLineFilled() {

        let roleId = this.props.role.id;
        let firstName = this.refs.firstName.value;
        let lastName = this.refs.lastName.value;
        let nina = this.refs.nina.value;
        let contact = this.refs.contact.value;
        let locationId = this.state.locationId;

        var member = {
            'roleId': roleId,
            'firstName': firstName,
            'lastName': lastName,
            'nina': nina,
            'contact': contact,
            'locationId': locationId
        }

        this.props.onMemberFilled(member);

    }

    componentWillMount() {
    }

    componentDidMount() {
    }


    render() {

        var roleName = this.props.role.name;
        var roleId = this.props.role.id;

        let defaultFirstName = this.props.member? this.props.member.firstName : '';
        let defaultLastName = this.props.member? this.props.member.lastName : '';
        let defaultNINA = this.props.member? this.props.member.nina : '';
        let defaultContact = this.props.member? this.props.member.contact : '';
        let defaultLocation = this.props.member? this.props.member.location : '';

        let communeRef = this.props.communeRef

        return (
                <tr id={roleId}>
                    <th className="role" >{roleName}</th>
                    <td><input type="text" ref="firstName" defaultValue={defaultFirstName} className="form-control text-center" placeholder="" onChange={this.handleLineFilled.bind(this)} /></td>
                    <td><input type="text" ref="lastName" defaultValue={defaultLastName} className="form-control text-center" placeholder="" onChange={this.handleLineFilled.bind(this)} /></td>
                    <td><input type="text" ref="nina" defaultValue={defaultNINA} className="form-control text-center" placeholder="" onChange={this.handleLineFilled.bind(this)} /></td>
                    <td><input type="text" ref="contact" defaultValue={defaultContact}  className="form-control text-center" placeholder="" onChange={this.handleLineFilled.bind(this)} /></td>
                    <td><SearchVFQ {...this.props} communeRef={communeRef} defaultValue={defaultLocation}  onLocationEnter={this.onLocationEnter.bind(this)} /></td>
                </tr>
        );
    }
}


export default Relay.createContainer(MemberEdit, {

    fragments: {
        viewer: (vars) => Relay.QL`
          fragment on Viewer {
               ${SearchVFQ.getFragment('viewer', vars)}
          }
    `,
    }
});